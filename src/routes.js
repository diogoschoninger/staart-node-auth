import { Router } from "express";

import user from "./controller.js";
import jwtAuth from "./middlewares/jwt-auth.js";
import validate from "./middlewares/validate.js";
import schemas from "./utils/schemas.js";

const router = Router();

router
  .post("/", validate(schemas.create), user.create)
  .get("/", user.list)
  .get("/:id", validate(schemas.get), jwtAuth, user.get)
  .put("/:id", validate(schemas.update), jwtAuth, user.update)
  .delete("/:id", validate(schemas.delete), jwtAuth, user.delete)
  .post("/login", validate(schemas.login), user.login);

export default router;
