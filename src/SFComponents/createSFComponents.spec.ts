import { expect } from "chai";
import * as sinon from "sinon";
import { IEvent } from "atomservicescore";
import { createSFComponents } from "./createSFComponents";

interface ITestedEvent extends IEvent<{
  inPayloadsText: string;
  inPayloadsNumber: number;
}> {
}

const type = "InUnitTestType";
const Identifier = {
  EventID: () => "EventIDfromIdentifier",
  AggregateID: () => "AggregateIDfromIdentifier",
  type: () => type,
}

describe("createSFComponents.ts tests", () => {
  const eventName = "TestEvent";
  const commandName = "TestCommand";

  describe("#Commander", () => {
    const { Commander } = createSFComponents({
      event: {
        name: eventName,
        process: async (event: ITestedEvent, metadata, state) => {
          state.apply(event);
        },
      },
    });

    it("expect to create a commander from event", () => {
      // arranges
      const expected = {
        name: eventName,
        payloads: {
          inPayloadsText: "text",
          inPayloadsNumber: 0,
        },
      };

      // acts
      const result = Commander({
        inPayloadsText: "text",
        inPayloadsNumber: 0,
      });

      // asserts
      expect(result).to.deep.equal(expected);
    });

    it("expect to create a commander from event with passing properties", () => {
      // arranges
      const expected = {
        name: eventName,
        payloads: {
          inPayloadsText: "text",
          inPayloadsNumber: 0,
        },
        _createdBy: "creater",
        _version: 1,
      };

      // acts
      const result = Commander({
        inPayloadsText: "text",
        inPayloadsNumber: 0,
        _createdBy: "creater",
        _version: 1,
      });

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });

  describe("#CommandHandler with default command", () => {
    let timer: sinon.SinonFakeTimers;
    let now: Date;

    const { Commander, CommandHandler } = createSFComponents({
      event: {
        name: eventName,
        process: async (event: ITestedEvent, metadata, state) => {
          state.apply(event);
        },
      },
    });

    before(() => {
      now = new Date();
      timer = sinon.useFakeTimers(now.getTime());
    });

    after(() => {
      timer.restore();
    })

    it("expect CommandHandler to transform an event", () => {
      // arranges
      const command = Commander({
        inPayloadsNumber: 0,
        inPayloadsText: "text",
      });

      const expected = {
        _id: "EventIDfromIdentifier",
        type,
        aggregateID: "AggregateIDfromIdentifier",
        name: eventName,
        payloads: {
          inPayloadsText: "text",
          inPayloadsNumber: 0,
        },
        _createdAt: now,
        _createdBy: "AggregateIDfromIdentifier",
      };

      // acts
      const result = CommandHandler.transform(command, Identifier);

      // asserts
      expect(result).to.deep.equal(expected);
    });

    it("expect CommandHandler to transform an event with passing properties", () => {
      // arranges
      const command = Commander({
        inPayloadsNumber: 0,
        inPayloadsText: "text",
        _createdBy: "creater",
        _version: 1,
      });

      const expected = {
        _id: "EventIDfromIdentifier",
        type,
        aggregateID: "AggregateIDfromIdentifier",
        name: eventName,
        payloads: {
          inPayloadsText: "text",
          inPayloadsNumber: 0,
        },
        _createdAt: now,
        _createdBy: "creater",
        _version: 1,
      };

      // acts
      const result = CommandHandler.transform(command, Identifier);

      // asserts
      expect(result).to.deep.equal(expected);
    });

    it("expect CommandHandler to validate a command", () => {
      // arranges
      const command = Commander({
        inPayloadsNumber: 0,
        inPayloadsText: "text",
        _createdBy: "creater",
        _version: 1,
      });

      const expected = {
        isValid: true,
      };

      // acts
      const result = CommandHandler.validate(command);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });

  describe("#CommandHandler with provided command", () => {
    let timer: sinon.SinonFakeTimers;
    let now: Date;

    const { Commander, CommandHandler } = createSFComponents<ITestedEvent>({
      event: {
        name: eventName,
        process: async (event, metadata, state) => {
          state.apply(event);
        },
      },
      command: {
        name: commandName,
        transform: (command, identifier) => ({
          _id: identifier.EventID(),
          type: identifier.type(),
          name: eventName,
          aggregateID: identifier.AggregateID(),
          payloads: command.payloads,
          _createdAt: new Date(),
          _createdBy: command._createdBy || "DefaultCreater",
          _version: -1,
        }),
        validate: (command) => {
          if (command._version && command._version > 0) {
            return { isValid: true };
          } else {
            return { isValid: false };
          }
        },
      },
    });

    before(() => {
      now = new Date();
      timer = sinon.useFakeTimers(now.getTime());
    });

    after(() => {
      timer.restore();
    })

    it("expect CommandHandler to transform an event", () => {
      // arranges
      const command = Commander({
        inPayloadsNumber: 100,
        inPayloadsText: "text",
      });

      const expected = {
        _id: "EventIDfromIdentifier",
        type,
        aggregateID: "AggregateIDfromIdentifier",
        name: eventName,
        payloads: {
          inPayloadsText: "text",
          inPayloadsNumber: 100,
        },
        _createdAt: now,
        _createdBy: "DefaultCreater",
        _version: -1,
      };

      // acts
      const result = CommandHandler.transform(command, Identifier);

      // asserts
      expect(result).to.deep.equal(expected);
    });

    it("expect CommandHandler to transform an event with passing properties", () => {
      // arranges
      const command = Commander({
        inPayloadsNumber: 100,
        inPayloadsText: "text",
        _createdBy: "creater",
      });

      const expected = {
        _id: "EventIDfromIdentifier",
        type,
        aggregateID: "AggregateIDfromIdentifier",
        name: eventName,
        payloads: {
          inPayloadsText: "text",
          inPayloadsNumber: 100,
        },
        _createdAt: now,
        _createdBy: "creater",
        _version: -1,
      };

      // acts
      const result = CommandHandler.transform(command, Identifier);

      // asserts
      expect(result).to.deep.equal(expected);
    });

    it("expect CommandHandler to validate a command", () => {
      // arranges
      const command = Commander({
        inPayloadsNumber: 0,
        inPayloadsText: "text",
      });

      const expected = {
        isValid: false,
      };

      // acts
      const result = CommandHandler.validate(command);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });
});
