import { timingSafeEqual } from "crypto";

const safeCompare = async (data, comparison) =>
  timingSafeEqual(Buffer.from(data), Buffer.from(comparison));

export default safeCompare;
