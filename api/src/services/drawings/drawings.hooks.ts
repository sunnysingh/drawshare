import * as authentication from '@feathersjs/authentication';
import { HookContext } from '@feathersjs/feathers';
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

export default {
  before: {
    all: [],
    find: [parseQuery()],
    get: [],
    create: [authenticate('jwt')],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt')],
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
