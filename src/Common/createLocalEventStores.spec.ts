import { IEvent } from "atomservicescore";
import { expect } from "chai";
import { compareEvents, createLocalEventStores } from "./createLocalEventStores";

describe("createLocalEventStores.ts tests", () => {
  describe("#createLocalEventStores()", () => {
    it("expect to create a local event stores", async () => {
      // arranges

      // acts
      const localEventStores = createLocalEventStores();

      // asserts
      expect(localEventStores).not.to.equal(null);
      expect(localEventStores).not.to.equal(undefined);
    });
  });

  describe("#LocalEventStores", () => {
    after(() => {
      localEventStores.close();
    });

    const localEventStores = createLocalEventStores();
    const type = "type";
    const event1: IEvent = {
      _createdAt: new Date(),
      _createdBy: "createdBy",
      _id: "001",
      _version: 1,
      aggregateID: "aggregateID1",
      name: "name",
      payloads: {},
      type,
    };
    const event2: IEvent = {
      _createdAt: new Date(),
      _createdBy: "createdBy",
      _id: "002",
      _version: 2,
      aggregateID: "aggregateID1",
      name: "name",
      payloads: {},
      type,
    };
    const event3: IEvent = {
      _createdAt: new Date(),
      _createdBy: "createdBy",
      _id: "003",
      _version: 3,
      aggregateID: "aggregateID1",
      name: "name",
      payloads: {},
      type,
    };
    const event4: IEvent = {
      _createdAt: new Date(),
      _createdBy: "createdBy",
      _id: "004",
      _version: 1,
      aggregateID: "aggregateID1",
      name: "name",
      payloads: {},
      type,
    };
    const event5: IEvent = {
      _createdAt: new Date(),
      _createdBy: "createdBy",
      _id: "005",
      _version: 2,
      aggregateID: "aggregateID1",
      name: "name",
      payloads: {},
      type,
    };

    describe("#storeEvent()", () => {
      it("expect to get true when the event is stored", async () => {
        // arranges
        const scope = "scopeA";

        // acts
        const result1 = await localEventStores.storeEvent(event1, scope);
        const result2 = await localEventStores.storeEvent(event2, scope);
        const result3 = await localEventStores.storeEvent(event3, scope);

        // asserts
        expect(result1).to.equal(event1._id);
        expect(result2).to.equal(event2._id);
        expect(result3).to.equal(event3._id);
      });
    });

    describe("#queryByID()", () => {
      it("expect to get the event by id when that event is stored", async () => {
        // arranges
        const scope = "scopeB";

        // acts
        await localEventStores.storeEvent(event4, scope);
        await localEventStores.storeEvent(event5, scope);

        const result1 = await localEventStores.queryByID("001", { type, scope: "scopeA" });
        const result2 = await localEventStores.queryByID("004", { type, scope: "scopeB" });

        // asserts
        expect(result1).to.equal(event1);
        expect(result2).to.equal(event4);

      });

      it("expect to get undefined when that event do not exist in specified scope", async () => {
        // arranges
        const scope = "not_exist";

        // acts
        const result = await localEventStores.queryByID("001", { type, scope });

        // asserts
        expect(result).to.equal(undefined);
      });

      it("expect to get undefined when that event id do not exist", async () => {
        // arranges
        const id = "999";

        // acts
        const result = await localEventStores.queryByID(id, { type, scope: "scopeA" });

        // asserts
        expect(result).to.equal(undefined);
      });
    });

    describe("#queryCurrentVersion()", () => {
      it("expect to get a current version of the aggregate", async () => {
        // arranges

        // acts
        const result1 = await localEventStores.queryCurrentVersion("aggregateID1", { type, scope: "scopeA" });
        const result2 = await localEventStores.queryCurrentVersion("aggregateID1", { type, scope: "scopeB" });

        // asserts
        expect(result1.version).to.equal(3);
        expect(result2.version).to.equal(2);

      });

      it("expect to get a current version equal to 0 when the aggregate do not exist as initial version", async () => {
        // arranges

        // acts
        const result = await localEventStores.queryCurrentVersion("aggregateID9", { type, scope: "scopeA" });

        // asserts
        expect(result.version).to.equal(0);

      });

      it("expect to get a current version equal to 0 when the aggregate do not exist as initial version", async () => {
        // arranges

        // acts
        const result = await localEventStores.queryCurrentVersion("aggregateID1", { type, scope: "scopeZ" });

        // asserts
        expect(result.version).to.equal(0);

      });
    });

    describe("#queryEventsByAggregateID()", () => {
      it("expect to get an empty array as result when no events are stored", async () => {
        // arranges

        // acts
        const result = await localEventStores.queryEventsByAggregateID("999", { type, scope: "scopeA" });

        // asserts
        expect(result.length).to.equal(0);
      });

      it("expect to get an empty array as result when no events are stored in not-exist scope", async () => {
        // arranges

        // acts
        const result = await localEventStores.queryEventsByAggregateID("001", { type, scope: "scopeZ" });

        // asserts
        expect(result.length).to.equal(0);
      });

      it("expect to get all events associated to the aggregate ID", async () => {
        // arranges

        // acts
        const [e1, e2, e3] = await localEventStores.queryEventsByAggregateID("aggregateID1", { type, scope: "scopeA" });

        // asserts
        expect(e1._version).to.equal(1);
        expect(e2._version).to.equal(2);
        expect(e3._version).to.equal(3);
      });

      it("expect to get events with initialVersion", async () => {
        // arranges
        const id = "aggregateID1";
        const on = { type, scope: "scopeA" };
        const initialVersion = 2;
        const expected = [event2, event3];

        // acts
        const result = await localEventStores.queryEventsByAggregateID(id, on, { initialVersion });

        // asserts
        expect(result.length).to.equal(2);
        expect(result).to.deep.equal(expected);
      });

      it("expect to get events with limit", async () => {
        // arranges
        const id = "aggregateID1";
        const on = { type, scope: "scopeA" };
        const limit = 2;
        const expected = [event1, event2];

        // acts
        const result = await localEventStores.queryEventsByAggregateID(id, on, { limit });

        // asserts
        expect(result.length).to.equal(2);
        expect(result).to.deep.equal(expected);
      });

      it("expect to get events with initialVersion and limit", async () => {
        // arranges
        const id = "aggregateID1";
        const on = { type, scope: "scopeA" };
        const initialVersion = 2;
        const limit = 1;
        const expected = [event2];

        // acts
        const result = await localEventStores.queryEventsByAggregateID(id, on, { initialVersion, limit });

        // asserts
        expect(result.length).to.equal(1);
        expect(result).to.deep.equal(expected);
      });
    });
  });

  describe("#compareEvents()", () => {
    it("expect to compare events, in case greater than", async () => {
      // arranges
      const e1 = { _version: 1 };
      const e2 = { _version: 2 };

      // acts
      const result = compareEvents(e1, e2);

      // asserts
      expect(result).to.equal(-1);
    });

    it("expect to compare events, in case equal", async () => {
      // arranges
      const e1 = { _version: 2 };
      const e2 = { _version: 2 };

      // acts
      const result = compareEvents(e1, e2);

      // asserts
      expect(result).to.equal(0);
    });

    it("expect to compare events, in case fewer than", async () => {
      // arranges
      const e1 = { _version: 2 };
      const e2 = { _version: 1 };

      // acts
      const result = compareEvents(e1, e2);

      // asserts
      expect(result).to.equal(1);
    });
  });
});
