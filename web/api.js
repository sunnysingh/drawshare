import feathers from "@feathersjs/client";
import rest from "@feathersjs/rest-client";

const api = feathers();

const restClient = rest("http://localhost:3030");

api.configure(
  feathers.authentication({
    // IMPORTANT: For the sake of convenience, we store the authentication
    // token in localStorage. However, there are far more secure options
    // such as using an Secure (SSL) and HTTP-only cookie.
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  })
);

api.configure(restClient.fetch(fetch));

export { api };
