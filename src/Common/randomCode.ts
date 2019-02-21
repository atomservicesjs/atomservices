const getRandom = () => Math.floor(Math.random() * 9.9);

export const randomCode = (length: number = 10) => {
  let result: string = "";

  for (let i = 0; i < length; i++) {
    result += getRandom().toString();
  }

  return result;
};

Object.freeze(randomCode);
