import { expect } from "chai";
import * as sinon from "sinon";
import { createEventProcess } from "./createEventProcess";

describe("createEventProcess.ts tests", () => {
  describe("#createEventProcess()", () => {
    it("expect to process the event", async () => {
      // arranges
      const handler: any = {
        process: {},
      };
      const initState: any = {};
      const state: any = {};
      const handlers: any = {
        resolve: sinon.stub().callsFake(() => handler),
      };
      const repository: any = {
        applyEvent: sinon.stub().callsFake(() => Promise.resolve(state)),
        queryByID: sinon.stub().callsFake(() => Promise.resolve(initState)),
      };
      const context: any = {
        directTo: sinon.spy(),
        scope: sinon.stub().callsFake(() => "scope"),
      };
      const event: any = {
        _id: "id",
        aggregateID: "aggregateID",
        name: "name",
        type: "type",
      };
      const ack = sinon.spy();

      // acts
      const process = createEventProcess(handlers, repository, context);
      await process(event, ack);

      // asserts
      expect(context.scope.called).to.equal(true);
      expect(handlers.resolve.called).to.equal(true);
      expect(handlers.resolve.calledWith(event)).to.equal(true);
      expect(context.directTo.called).to.equal(false);
      expect(repository.queryByID.called).to.equal(true);
      expect(repository.queryByID.calledWith("aggregateID")).to.equal(true);
      expect(repository.applyEvent.called).to.equal(true);
      expect(repository.applyEvent.calledWith(initState, event, handler.process)).to.equal(true);
      expect(ack.called).to.equal(true);
    });

    it("expect to process the event with processEffect()", async () => {
      // arranges
      const handler = {
        process: {},
        processEffect: sinon.spy(),
      };
      const initState: any = {};
      const state: any = {};
      const handlers: any = {
        resolve: sinon.stub().callsFake(() => handler),
      };
      const repository: any = {
        applyEvent: sinon.stub().callsFake(() => Promise.resolve(state)),
        queryByID: sinon.stub().callsFake(() => Promise.resolve(initState)),
      };
      const context: any = {
        directTo: sinon.spy(),
        scope: sinon.stub().callsFake(() => "scope"),
      };
      const event: any = {
        _id: "id",
        aggregateID: "aggregateID",
        name: "name",
        type: "type",
      };
      const ack = sinon.spy();

      // acts
      const process = createEventProcess(handlers, repository, context);
      await process(event, ack);

      // asserts
      expect(context.scope.called).to.equal(true);
      expect(handlers.resolve.called).to.equal(true);
      expect(handlers.resolve.calledWith(event)).to.equal(true);
      expect(context.directTo.called).to.equal(false);
      expect(repository.queryByID.called).to.equal(true);
      expect(repository.queryByID.calledWith("aggregateID")).to.equal(true);
      expect(repository.applyEvent.called).to.equal(true);
      expect(repository.applyEvent.calledWith(initState, event, handler.process)).to.equal(true);
      expect(handler.processEffect.called).to.equal(true);
      expect(ack.called).to.equal(true);
    });

    it("expect to process the event with unhandled event", async () => {
      // arranges
      const handler = {
        process: {},
        processEffect: sinon.spy(),
      };
      const handlers: any = {
        resolve: sinon.stub().callsFake(() => undefined),
      };
      const repository: any = {
        applyEvent: sinon.spy(),
        queryByID: sinon.spy(),
      };
      const context: any = {
        directTo: sinon.spy(),
        scope: sinon.stub().callsFake(() => "scope"),
      };
      const event: any = {
        _id: "id",
        aggregateID: "aggregateID",
        name: "name",
        type: "type",
      };
      const ack = sinon.spy();

      // acts
      const process = createEventProcess(handlers, repository, context);
      await process(event, ack);

      // asserts
      expect(context.scope.called).to.equal(true);
      expect(handlers.resolve.called).to.equal(true);
      expect(handlers.resolve.calledWith(event)).to.equal(true);
      expect(context.directTo.called).to.equal(true);
      expect(repository.queryByID.called).to.equal(false);
      expect(repository.applyEvent.called).to.equal(false);
      expect(handler.processEffect.called).to.equal(false);
      expect(ack.called).to.equal(true);
    });

    it("expect to process the event with error", async () => {
      // arranges
      const handler: any = {
        process: {},
      };
      const handlers: any = {
        resolve: sinon.stub().callsFake(() => handler),
      };
      const repository: any = {
        queryByID: sinon.stub().callsFake(() => {
          throw new Error("test error");
        }),
      };
      const context: any = {
        directTo: sinon.spy(),
        scope: sinon.stub().callsFake(() => "scope"),
      };
      const event: any = {
        _id: "id",
        aggregateID: "aggregateID",
        name: "name",
        type: "type",
      };
      const ack = sinon.spy();

      // acts
      const process = createEventProcess(handlers, repository, context);
      await process(event, ack);

      // asserts
      expect(context.scope.called).to.equal(true);
      expect(handlers.resolve.called).to.equal(true);
      expect(handlers.resolve.calledWith(event)).to.equal(true);
      expect(context.directTo.called).to.equal(true);
      expect(repository.queryByID.called).to.equal(true);
      expect(repository.queryByID.calledWith("aggregateID")).to.equal(true);
      expect(ack.called).to.equal(false);
    });
  });
});
