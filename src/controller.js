import jwt from "jsonwebtoken";
import { jwtConfig } from "./config.js";
import asyncErrorHandler from "./middlewares/async-error.js";
import UsersRepository from "./repository/sql-repository.js";
import encrypt from "./utils/encrypt.js";
import { AuthenticationError, AuthorizationError } from "./utils/errors.js";
import safeCompare from "./utils/safeCompare.js";

const repository = UsersRepository();

const user = {
  create: asyncErrorHandler(async (req, res) => {
    const user = {
      ...req.body,
      password: await encrypt(req.body.password),
    };

    const { password, ...inserted } = await repository.insert(user);

    res
      .status(201)
      .header("Location", `/api/users/${inserted.id}`)
      .send(inserted);
  }),

  list: asyncErrorHandler(async (_req, res) => {
    const users = (await repository.list()).map(
      ({ password, ...user }) => user
    );

    res.status(200).send(users);
  }),

  get: asyncErrorHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const { password, ...user } = await repository.get(id);

    res.status(200).send(user);
  }),

  update: asyncErrorHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    if (id !== req.auth.id)
      throw new AuthorizationError(
        "You are not authorized to update this user"
      );

    const body = {
      ...req.body,
      password: await encrypt(req.body.password),
    };

    const registered = await repository.get(id);

    const user = { ...registered, ...body, id };

    const { password, ...updated } = await repository.update(user);

    res.status(200).send(updated);
  }),

  delete: asyncErrorHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    if (id !== req.auth.id)
      throw new AuthorizationError(
        "You are not authorized to delete this user"
      );

    await repository.get(id);

    await repository.del(id);

    res.status(204).send();
  }),

  login: asyncErrorHandler(async (req, res) => {
    const { username, password } = req.body;
    const { password: userPassword, ...user } = await repository.getByLogin(
      username
    );

    if (!user) throw new AuthenticationError("Invalid credentials");

    const encrypted = await encrypt(password);
    const isValid = await safeCompare(encrypted, userPassword);

    if (!isValid) throw new AuthenticationError("Invalid credentials");

    const token = jwt.sign(user, jwtConfig.secret, {
      expiresIn: jwtConfig.expiration,
      audience: jwtConfig.audience,
      issuer: jwtConfig.issuer,
    });

    res.status(200).send({ token });
  }),
};

export default user;
