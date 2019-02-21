import { Compose } from "../Compose";

export const ComponentTypeBuilder = (type: string, compose?: Compose): Compose =>
  (initial: object = {}): object => {
    const Initial = compose ? compose(initial) : initial;

    return Object.defineProperties(Initial, {
      type: {
        configurable: false,
        enumerable: true,
        value: type,
        writable: false,
      },
    });
  };

Object.freeze(ComponentTypeBuilder);
