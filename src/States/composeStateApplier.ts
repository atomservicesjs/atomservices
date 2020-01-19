import { IStateApplier } from "atomservicescore";
import { IStateHandlers } from "./IStateHandlers";

export const composeStateApplier = (props: { StateHandlers: IStateHandlers; }) =>
  (({ StateHandlers }): IStateApplier => {
    const Applier: IStateApplier = {
      apply: async (event) => {
        StateHandlers.apply(event);
      },
    };

    Object.freeze(Applier);

    return Applier;
  })(props);

Object.freeze(composeStateApplier);
