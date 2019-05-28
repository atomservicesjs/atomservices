/*
import { IServiceConfigs } from "atomservicescore";
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
    directTo: sinon.spy(),
    listenTo: sinon.spy(),
    publish: sinon.spy(),
    subscribe: sinon.spy(),
  };
  const Identifier = {
    AggregateID: sinon.spy(),
    EventID: sinon.spy(),
  };

  afterEach(() => {
    EventStores.queryByID.resetHistory();
    EventStores.queryCurrentVersion.resetHistory();
    EventStores.queryEventsByAggregateID.resetHistory();

    EventStream.directTo.resetHistory();
    EventStream.listenTo.resetHistory();
    EventStream.publish.resetHistory();
    EventStream.subscribe.resetHistory();

    Identifier.AggregateID.resetHistory();
    Identifier.EventID.resetHistory();
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

    it("expect to get a level of event name", () => {
      // arranges
      const configs: IServiceConfigs = {
        events: {
          levels: {
            _default: "scope",
            test: "public",
          },
        },
      };
      const composer = composeServiceContext(EventStores, EventStream, Identifier);
      const context = composer("type", "scope", configs);

      // acts
      const result1 = context.level("test");
      const result2 = context.level("others");

      // asserts
      expect(result1).to.equal("public");
      expect(result2).to.equal("scope");
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
      expect(EventStream.directTo.callCount).to.equal(0);
      expect(EventStream.listenTo.callCount).to.equal(0);
      expect(EventStream.publish.callCount).to.equal(0);
      expect(EventStream.subscribe.callCount).to.equal(0);
    });

    describe("#ServiceContext.directTo()", () => {
      it("expect to call EventStream.directTo()", () => {
        // arranges
        const composer = composeServiceContext(EventStores, EventStream, Identifier);
        const context = composer("type", "scope");
        const ref = "ref";
        const result: any = {};

        // acts
        context.directTo(ref, result);

        // asserts
        expect(EventStream.directTo.callCount).to.equal(1);
        expect(EventStream.listenTo.callCount).to.equal(0);
        expect(EventStream.publish.callCount).to.equal(0);
        expect(EventStream.subscribe.callCount).to.equal(0);
        expect(EventStream.directTo.calledWith(ref, result)).to.equal(true);
      });
    });

    describe("#ServiceContext.listenTo()", () => {
      it("expect to call EventStream.listenTo()", () => {
        // arranges
        const composer = composeServiceContext(EventStores, EventStream, Identifier);
        const context = composer("type", "scope");
        const ref = "ref";
        const listener: any = {};

        // acts
        context.listenTo(ref, listener);

        // asserts
        expect(EventStream.directTo.callCount).to.equal(0);
        expect(EventStream.listenTo.callCount).to.equal(1);
        expect(EventStream.publish.callCount).to.equal(0);
        expect(EventStream.subscribe.callCount).to.equal(0);
        expect(EventStream.listenTo.calledWith(ref, listener)).to.equal(true);
      });
    });

    describe("#ServiceContext.registerHandler()", () => {
      it("expect to call EventStream.subscribe()", () => {
        // arranges
        const composer = composeServiceContext(EventStores, EventStream, Identifier);
        const context = composer("type", "scope");
        const handler: any = { name: "name" };
        const on = { name: "name", type: "type", scope: "scope", level: "public" };
        const to = { channel: "handler", type: "type", scope: "scope" };
        const process: any = {};

        // acts
        context.registerHandler(handler, process);

        // asserts
        expect(EventStream.directTo.callCount).to.equal(0);
        expect(EventStream.listenTo.callCount).to.equal(0);
        expect(EventStream.publish.callCount).to.equal(0);
        expect(EventStream.subscribe.callCount).to.equal(1);
        expect(EventStream.subscribe.calledWith(on, to, process)).to.equal(true);
      });
    });

    describe("#ServiceContext.registerReaction()", () => {
      it("expect to call EventStream.subscribe() with same type and scope reaction", () => {
        // arranges
        const composer = composeServiceContext(EventStores, EventStream, Identifier);
        const context = composer("type", "scope");
        const reaction: any = { name: "name", type: "type", scope: "scope" };
        const on = { name: "name", type: "type", scope: "scope", level: "public" };
        const to = { channel: "reaction", type: "type", scope: "scope" };
        const process: any = {};

        // acts
        context.registerReaction(reaction, process);

        // asserts
        expect(EventStream.directTo.callCount).to.equal(0);
        expect(EventStream.listenTo.callCount).to.equal(0);
        expect(EventStream.publish.callCount).to.equal(0);
        expect(EventStream.subscribe.callCount).to.equal(1);
        expect(EventStream.subscribe.calledWith(on, to, process)).to.equal(true);
      });

      it("expect to call EventStream.subscribe() with different type and scope reaction", () => {
        // arranges
        const composer = composeServiceContext(EventStores, EventStream, Identifier);
        const context = composer("type", "scope");
        const reaction: any = { name: "name", type: "other.type", scope: "other.scope" };
        const on = { name: "name", type: "other.type", scope: "other.scope", level: "public" };
        const to = { channel: "reaction", type: "type", scope: "scope" };
        const process: any = {};

        // acts
        context.registerReaction(reaction, process);

        // asserts
        expect(EventStream.directTo.callCount).to.equal(0);
        expect(EventStream.listenTo.callCount).to.equal(0);
        expect(EventStream.publish.callCount).to.equal(0);
        expect(EventStream.subscribe.callCount).to.equal(1);
        expect(EventStream.subscribe.calledWith(on, to, process)).to.equal(true);
      });
    });

    describe("#ServiceContext.dispatch()", () => {
      it("expect to call storeEvent() and publish()", async () => {
        // arranges
        const stores: any = {
          queryCurrentVersion: sinon.stub().callsFake(() => Promise.resolve({ version: 0 })),
          storeEvent: sinon.spy(),
        };
        const stream: any = {
          publish: sinon.spy(),
        };
        const scope = "scope";
        const type = "type";
        const composer = composeServiceContext(stores, stream, Identifier);
        const context = composer(type, scope);
        const event: any = {
          _version: 1,
          aggregateID: "aggregateID",
          name: "test",
          type,
        };

        // acts
        await context.dispatch(event);

        // asserts
        expect(stores.queryCurrentVersion.calledWith("aggregateID", { type, scope })).to.equal(true);
        expect(stores.storeEvent.calledWith(event, scope)).to.equal(true);
        expect(stream.publish.calledWith(event, { scope, level: "public" })).to.equal(true);
      });

      it("expect to handle CurrentVersionQueryingError as error occured in queryCurrentVersion()", async () => {
        // arranges
        const stores: any = {
          queryCurrentVersion: sinon.stub().callsFake(() => {
            throw new Error("Error inside queryCurrentVersion()");
          }),
          storeEvent: sinon.spy(),
        };
        const stream: any = {
          publish: sinon.spy(),
        };
        const scope = "scope";
        const type = "type";
        const composer = composeServiceContext(stores, stream, Identifier);
        const context = composer(type, scope);
        const event: any = {
          _version: 1,
          aggregateID: "aggregateID",
          name: "test",
          type,
        };

        // acts
        let exception;
        try {
          await context.dispatch(event);
        } catch (error) {
          exception = error;
        }

        // asserts
        expect(exception).not.to.equal(null);
        expect(exception).not.to.equal(undefined);
        expect(stores.queryCurrentVersion.calledWith("aggregateID", { type, scope })).to.equal(true);
        expect(stores.storeEvent.getCall(0).args[0].name).to.equal("_CurrentVersionQueryingError");
        expect(stores.storeEvent.getCall(0).args[0].type).to.equal("exceptions");
        expect(stream.publish.getCall(0).args[0].name).to.equal("_CurrentVersionQueryingError");
        expect(stream.publish.getCall(0).args[0].type).to.equal("exceptions");
      });

      it("expect to handle EventStoringError as error occured in storeEvent()", async () => {
        // arranges
        const stores: any = {
          queryCurrentVersion: sinon.stub().callsFake(() => Promise.resolve({ version: 0 })),
          storeEvent: sinon.stub().callsFake(() => {
            throw new Error("Error inside storeEvent()");
          }),
        };
        const stream: any = {
          publish: sinon.spy(),
        };
        const scope = "scope";
        const type = "type";
        const composer = composeServiceContext(stores, stream, Identifier);
        const context = composer(type, scope);
        const event: any = {
          _version: 1,
          aggregateID: "aggregateID",
          name: "test",
          type,
        };

        // acts
        let exception;
        try {
          await context.dispatch(event);
        } catch (error) {
          exception = error;
        }

        // asserts
        expect(exception).not.to.equal(null);
        expect(exception).not.to.equal(undefined);
        expect(stores.queryCurrentVersion.calledWith("aggregateID", { type, scope })).to.equal(true);
        expect(stores.storeEvent.calledWith(event, scope)).to.equal(true);
        expect(stream.publish.getCall(0).args[0].name).to.equal("_EventStoringError");
        expect(stream.publish.getCall(0).args[0].type).to.equal("exceptions");
      });

      it("expect to handle EventVersionConflictedConcurrentException", async () => {
        // arranges
        const stores: any = {
          queryCurrentVersion: sinon.stub().callsFake(() => Promise.resolve({ version: 1 })),
          storeEvent: sinon.spy(),
        };
        const stream: any = {
          publish: sinon.spy(),
        };
        const scope = "scope";
        const type = "type";
        const composer = composeServiceContext(stores, stream, Identifier);
        const context = composer(type, scope);
        const event: any = {
          _version: 1,
          aggregateID: "aggregateID",
          name: "test",
          type,
        };

        // acts
        await context.dispatch(event);

        // asserts
        expect(stores.queryCurrentVersion.calledWith("aggregateID", { type, scope })).to.equal(true);
        expect(stores.storeEvent.callCount).to.equal(1);
        expect(stores.storeEvent.getCall(0).args[0].name).to.equal("_EventVersionConflictedConcurrent");
        expect(stores.storeEvent.getCall(0).args[0].type).to.equal("exceptions");
        expect(stream.publish.getCall(0).args[0].name).to.equal("_EventVersionConflictedConcurrent");
        expect(stream.publish.getCall(0).args[0].type).to.equal("exceptions");
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
        expect(Identifier.EventID.calledWith("type")).to.equal(true);
      });
    });
  });
});
*/
