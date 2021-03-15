import * as authentication from '@feathersjs/authentication';
import { HookContext } from '@feathersjs/feathers';
import { Forbidden } from '@feathersjs/errors';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

/**
 * Unfortunately, all query parameters are passed in a strings.
 * We need to parse these parameters to their correct types
 * for NeDB to perform querying logic correctly.
 */
const parseQuery = () => (context: HookContext) => {
  const isPublic: string | undefined = context.params.query?.isPublic;

  if (context.params.query && isPublic) {
    context.params.query.isPublic = Boolean(isPublic);
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
    find: [parseQuery()],
    get: [],
    create: [authenticate('jwt'), setUserId()],
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
