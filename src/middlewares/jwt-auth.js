import { expressjwt } from "express-jwt";
import { jwtConfig } from "../config.js";

const jwtAuth = expressjwt({
  secret: jwtConfig.secret,
  audience: jwtConfig.audience,
  issuer: jwtConfig.issuer,
  algorithms: ["HS256"],
});

export default jwtAuth;
