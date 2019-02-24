import * as crypto from "crypto";

const outputEncodig = "base64";

export const hashify = (val: string) => {
  const hash = crypto.createHash("sha1");
  hash.update(val, "utf8");

  return hash.digest(outputEncodig);
};

Object.freeze(hashify);
