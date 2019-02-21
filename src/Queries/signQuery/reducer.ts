export const reducer = (json: object): any => {
  const keys = Object.keys(json).sort();

  return keys.reduce((result, key) => {
    const value = json[key];

    if (typeof value === "object" && !Array.isArray(value)) {
      result[key] = reducer(value);
    } else {
      result[key] = value;
    }

    return result;
  }, {});
};
