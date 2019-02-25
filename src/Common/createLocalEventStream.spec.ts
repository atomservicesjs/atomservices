import { expect } from "chai";
import * as sinon from "sinon";
import { createLocalEventStream } from "./createLocalEventStream";

describe("createLocalEventStream.ts tests", () => {
  describe("#createLocalEventStream()", () => {
    const to = { scope: "to.scope", type: "to.type" };

    describe("#LocalEventStream.subscribe() and publish()", () => {
      it("expect to create a local event stream", async () => {
        // arranges
        const stream = createLocalEventStream();
        const publicProcess = sinon.spy();
        const scopeProcess = sinon.spy();
        const publicEvent: any = {
          level: "public",
          name: "name",
          type: "type",
        };
        const scopeEvent: any = {
          level: "scope",
          name: "name",
          type: "type",
        };

        // acts
        stream.subscribe(
          {
            level: "public",
            name: "name",
            scope: "scope",
            type: "type",
          },
          to,
          publicProcess,
        );
        stream.subscribe(
          {
            level: "scope",
            name: "name",
            scope: "scope",
            type: "type",
          },
          to,
          scopeProcess,
        );
        await stream.publish(publicEvent, { level: "public", scope: "scope" });
        await stream.publish(scopeEvent, { level: "scope", scope: "scope" });

        // asserts
        expect(publicProcess.calledWith(publicEvent)).to.equal(true);
        expect(scopeProcess.calledWith(scopeEvent)).to.equal(true);
      });
    });

    describe("#LocalEventStream.listenTo() and directTo()", () => {
      it("expect to create a local event stream", async () => {
        // arranges
        const stream = createLocalEventStream();
        const listener = sinon.spy();
        const ref: any = "ref";
        const data: any = {};

        // acts
        stream.listenTo(ref, listener);
        await stream.directTo(ref, data);

        // asserts
        expect(listener.calledWith(data)).to.equal(true);
      });
    });
  });
});
