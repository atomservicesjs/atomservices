import { ICommandHandler, IEventStream, IIdentifier } from "atomservicescore";
import { expect } from "chai";
import * as sinon from "sinon";
import { createCommandDispatcher } from "./createCommandDispatcher";

describe("createCommandDispatcher.ts tests", () => {
  describe("#createCommandDispatcher()", () => {
    const AggregateID = "A-1234567890";
    const EventID = "E-1234567890";

    const identifier: IIdentifier = {
      AggregateID: (type: string) => AggregateID,
      EventID: (type: string) => EventID,
    };

    const stream: IEventStream = {
      directTo: sinon.spy(),
      listenTo: sinon.spy(),
      publish: sinon.spy(),
      subscribe: sinon.spy(),
    };

    const cmdHlr1: ICommandHandler = {
      name: "CmdHlr1",
      transform: sinon.spy(),
      validate: sinon.spy(),
    };

    const cmdHlr2: ICommandHandler = {
      name: "CmdHlr1",
      transform: sinon.spy(),
      validate: sinon.spy(),
    };

    const creatingDispatcher = createCommandDispatcher(identifier, stream, cmdHlr1, cmdHlr2);

    it("expect to be function when calling createCommandDispatcher()", () => {
      // arranges

      // acts

      // asserts
      expect(creatingDispatcher).to.be("function");
    });
  });
});
