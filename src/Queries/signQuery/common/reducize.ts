export const reducize = (obj: object): object => {
  const keys = Object.keys(obj).sort();

  return keys.reduce((result, key) => {
    const value = obj[key];

    if (typeof value === "object" && !Array.isArray(value)) {
      result[key] = reducize(value);
    } else {
      result[key] = value;
    }

    return result;
  }, {});
};

Object.freeze(reducize);
