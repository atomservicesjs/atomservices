import * as crypto from "crypto";

export const hashify = (val: string) => {
  const hash = crypto.createHash("sha1");
  hash.update(val, "utf8");

  return hash.digest("base64");
};
