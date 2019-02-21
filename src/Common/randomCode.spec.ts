import { expect } from "chai";
import { randomCode } from "./randomCode";

describe("randomCode.ts tests", () => {
  describe("#randomCode()", () => {
    it("expect to generate a code with specific length", async () => {
      // arranges

      // acts
      const result = randomCode(6);

      // asserts
      expect(result.length).to.equal(6);
    });

    it("expect to generate a code with default length", async () => {
      // arranges

      // acts
      const result = randomCode();

      // asserts
      expect(result.length).to.equal(10);
    });

    it("expect to generate different two codes [2-digits] for 1,000 times with 980 results (98.00%)", async () => {
      // arranges
      let equal: number = 0;
      let inequal: number = 0;

      // acts
      for (let i = 0; i < 1000; i++) {
        const code1 = randomCode(2);
        const code2 = randomCode(2);

        if (code1 === code2) {
          equal++;
        } else {
          inequal++;
        }
      }

      // asserts
      expect(inequal).to.greaterThan(980);
      expect(equal).to.lessThan(20);
    });

    it("expect to generate different two codes [6-digits] for 1,000 times with 1,000 results (100%)", async () => {
      // arranges
      let equal: number = 0;
      let inequal: number = 0;
      const max = 1000;

      // acts
      for (let i = 0; i < max; i++) {
        const code1 = randomCode(6);
        const code2 = randomCode(6);

        if (code1 !== code2) {
          inequal++;
        }
      }

      equal = max - inequal;

      // asserts
      expect(inequal).to.greaterThan(999);
      expect(equal).to.lessThan(1);
    });
  });
});
