import { expect } from "chai";
import { ServiceConfigure } from "./ServiceConfigure";

describe("ServiceConfigure.ts tests", () => {
  describe("#ServiceConfigure()", () => {
    const configs: any = {
      events: {
        levels: {
          test: "scope",
        },
      },
    };
    const Configure = ServiceConfigure(configs);

    it("expect to get level from service configs", () => {
      // arranges

      // acts
      const result = Configure.level("test");

      // asserts
      expect(result).to.equal("scope");
    });

    it("expect to get default level from service configs", () => {
      // arranges

      // acts
      const result = Configure.level("others");

      // asserts
      expect(result).to.equal("public");
    });

    it("expect to get default level from undefined service configs", () => {
      // arranges

      // acts
      const configure = ServiceConfigure({});
      const result = configure.level("test");

      // asserts
      expect(result).to.equal("public");
    });

    it("expect to get system level from service configs", () => {
      // arranges

      // acts
      const configure = ServiceConfigure({});
      const result = configure.level("_system");

      // asserts
      expect(result).to.equal("public");
    });
  });
});
