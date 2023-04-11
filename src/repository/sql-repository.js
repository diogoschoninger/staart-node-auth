import Knex from "knex";

import database from "../config.js";
import { ConflictError, NotFoundError } from "../utils/errors.js";

const encodeUser = ({ username, password, firstName, lastName }) => ({
  username,
  password,
  first_name: firstName,
  last_name: lastName,
});

const decodeUser = ({ id, username, password, first_name, last_name }) => ({
  id,
  username,
  password,
  firstName: first_name,
  lastName: last_name,
});

const decodeUsers = (rows) => rows.map(decodeUser);

const handleNotFound =
  (id) =>
  ([user]) =>
    user ??
    Promise.reject(
      new NotFoundError({ resourceName: "user", resourceIdentifier: id })
    );

const handleUniqueUsernameError = (username) => (error) =>
  Promise.reject(
    error.code === "ER_DUP_ENTRY"
      ? new ConflictError(`User with username '${username}' already registered`)
      : error
  );

const SQLRepository = () => {
  const knex = Knex(database);

  const list = () => knex.select("*").from("users").then(decodeUsers);

  const get = (id, transaction = knex) =>
    transaction
      .select("*")
      .from("users")
      .where({ id })
      .then(handleNotFound(id))
      .then(decodeUser);

  const insert = (user) =>
    knex.transaction((tx) =>
      knex("users")
        .insert(encodeUser(user))
        .then(([id]) => get(id, tx))
        .catch(handleUniqueUsernameError(user.username))
    );

  const update = (user) =>
    knex.transaction((tx) =>
      knex("users")
        .where({ id: user.id })
        .update(encodeUser(user))
        .then(() => get(user.id, tx))
    );

  const del = (id) => knex("users").where({ id }).delete().then();

  const getByLogin = (username) =>
    knex
      .select("*")
      .from("users")
      .where({ username })
      .then(handleNotFound(username))
      .then(decodeUser);

  return {
    list,
    get,
    insert,
    update,
    del,
    getByLogin,
  };
};

export default SQLRepository;
