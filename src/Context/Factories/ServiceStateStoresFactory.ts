import { IServiceStateStores, IStateStores } from "atomservicescore";

export const ServiceStateStoresFactory = {
  create: (
    scope: string,
    type: string,
    states?: IStateStores,
  ): IServiceStateStores | undefined => ((Scope, Type, StateStores): IServiceStateStores | undefined => {
    if (StateStores) {
      const ServiceStateStores: IServiceStateStores = {
        applyEvents: (events) =>
          StateStores.applyEvents(Scope, Type, events),
        queryByAggregateID: (aggregateID) =>
          StateStores.queryByAggregateID(Scope, Type, aggregateID),
        queryCurrentVersion: (aggregateID) =>
          StateStores.queryCurrentVersion(Scope, Type, aggregateID),
      };

      Object.freeze(ServiceStateStores);

      return ServiceStateStores;
    } else {
      return undefined;
    }
  })(scope, type, states),
};
