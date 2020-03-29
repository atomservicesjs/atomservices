import { expect } from "chai";
import { IServiceConfigs } from "atomservicescore";
import { ServiceConfigurateFactory } from "./ServiceConfigurateFactory";

describe("ServiceConfigurateFactory.ts tests", () => {
  describe("ServiceConfigs #1", () => {
    const configs: IServiceConfigs = {};

    it("expect level to equal 'Public' as default", () => {
      // arranges
      const ServiceConfigurate = ServiceConfigurateFactory.create(configs);
      const name = "Test";

      // acts
      const level = ServiceConfigurate.level(name);

      // asserts
      expect(level).to.equal("Public");
    });

    it("expect processType to equal 'asynchronous' as default", () => {
      // arranges
      const ServiceConfigurate = ServiceConfigurateFactory.create(configs);
      const name = "Test";

      // acts
      const processType = ServiceConfigurate.processType(name);

      // asserts
      expect(processType).to.equal("asynchronous");
    });

    it("expect versioning to equal 'None' as default", () => {
      // arranges
      const ServiceConfigurate = ServiceConfigurateFactory.create(configs);
      const name = "Test";

      // acts
      const versioning = ServiceConfigurate.versioning(name);

      // asserts
      expect(versioning).to.equal("None");
    });
  });

  describe("ServiceConfigs #2", () => {
    const configs: IServiceConfigs = {
      service: {
        level: "Scope",
        processType: "synchronous",
        versioning: "Dynamic",
      },
    };

    it("expect level to equal 'Scope' as service configs", () => {
      // arranges
      const ServiceConfigurate = ServiceConfigurateFactory.create(configs);
      const name = "Test";

      // acts
      const level = ServiceConfigurate.level(name);

      // asserts
      expect(level).to.equal("Scope");
    });

    it("expect processType to equal 'synchronous' as service configs", () => {
      // arranges
      const ServiceConfigurate = ServiceConfigurateFactory.create(configs);
      const name = "Test";

      // acts
      const processType = ServiceConfigurate.processType(name);

      // asserts
      expect(processType).to.equal("synchronous");
    });

    it("expect versioning to equal 'Dynamic' as service configs", () => {
      // arranges]
      const ServiceConfigurate = ServiceConfigurateFactory.create(configs);
      const name = "Test";

      // acts
      const versioning = ServiceConfigurate.versioning(name);

      // asserts
      expect(versioning).to.equal("Dynamic");
    });
  });

  describe("ServiceConfigs #3", () => {
    const configs: IServiceConfigs = {
      events: {
        Test: {
          level: "Scope",
          processType: "synchronous",
          versioning: "Static"
        },
      },
    };

    it("expect level to equal 'Scope' as events configs", () => {
      // arranges
      const ServiceConfigurate = ServiceConfigurateFactory.create(configs);
      const name = "Test";

      // acts
      const level = ServiceConfigurate.level(name);

      // asserts
      expect(level).to.equal("Scope");
    });

    it("expect level to equal 'Public' as default configs", () => {
      // arranges
      const ServiceConfigurate = ServiceConfigurateFactory.create(configs);
      const name = "Others";

      // acts
      const level = ServiceConfigurate.level(name);

      // asserts
      expect(level).to.equal("Public");
    });

    it("expect processType to equal 'synchronous' as events configs", () => {
      // arranges
      const ServiceConfigurate = ServiceConfigurateFactory.create(configs);
      const name = "Test";

      // acts
      const processType = ServiceConfigurate.processType(name);

      // asserts
      expect(processType).to.equal("synchronous");
    });

    it("expect processType to equal 'asynchronous' as default configs", () => {
      // arranges
      const ServiceConfigurate = ServiceConfigurateFactory.create(configs);
      const name = "Others";

      // acts
      const processType = ServiceConfigurate.processType(name);

      // asserts
      expect(processType).to.equal("asynchronous");
    });

    it("expect versioning to equal 'Static' as events configs", () => {
      // arranges]
      const ServiceConfigurate = ServiceConfigurateFactory.create(configs);
      const name = "Test";

      // acts
      const versioning = ServiceConfigurate.versioning(name);

      // asserts
      expect(versioning).to.equal("Static");
    });

    it("expect versioning to equal 'None' as default configs", () => {
      // arranges]
      const ServiceConfigurate = ServiceConfigurateFactory.create(configs);
      const name = "Others";

      // acts
      const versioning = ServiceConfigurate.versioning(name);

      // asserts
      expect(versioning).to.equal("None");
    });
  });

  describe("ServiceConfigs #4", () => {
    const configs: IServiceConfigs = {
      events: {
        Test: {
          level: "Scope",
          processType: "synchronous",
          versioning: "Static"
        },
        Others: {},
      },
    };

    it("expect level to equal 'Scope' as events configs", () => {
      // arranges
      const ServiceConfigurate = ServiceConfigurateFactory.create(configs);
      const name = "Test";

      // acts
      const level = ServiceConfigurate.level(name);

      // asserts
      expect(level).to.equal("Scope");
    });

    it("expect level to equal 'Public' as default configs", () => {
      // arranges
      const ServiceConfigurate = ServiceConfigurateFactory.create(configs);
      const name = "Others";

      // acts
      const level = ServiceConfigurate.level(name);

      // asserts
      expect(level).to.equal("Public");
    });

    it("expect processType to equal 'synchronous' as events configs", () => {
      // arranges
      const ServiceConfigurate = ServiceConfigurateFactory.create(configs);
      const name = "Test";

      // acts
      const processType = ServiceConfigurate.processType(name);

      // asserts
      expect(processType).to.equal("synchronous");
    });

    it("expect processType to equal 'asynchronous' as default configs", () => {
      // arranges
      const ServiceConfigurate = ServiceConfigurateFactory.create(configs);
      const name = "Others";

      // acts
      const processType = ServiceConfigurate.processType(name);

      // asserts
      expect(processType).to.equal("asynchronous");
    });

    it("expect versioning to equal 'Static' as events configs", () => {
      // arranges]
      const ServiceConfigurate = ServiceConfigurateFactory.create(configs);
      const name = "Test";

      // acts
      const versioning = ServiceConfigurate.versioning(name);

      // asserts
      expect(versioning).to.equal("Static");
    });

    it("expect versioning to equal 'None' as default configs", () => {
      // arranges]
      const ServiceConfigurate = ServiceConfigurateFactory.create(configs);
      const name = "Others";

      // acts
      const versioning = ServiceConfigurate.versioning(name);

      // asserts
      expect(versioning).to.equal("None");
    });
  });

  describe("ServiceConfigs #5", () => {
    const configs: IServiceConfigs = {
      service: {
        level: "Public",
        processType: "synchronous",
        versioning: "Dynamic",
      },
      events: {
        Test: {
          level: "Scope",
          processType: "asynchronous",
          versioning: "Static"
        },
        Others: {},
      },
    };

    it("expect level to equal 'Scope' as events configs", () => {
      // arranges
      const ServiceConfigurate = ServiceConfigurateFactory.create(configs);
      const name = "Test";

      // acts
      const level = ServiceConfigurate.level(name);

      // asserts
      expect(level).to.equal("Scope");
    });

    it("expect level to equal 'Public' as service configs", () => {
      // arranges
      const ServiceConfigurate = ServiceConfigurateFactory.create(configs);
      const name = "Others";

      // acts
      const level = ServiceConfigurate.level(name);

      // asserts
      expect(level).to.equal("Public");
    });

    it("expect processType to equal 'asynchronous' as events configs", () => {
      // arranges
      const ServiceConfigurate = ServiceConfigurateFactory.create(configs);
      const name = "Test";

      // acts
      const processType = ServiceConfigurate.processType(name);

      // asserts
      expect(processType).to.equal("asynchronous");
    });

    it("expect processType to equal 'synchronous' as service configs", () => {
      // arranges
      const ServiceConfigurate = ServiceConfigurateFactory.create(configs);
      const name = "Others";

      // acts
      const processType = ServiceConfigurate.processType(name);

      // asserts
      expect(processType).to.equal("synchronous");
    });

    it("expect versioning to equal 'Static' as events configs", () => {
      // arranges]
      const ServiceConfigurate = ServiceConfigurateFactory.create(configs);
      const name = "Test";

      // acts
      const versioning = ServiceConfigurate.versioning(name);

      // asserts
      expect(versioning).to.equal("Static");
    });

    it("expect versioning to equal 'Dynamic' as service configs", () => {
      // arranges]
      const ServiceConfigurate = ServiceConfigurateFactory.create(configs);
      const name = "Others";

      // acts
      const versioning = ServiceConfigurate.versioning(name);

      // asserts
      expect(versioning).to.equal("Dynamic");
    });
  });
});
