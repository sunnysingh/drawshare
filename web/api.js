import feathers from "@feathersjs/client";
import rest from "@feathersjs/rest-client";

const api = feathers();

const restClient = rest("http://localhost:3030");

api.configure(feathers.authentication());

api.configure(restClient.fetch(fetch));

export { api };
