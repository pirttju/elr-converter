// Set the environment to 'test'
process.env.NODE_ENV = "test";

const request = require("supertest");
const { expect } = require("chai");
const app = require("../app");

const TEST_ELR = "NHB";
const TEST_MILES = 57;
const TEST_CHAINS = 12;
const EXPECTED_LON = 0.0610007;
const EXPECTED_LAT = 50.7843128;

const TEST_ELR_2 = "FTC";
const TEST_KILOMETRES_2 = 8;
const TEST_METRES_2 = 1004;
const EXPECTED_LON_2 = 1.1412999;
const EXPECTED_LAT_2 = 51.0955264;

describe("Coordinates API", () => {
  describe("GET /coordinates", () => {
    it("should return a 200 OK and a coordinate for a valid ELR, miles and chains", async () => {
      const response = await request(app)
        .get(
          `/coordinates?elr=${TEST_ELR}&miles=${TEST_MILES}&chains=${TEST_CHAINS}`
        )
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.longitude).to.be.closeTo(EXPECTED_LON, 0.0001);
      expect(response.body.latitude).to.be.closeTo(EXPECTED_LAT, 0.0001);
    });

    it("should return a 200 OK and a coordinate for a valid ELR, kilometres and metres", async () => {
      const response = await request(app)
        .get(
          `/coordinates?elr=${TEST_ELR_2}&kilometres=${TEST_KILOMETRES_2}&metres=${TEST_METRES_2}`
        )
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.longitude).to.be.closeTo(EXPECTED_LON_2, 0.0001);
      expect(response.body.latitude).to.be.closeTo(EXPECTED_LAT_2, 0.0001);
    });

    it("should return a 404 Not Found for a mileage outside the valid range of the ELR", async () => {
      // We use a valid ELR but a mileage that is guaranteed to be too high.
      await request(app)
        .get(`/coordinates?elr=${TEST_ELR}&miles=9999`)
        .expect(404);
    });

    it("should return a 400 Bad Request if the ELR parameter is missing", async () => {
      await request(app).get("/coordinates?miles=10").expect(400);
    });
  });

  describe("POST /coordinates", () => {
    it("should correctly process valid items and return null for invalid items (bad ELR or out-of-range mileage)", async () => {
      const batchPayload = [
        { id: "ok", elr: TEST_ELR, miles: TEST_MILES, chains: TEST_CHAINS }, // Success
        {
          id: "ok-2",
          elr: TEST_ELR_2,
          kilometres: TEST_KILOMETRES_2,
          metres: TEST_METRES_2,
        }, // Success
        { id: "bad_elr", elr: "BAD_ELR", miles: 10 }, // Failure: Bad ELR
        { id: "out_of_range", elr: TEST_ELR, miles: 9999 }, // Failure: Out of Range
      ];

      const response = await request(app)
        .post("/coordinates")
        .send(batchPayload)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).to.be.an("array").with.lengthOf(4);

      // Check the successful conversion
      const resultOk = response.body.find((r) => r.id === "ok");
      expect(resultOk.longitude).to.be.closeTo(EXPECTED_LON, 0.0001);
      expect(resultOk.latitude).to.be.closeTo(EXPECTED_LAT, 0.0001);

      const resultOk2 = response.body.find((r) => r.id === "ok-2");
      expect(resultOk2.longitude).to.be.closeTo(EXPECTED_LON_2, 0.0001);
      expect(resultOk2.latitude).to.be.closeTo(EXPECTED_LAT_2, 0.0001);

      // Check the failed conversion due to a bad ELR
      const resultBadElr = response.body.find((r) => r.id === "bad_elr");
      expect(resultBadElr.longitude).to.be.null;
      expect(resultBadElr.latitude).to.be.null;

      // Check the failed conversion due to an out-of-range mileage
      const resultOutOfRange = response.body.find(
        (r) => r.id === "out_of_range"
      );
      expect(resultOutOfRange.longitude).to.be.null;
      expect(resultOutOfRange.latitude).to.be.null;
    });
  });
});
