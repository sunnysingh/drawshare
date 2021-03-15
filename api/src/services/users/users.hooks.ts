import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import { HookContext } from '@feathersjs/feathers';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

const validateCreate = () => async (context: HookContext) => {
  if (!context.data.username) {
    throw new Error('Username is required');
  }

  if (!context.data.email) {
    throw new Error('Email is required');
  }

  if (!context.data.password) {
    throw new Error('Password is required');
  }

  if (context.data.username) {
    const existing = await context.app
      .service('users')
      .find({ query: { username: context.data.username } });
    if (existing.total !== 0) throw new Error('Username already exists');
  }
};

export default {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [validateCreate(), hashPassword('password')],
    update: [hashPassword('password'), authenticate('jwt')],
    patch: [hashPassword('password'), authenticate('jwt')],
    remove: [authenticate('jwt')],
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'),
    ],
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
