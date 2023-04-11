import { AuthenticationError, NotFoundError } from "../utils/errors.js";
import encrypt from "../utils/encrypt.js";
import safeCompare from "../utils/safeCompare.js";

const decryptHeader = async (authorizationHeader) => {
  if (!authorizationHeader)
    throw new AuthenticationError(null, "Header not found");

  const [type, credentials] = authorizationHeader.split(" ");

  if (type !== "Basic")
    throw new AuthenticationError(null, "Header type mismatch");

  const decriptedCredentials = Buffer.from(credentials, "base64").toString(
    "utf-8"
  );

  const [username, plainPassword] = decriptedCredentials.split(":");

  return {
    username,
    plainPassword,
  };
};

const basicAuth = (repository) => async (req, _res, next) => {
  try {
    const basicHeader = req.get("Authorization");
    const { username, plainPassword } = await decryptHeader(basicHeader);

    if (!username || !plainPassword)
      throw new AuthenticationError(null, "Missing data");

    const user = await repository.getByLogin(username);

    const isValid = await safeCompare(
      await encrypt(plainPassword),
      user.password
    );

    if (!isValid)
      throw new AuthenticationError(username, "Invalid credentials");

    req.user = user;

    next();
  } catch (error) {
    if (error instanceof NotFoundError)
      return next(
        new AuthenticationError(error.resourceId, "Username not found")
      );

    next(error);
  }
};

export default basicAuth;
