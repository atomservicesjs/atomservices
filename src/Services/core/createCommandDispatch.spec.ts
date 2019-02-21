import { expect } from "chai";
import * as sinon from "sinon";
import { CommandHandlerBuilder } from "../../Commands/Builders/CommandHandlerBuilder";
import { combineCommandHandlers } from "../../Commands/combineCommandHandlers";
import { createCommandDispatch } from "./createCommandDispatch";

describe("createDispatchCommand.ts tests", () => {
  describe("#createDispatchCommand()", () => {
    it("expect to create the dispatchCommand() function", () => {
      // arranges
      const handlers: any = {};
      const context: any = {};

      // acts
      const dispatch = createCommandDispatch(handlers, context);

      // asserts
      expect(typeof dispatch).to.equal("function");
    });
  });

  describe("#dispatchCommand()", () => {
    const Context: any = {
      fromRef: sinon.spy(),
      publish: sinon.spy(),
    };
    const event: any = { _id: 1 };
    const transform: any = sinon.stub().callsFake(() => event);
    const validate: any = sinon.stub().callsFake((payloads) => {
      if (payloads.validResult) {
        return {
          isValid: true,
        };
      } else {
        return {
          invalidAttributes: {
            attribute: "invalid",
          },
          isValid: false,
        };
      }
    });
    const Handler = CommandHandlerBuilder(
      {
        name: "test",
        transform,
        validate,
      },
    );
    const Handlers: any = combineCommandHandlers(Handler)("test.type");
    const dispatch = createCommandDispatch(Handlers, Context);

    afterEach(() => {
      Context.publish.resetHistory();
    });

    it("expect to get the result as dispatching unhandled command", () => {
      // arranges
      const command: any = {
        name: "other",
      };
      const expected = {
        accept: false,
        name: "other",
        status: "unhandled",
        type: "test.type",
      };

      // acts
      const result = dispatch(command);

      // asserts
      expect(result).to.deep.equal(expected);
      expect(Context.publish.callCount).to.equal(0);
    });

    it("expect to get the result as dispatching invalid command", () => {
      // arranges
      const command: any = {
        name: "test",
        payloads: {
          validResult: false,
        },
      };
      const expected = {
        accept: false,
        invalidAttributes: {
          attribute: "invalid",
        },
        status: "invalid",
      };

      // acts
      const result = dispatch(command);

      // asserts
      expect(result).to.deep.equal(expected);
      expect(Context.publish.callCount).to.equal(0);
    });

    it("expect to get the result as dispatching valid command", () => {
      // arranges
      const command: any = {
        name: "test",
        payloads: {
          validResult: true,
        },
      };
      const expected = {
        accept: true,
        ref: 1,
        status: "accepted",
      };

      // acts
      const result = dispatch(command);

      // asserts
      expect(result).to.deep.equal(expected);
      expect(Context.publish.callCount).to.equal(1);
    });
  });
});
