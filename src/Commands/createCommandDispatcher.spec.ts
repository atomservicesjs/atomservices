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
    const streamListenTo = sinon.spy();
    const stream: IEventStream = {
      directTo: sinon.spy(),
      listenTo: streamListenTo,
      publish: sinon.spy(),
      subscribe: sinon.spy(),
    };

    const cmdHlr1Transform = sinon.stub().callsFake((cmd, type, idifier) => ({
      _createdAt: "created",
      _id: idifier.newEventID(),
      _version: 1,
      aggregateID: idifier.newAggregateID(),
      name: cmd.name,
      type,
    }));
    const cmdHlr1Validate = sinon.stub().callsFake(() => ({
      isValid: true,
    }));

    const cmdHlr1: ICommandHandler = {
      name: "Cmd1",
      transform: cmdHlr1Transform,
      validate: cmdHlr1Validate,
    };

    const cmdHlr2Transform = sinon.spy();
    const cmdHlr2Validate = sinon.stub().callsFake(() => ({
      invalidAttributes: {
        prop1: "invalid message",
        prop2: "invalid message",
      },
      isValid: false,
    }));

    const cmdHlr2: ICommandHandler = {
      name: "Cmd2",
      transform: cmdHlr2Transform,
      validate: cmdHlr2Validate,
    };

    const creatingDispatcher = createCommandDispatcher(identifier, stream, cmdHlr1, cmdHlr2);

    afterEach(() => {
      cmdHlr1Transform.resetHistory();
      cmdHlr1Validate.resetHistory();

      cmdHlr2Transform.resetHistory();
      cmdHlr2Validate.resetHistory();
    });

    it("expect to get a function when calling createCommandDispatcher(identifier, stream, ...commandHandlers)", () => {
      // arranges

      // acts

      // asserts
      expect(creatingDispatcher).to.be.a("function");
    });

    it("expect to get an object when calling createCommandDispatcher(identifier, stream, ...commandHandlers)(type, scope)", () => {
      // arranges
      const type = "TestService";
      const scope = "TestPackage";

      // acts
      const dispatcher = creatingDispatcher(type, scope);

      // asserts
      expect(dispatcher).to.be.a("object");
    });

    it("expect to get an unhandled result", async () => {
      // arranges
      const type = "TestService";
      const scope = "TestPackage";
      const dispatcher = creatingDispatcher(type, scope);
      const command = {
        name: "others",
      };

      const expected = {
        accept: false,
        name: "others",
        status: "unhandled",
        type: "TestService",
      };

      // acts
      const result = await dispatcher.dispatch(command);

      // asserts
      expect(result).to.deep.equal(expected);
    });

    it("expect to get an invalid result", async () => {
      // arranges
      const type = "TestService";
      const scope = "TestPackage";
      const dispatcher = creatingDispatcher(type, scope);
      const command = {
        name: "Cmd2",
      };

      const expected = {
        accept: false,
        invalidAttributes: {
          prop1: "invalid message",
          prop2: "invalid message",
        },
        status: "invalid",
      };

      // acts
      const result = await dispatcher.dispatch(command);

      // asserts
      expect(result).to.deep.equal(expected);
      expect(cmdHlr2Validate.calledOnceWith(command)).to.equal(true);
    });

    it("expect to get a valid result", async () => {
      // arranges
      const type = "TestService";
      const scope = "TestPackage";
      const dispatcher = creatingDispatcher(type, scope);
      const command = {
        name: "Cmd1",
      };

      const expected = {
        accept: true,
        ref: "E-1234567890",
        status: "accepted",
      };

      // acts
      const result = await dispatcher.dispatch(command);

      // asserts
      expect(result).to.deep.equal(expected);
      expect(cmdHlr1Validate.calledOnceWith(command)).to.equal(true);
      expect(cmdHlr1Transform.calledOnceWith(command, type)).to.equal(true);
    });

    it("expect to get a valid result with listener", async () => {
      // arranges
      const type = "TestService";
      const scope = "TestPackage";
      const dispatcher = creatingDispatcher(type, scope);
      const command = {
        name: "Cmd1",
      };
      const listener: any = {};

      const expected = {
        accept: true,
        ref: "E-1234567890",
        status: "accepted",
      };

      // acts
      const result = await dispatcher.dispatch(command, listener);

      // asserts
      expect(result).to.deep.equal(expected);
      expect(cmdHlr1Validate.calledOnceWith(command)).to.equal(true);
      expect(cmdHlr1Transform.calledOnceWith(command, type)).to.equal(true);
      expect(streamListenTo.calledOnceWith("E-1234567890", listener)).to.equal(true);
    });
  });
});
