import jwt from "jsonwebtoken";
import { jwtConfig } from "../config.js";
import { AuthenticationError } from "../utils/errors.js";

export default async (req, res, next) => {
  try {
    const header = req.get("Authorization");
    if (!header) throw new AuthenticationError("No token provided");

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, jwtConfig.secret, {
      audience: jwtConfig.audience,
      issuer: jwtConfig.issuer,
    });

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError)
      return next(new AuthenticationError("Invalid token"));

    next(error);
  }
};
