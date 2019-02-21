import { expect } from "chai";
import * as sinon from "sinon";
import { composeServiceContext } from "./composeServiceContext";

describe("composeServiceContext.ts tests", () => {
  const EventStores: any = {
    queryByID: sinon.spy(),
    queryCurrentVersion: sinon.spy(),
    queryEventsByAggregateID: sinon.spy(),
  };
  const EventStream = {
    fromRef: sinon.spy(),
    publish: sinon.spy(),
    react: sinon.spy(),
    subscribe: sinon.spy(),
    toRef: sinon.spy(),
  };
  const Identifier = {
    AggregateID: sinon.spy(),
    EventID: sinon.spy(),
    QueryID: sinon.spy(),
  };

  afterEach(() => {
    EventStores.queryByID.resetHistory();
    EventStores.queryCurrentVersion.resetHistory();
    EventStores.queryEventsByAggregateID.resetHistory();

    EventStream.fromRef.resetHistory();
    EventStream.publish.resetHistory();
    EventStream.subscribe.resetHistory();
    EventStream.toRef.resetHistory();

    Identifier.AggregateID.resetHistory();
    Identifier.EventID.resetHistory();
    Identifier.QueryID.resetHistory();
  });

  describe("#composeServiceContext()", () => {
    it("expect a composer", () => {
      // arranges

      // acts
      const composer = composeServiceContext(EventStores, EventStream, Identifier);

      // asserts
      expect(typeof composer).to.equal("function");
    });

    it("expect to compose a service context", () => {
      // arranges
      const composer = composeServiceContext(EventStores, EventStream, Identifier);

      // acts
      const context = composer("type", "scope");

      // asserts
      expect(typeof context).to.equal("object");
    });

    it("expect to get a type of service context", () => {
      // arranges
      const composer = composeServiceContext(EventStores, EventStream, Identifier);
      const context = composer("type", "scope");

      // acts
      const type = context.type();

      // asserts
      expect(type).to.equal("type");
    });

    it("expect to get a scope of service context", () => {
      // arranges
      const composer = composeServiceContext(EventStores, EventStream, Identifier);
      const context = composer("type", "scope");

      // acts
      const scope = context.scope();

      // asserts
      expect(scope).to.equal("scope");
    });
  });

  describe("#EventStores", () => {
    it("expect to spy EventStores", () => {
      // arranges

      // acts

      // asserts
      expect(EventStores.queryByID.callCount).to.equal(0);
      expect(EventStores.queryCurrentVersion.callCount).to.equal(0);
      expect(EventStores.queryEventsByAggregateID.callCount).to.equal(0);
    });

    describe("#ServiceContext.queryByID()", () => {
      it("expect to call EventStores.queryByID()", () => {
        // arranges
        const composer = composeServiceContext(EventStores, EventStream, Identifier);
        const context = composer("type", "scope");
        const eventID = "eventID";

        // acts
        context.queryByID(eventID);

        // asserts
        expect(EventStores.queryByID.callCount).to.equal(1);
        expect(EventStores.queryCurrentVersion.callCount).to.equal(0);
        expect(EventStores.queryEventsByAggregateID.callCount).to.equal(0);
        expect(EventStores.queryByID.calledWith(
          "eventID",
          { type: "type", scope: "scope" },
        )).to.equal(true);
      });
    });

    describe("#ServiceContext.queryCurrentVersion()", () => {
      it("expect to call EventStores.queryCurrentVersion()", () => {
        // arranges
        const composer = composeServiceContext(EventStores, EventStream, Identifier);
        const context = composer("type", "scope");
        const aggregateID = "aggregateID";

        // acts
        context.queryCurrentVersion(aggregateID);

        // asserts
        expect(EventStores.queryByID.callCount).to.equal(0);
        expect(EventStores.queryCurrentVersion.callCount).to.equal(1);
        expect(EventStores.queryEventsByAggregateID.callCount).to.equal(0);
        expect(EventStores.queryCurrentVersion.calledWith(
          "aggregateID",
          { type: "type", scope: "scope" },
        )).to.equal(true);
      });
    });

    describe("#ServiceContext.queryEventsByAggregateID()", () => {
      it("expect to call EventStores.queryEventsByAggregateID()", () => {
        // arranges
        const composer = composeServiceContext(EventStores, EventStream, Identifier);
        const context = composer("type", "scope");
        const aggregateID = "aggregateID";

        // acts
        context.queryEventsByAggregateID(aggregateID);

        // asserts
        expect(EventStores.queryByID.callCount).to.equal(0);
        expect(EventStores.queryCurrentVersion.callCount).to.equal(0);
        expect(EventStores.queryEventsByAggregateID.callCount).to.equal(1);
        expect(EventStores.queryEventsByAggregateID.calledWith(
          "aggregateID",
          { type: "type", scope: "scope" },
          undefined,
        )).to.equal(true);
      });

      it("expect to call EventStores.queryEventsByAggregateID() with options", () => {
        // arranges
        const composer = composeServiceContext(EventStores, EventStream, Identifier);
        const context = composer("type", "scope");
        const aggregateID = "aggregateID";
        const options: any = {};

        // acts
        context.queryEventsByAggregateID(aggregateID, options);

        // asserts
        expect(EventStores.queryByID.callCount).to.equal(0);
        expect(EventStores.queryCurrentVersion.callCount).to.equal(0);
        expect(EventStores.queryEventsByAggregateID.callCount).to.equal(1);
        expect(EventStores.queryEventsByAggregateID.calledWith(
          "aggregateID",
          { type: "type", scope: "scope" },
          options,
        )).to.equal(true);
      });
    });
  });

  describe("#EventStream", () => {
    it("expect to spy EventStream", () => {
      // arranges

      // acts

      // asserts
      expect(EventStream.fromRef.callCount).to.equal(0);
      expect(EventStream.publish.callCount).to.equal(0);
      expect(EventStream.subscribe.callCount).to.equal(0);
      expect(EventStream.toRef.callCount).to.equal(0);
    });

    describe("#ServiceContext.fromRef()", () => {
      it("expect to call EventStream.fromRef()", () => {
        // arranges
        const composer = composeServiceContext(EventStores, EventStream, Identifier);
        const context = composer("type", "scope");
        const ref = "ref";
        const listener: any = {};

        // acts
        context.fromRef(ref, listener);

        // asserts
        expect(EventStream.fromRef.callCount).to.equal(1);
        expect(EventStream.publish.callCount).to.equal(0);
        expect(EventStream.subscribe.callCount).to.equal(0);
        expect(EventStream.toRef.callCount).to.equal(0);
        expect(EventStream.fromRef.calledWith(ref, listener)).to.equal(true);
      });
    });

    describe("#ServiceContext.publish()", () => {
      it("expect to call EventStream.publish()", () => {
        // arranges
        const composer = composeServiceContext(EventStores, EventStream, Identifier);
        const context = composer("type", "scope");
        const options = { scope: "scope", level: "public" };
        const event: any = {};

        // acts
        context.publish(event);

        // asserts
        expect(EventStream.fromRef.callCount).to.equal(0);
        expect(EventStream.publish.callCount).to.equal(1);
        expect(EventStream.subscribe.callCount).to.equal(0);
        expect(EventStream.toRef.callCount).to.equal(0);
        expect(EventStream.publish.calledWith(event, options)).to.equal(true);
      });
    });

    describe("#ServiceContext.subscribe()", () => {
      it("expect to call EventStream.subscribe()", () => {
        // arranges
        const composer = composeServiceContext(EventStores, EventStream, Identifier);
        const context = composer("type", "scope");
        const name = "name";
        const on = { name: "name", type: "type", scope: "scope", level: "public" };
        const to = { type: "type", scope: "scope" };
        const process: any = {};

        // acts
        context.subscribe(name, process);

        // asserts
        expect(EventStream.fromRef.callCount).to.equal(0);
        expect(EventStream.publish.callCount).to.equal(0);
        expect(EventStream.subscribe.callCount).to.equal(1);
        expect(EventStream.toRef.callCount).to.equal(0);
        expect(EventStream.subscribe.calledWith(on, to, process)).to.equal(true);
      });
    });

    describe("#ServiceContext.toRef()", () => {
      it("expect to call EventStream.toRef()", () => {
        // arranges
        const composer = composeServiceContext(EventStores, EventStream, Identifier);
        const context = composer("type", "scope");
        const ref = "ref";
        const result: any = {};

        // acts
        context.toRef(ref, result);

        // asserts
        expect(EventStream.fromRef.callCount).to.equal(0);
        expect(EventStream.publish.callCount).to.equal(0);
        expect(EventStream.subscribe.callCount).to.equal(0);
        expect(EventStream.toRef.callCount).to.equal(1);
        expect(EventStream.toRef.calledWith(ref, result)).to.equal(true);
      });
    });
  });

  describe("#Identifier", () => {
    it("expect to spy Identifier", () => {
      // arranges

      // acts

      // asserts
      expect(Identifier.AggregateID.callCount).to.equal(0);
      expect(Identifier.EventID.callCount).to.equal(0);
      expect(Identifier.QueryID.callCount).to.equal(0);
    });

    describe("#ServiceContext.newAggregateID()", () => {
      it("expect to call Identifier.AggregateID()", () => {
        // arranges
        const composer = composeServiceContext(EventStores, EventStream, Identifier);
        const context = composer("type", "scope");

        // acts
        context.newAggregateID();

        // asserts
        expect(Identifier.AggregateID.callCount).to.equal(1);
        expect(Identifier.EventID.callCount).to.equal(0);
        expect(Identifier.QueryID.callCount).to.equal(0);
        expect(Identifier.AggregateID.calledWith("type")).to.equal(true);
      });
    });

    describe("#ServiceContext.newEventID()", () => {
      it("expect to call Identifier.EventID()", () => {
        // arranges
        const composer = composeServiceContext(EventStores, EventStream, Identifier);
        const context = composer("type", "scope");

        // acts
        context.newEventID();

        // asserts
        expect(Identifier.AggregateID.callCount).to.equal(0);
        expect(Identifier.EventID.callCount).to.equal(1);
        expect(Identifier.QueryID.callCount).to.equal(0);
        expect(Identifier.EventID.calledWith("type")).to.equal(true);
      });
    });

    describe("#ServiceContext.newQueryID()", () => {
      it("expect to call Identifier.QueryID()", () => {
        // arranges
        const composer = composeServiceContext(EventStores, EventStream, Identifier);
        const context = composer("type", "scope");

        // acts
        context.newQueryID();

        // asserts
        expect(Identifier.AggregateID.callCount).to.equal(0);
        expect(Identifier.EventID.callCount).to.equal(0);
        expect(Identifier.QueryID.callCount).to.equal(1);
        expect(Identifier.QueryID.calledWith("type")).to.equal(true);
      });
    });
  });
});
