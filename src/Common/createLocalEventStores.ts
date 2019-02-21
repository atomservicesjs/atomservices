import { IEvent, IEventStores } from "atomservicescore";

export const createLocalEventStores = (): IEventStores => {
  let stores: {
    [scope: string]: {
      [type: string]: {
        [eventID: string]: IEvent;
      };
    };
  } = {};

  return {
    close: async () => {
      stores = {};
    },
    queryByID: (eventID, { type, scope }) => {
      if (stores[scope] && stores[scope][type]) {
        return Promise.resolve(stores[scope][type][eventID]);
      } else {
        return Promise.resolve(undefined);
      }
    },
    queryCurrentVersion: async (aggregateID, { type, scope }) => {
      return { type, aggregateID, version: 0 };
    },
    queryEventsByAggregateID: async (aggregateID, on, options) => {
      return [];
    },
    storeEvent: (event: IEvent, scope: string) => {
      const { _id, type } = event;

      if (stores[scope] === undefined) {
        stores[scope] = {};
      }

      if (stores[scope][type] === undefined) {
        stores[scope][type] = {};
      }

      stores[scope][type][_id] = event;

      return Promise.resolve(true);
    },
  };
};
