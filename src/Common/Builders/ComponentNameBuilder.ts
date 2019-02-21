import { Compose } from "../Compose";

export const ComponentNameBuilder = (name: string, compose?: Compose): Compose =>
  (initial: object = {}): object => {
    const Initial = compose ? compose(initial) : initial;

    return Object.defineProperties(Initial, {
      name: {
        configurable: false,
        enumerable: true,
        value: name,
        writable: false,
      },
    });
  };

Object.freeze(ComponentNameBuilder);
