import { IEvent, IEventStores } from "atomservicescore";

export const compareEvents = (event: { _version: number }, another: { _version: number }) => {
  if (event._version < another._version) {
    return -1;
  } else if (event._version > another._version) {
    return 1;
  } else {
    return 0;
  }
};

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
      if (stores[scope] && stores[scope][type]) {
        const map = stores[scope][type];
        const keys = Object.keys(map);
        let version = 0;

        for (const key of keys) {
          const event = map[key];

          if (event.aggregateID === aggregateID && event._version > version) {
            version = event._version;
          }
        }

        return { type, aggregateID, version };
      } else {
        return { type, aggregateID, version: 0 };
      }
    },
    queryEventsByAggregateID: async (aggregateID, { type, scope }, options = {}) => {
      if (stores[scope] && stores[scope][type]) {
        const matches = [];
        const map = stores[scope][type];
        const keys = Object.keys(map);
        const { initialVersion = 0, limit } = options;

        for (const key of keys) {
          const event = map[key];

          if (event.aggregateID === aggregateID && initialVersion <= event._version) {
            matches.push(event);
          }

          if (limit !== undefined && matches.length === limit) {
            break;
          }
        }

        return matches.sort(compareEvents);
      } else {
        return [];
      }
    },
    storeEvent: async (event: IEvent, scope: string) => {
      const { _id, type } = event;

      if (stores[scope] === undefined) {
        stores[scope] = {};
      }

      if (stores[scope][type] === undefined) {
        stores[scope][type] = {};
      }

      stores[scope][type][_id] = event;

      return event._id;
    },
  };
};
