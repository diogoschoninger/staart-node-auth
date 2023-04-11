import { Router } from "express";

import user from "./controller.js";
import basicAuth from "./middlewares/basic-auth.js";
import validate from "./middlewares/validate.js";
import UsersRepository from "./repository/sql-repository.js";
import schemas from "./utils/schemas.js";

const repository = UsersRepository();

const router = Router();

router
  .post("/", validate(schemas.create), user.create)
  .get("/", user.list)
  .get("/:id", validate(schemas.get), basicAuth(repository), user.get)
  .put("/:id", validate(schemas.update), basicAuth(repository), user.update)
  .delete("/:id", validate(schemas.delete), basicAuth(repository), user.delete);

export default router;
