import * as authentication from '@feathersjs/authentication';
import { HookContext } from '@feathersjs/feathers';
import { Forbidden, NotAuthenticated } from '@feathersjs/errors';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const validateCreate = () => async (context: HookContext) => {
  if (!context.data.username) {
    throw new Error('Username is required');
  }

  if (!Array.isArray(context.data.steps)) {
    throw new Error('Steps is required and must be an array');
  }

  if (!context.data.createdAt) {
    throw new Error('createdAt is required');
  }

  if (!context.data.drawTime) {
    throw new Error('drawTime is required');
  }

  if (typeof context.data.isPublic !== 'boolean') {
    throw new Error('isPublic is required');
  }
};

/**
 * Unfortunately, all query parameters are passed in a strings.
 * We need to parse these parameters to their correct types
 * for NeDB to perform querying logic correctly.
 */
const parseQuery = () => (context: HookContext) => {
  const isPublic: string | undefined = context.params.query?.isPublic;

  if (context.params.query && isPublic) {
    context.params.query.isPublic = isPublic === 'true';
  }

  // Only allow querying private drawings from user
  if (context.params.query?.isPublic === false) {
    if (!context.params.user?._id) throw new NotAuthenticated();
    context.params.query.userId = context.params.user?._id;
  }

  return context;
};

const setUserId = () => (context: HookContext) => {
  context.data.userId = context.params.user?._id;
  return context;
};

const isOwner = () => async (context: HookContext) => {
  const drawing = await context.app.service('drawings').get(context.id);

  if (drawing.userId !== context.params.user?._id) {
    throw new Forbidden('Only drawing owners can modify.');
  }

  return context;
};

export default {
  before: {
    all: [],
    find: [authenticate('jwt'), parseQuery()],
    get: [],
    create: [authenticate('jwt'), setUserId(), validateCreate()],
    update: [authenticate('jwt'), isOwner()],
    patch: [authenticate('jwt'), isOwner()],
    remove: [authenticate('jwt'), isOwner()],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
