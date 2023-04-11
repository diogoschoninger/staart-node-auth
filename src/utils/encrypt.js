import { pbkdf2Sync } from "crypto";
import { encryption } from "../config.js";

const encrypt = async (data) =>
  pbkdf2Sync(
    data,
    encryption.salt,
    encryption.iterations,
    encryption.keyLength,
    encryption.digest
  ).toString("hex");

export default encrypt;
