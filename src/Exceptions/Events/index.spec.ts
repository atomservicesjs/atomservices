import { expect } from "chai";
import {
  CurrentVersionQueryingError,
  EventPublishingError,
  EventStoringError,
  EventVersionConflictedConcurrent,
  UnhandledError,
} from "./index";

describe("Exception Events tests", () => {
  it("expect CurrentVersionQueryingError", () => {
    // arranges
    const event: any = {};
    const error: any = {};

    // acts
    const exception = CurrentVersionQueryingError(event, error);

    // asserts
    expect(exception.name).to.equal("_CurrentVersionQueryingError");
  });

  it("expect EventPublishingError", () => {
    // arranges
    const event: any = {};
    const error: any = {};

    // acts
    const exception = EventPublishingError(event, error);

    // asserts
    expect(exception.name).to.equal("_EventPublishingError");
  });

  it("expect EventStoringError", () => {
    // arranges
    const event: any = {};
    const error: any = {};

    // acts
    const exception = EventStoringError(event, error);

    // asserts
    expect(exception.name).to.equal("_EventStoringError");
  });

  it("expect EventVersionConflictedConcurrent", () => {
    // arranges
    const event: any = {};
    const error: any = {};

    // acts
    const exception = EventVersionConflictedConcurrent(event, error, 0);

    // asserts
    expect(exception.name).to.equal("_EventVersionConflictedConcurrent");
  });

  it("expect UnhandledError", () => {
    // arranges
    const event: any = {};
    const error: any = {};

    // acts
    const exception = UnhandledError(event, error);

    // asserts
    expect(exception.name).to.equal("_UnhandledError");
  });
});
