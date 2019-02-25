import { expect } from "chai";
import { EventHandlerBuilder } from "./Builders/EventHandlerBuilder";
import { createEventHandler } from "./createEventHandler";

describe("createEventHandler.ts tests", () => {
  describe("#createEventHandler()", () => {
    it("expect to get a new instance of EventHandler", () => {
      // arranges
      const type = "type.test";
      const name = "name.test";
      const process: any = {};
      const expected = {
        name,
        process,
        type,
      };

      // acts
      const handler: any = createEventHandler(type, name, process);

      // asserts
      expect(handler.name).to.deep.equal(expected.name);
      expect(handler.process).to.deep.equal(expected.process);
      expect(handler.type).to.deep.equal(expected.type);
    });

    it("expect to get a new instance of EventHandler with processEffect", () => {
      // arranges
      const type = "type.test";
      const name = "name.test";
      const process: any = {};
      const processEffect: any = {};
      const expected = {
        name,
        process,
        processEffect,
        type,
      };

      // acts
      const handler = createEventHandler(type, name, process, processEffect);

      // asserts
      expect(handler).to.deep.equal(expected);
    });

    it("expect to get a new instance of EventHandler as equal to EventHandlerBuilder", () => {
      // arranges
      const type = "type.test";
      const name = "name.test";
      const process: any = {};

      // acts
      const handler = EventHandlerBuilder(
        {
          process,
        },
        (obj) => {
          obj.type = type;
          obj.name = name;

          return obj;
        },
      );
      const expected = createEventHandler(type, name, process);

      // asserts
      expect(handler).to.deep.equal(expected);
    });

    it("expect to get a new instance of EventHandler as equal to EventHandlerBuilder", () => {
      // arranges
      const type = "type.test";
      const name = "name.test";
      const process: any = {};
      const processEffect: any = {};

      // acts
      const handler = EventHandlerBuilder(
        {
          process,
          processEffect,
        },
        (obj) => {
          obj.type = type;
          obj.name = name;

          return obj;
        },
      );
      const expected = createEventHandler(type, name, process, processEffect);

      // asserts
      expect(handler).to.deep.equal(expected);
    });
  });
});
