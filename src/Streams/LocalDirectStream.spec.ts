import { expect } from "chai";
import * as sinon from "sinon";
import { LocalDirectStream } from "./LocalDirectStream";

describe("Streams/LocalDirectStream.ts tests", () => {
  describe("#LocalDirectStream.directTo()", () => {
    const listener = sinon.spy();
    const ref = "REF";
    const unref = "UNREF";

    beforeEach(() => {
      listener.resetHistory();
    });

    it("expect to get data from LocalDirectStream when direct to listening ref", async () => {
      // arranges
      const data = {};
      await LocalDirectStream.listenTo(ref, listener);

      // acts
      await LocalDirectStream.directTo(ref, data);

      // asserts
      expect(listener.callCount).to.equal(1);
      expect(listener.calledOnceWith(data)).to.equal(true);
    });

    it("expect to not get data from LocalDirectStream when direct to listening ref", async () => {
      // arranges
      const data = {};

      // acts
      await LocalDirectStream.directTo(ref, data);

      // asserts
      expect(listener.callCount).to.equal(0);
    });

    it("expect to not get data from LocalDirectStream when direct to unlistening", async () => {
      // arranges
      const data = {};

      // acts
      await LocalDirectStream.directTo(unref, data);

      // asserts
      expect(listener.callCount).to.equal(0);
    });
  });
});
