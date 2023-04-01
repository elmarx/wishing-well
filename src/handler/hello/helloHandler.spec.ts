import { initHelloHandler } from "./helloHandler";
import { createRequest, createResponse } from "node-mocks-http";
import { InputDecodingFailedError } from "../../errors/input";

describe("helloHandler", () => {
  const subject = initHelloHandler("jest");

  describe("GET endpoint", () => {
    test("without query parameter", () => {
      const sampleReq = createRequest({ url: "/" });
      const sampleRes = createResponse();
      const next = jest.fn();

      subject(sampleReq, sampleRes, next);

      expect(next).not.toBeCalled();
      expect(sampleRes._getStatusCode()).toStrictEqual(200);
      expect(sampleRes._getData()).toStrictEqual("Hello jest");
    });

    test("with query parameter", () => {
      const sampleReq = createRequest({ url: "/", query: { name: "test" } });
      const sampleRes = createResponse();
      const next = jest.fn();

      subject(sampleReq, sampleRes, next);

      expect(next).not.toBeCalled();
      expect(sampleRes._getStatusCode()).toStrictEqual(200);
      expect(sampleRes._getData()).toStrictEqual("Hello test");
    });
  });

  describe("POST endpoint", () => {
    test("with correct body parameter", () => {
      const sampleReq = createRequest({
        url: "/",
        method: "POST",
        body: { name: "test" },
      });
      const sampleRes = createResponse();
      const next = jest.fn();

      subject(sampleReq, sampleRes, next);

      expect(next).not.toBeCalled();
      expect(sampleRes._getStatusCode()).toStrictEqual(200);
      expect(sampleRes._getJSONData()).toStrictEqual({ msg: "Hello test" });
    });

    test("with invalid input", async () => {
      const sampleReq = createRequest({
        url: "/",
        method: "POST",
        body: { name: 42 },
      });
      const sampleRes = createResponse();

      // calling with an invalid body will throw, thus call the 'next' function
      const nextArg = await new Promise((r) =>
        subject(sampleReq, sampleRes, r),
      );
      expect(nextArg).toBeInstanceOf(InputDecodingFailedError);
      expect(nextArg).toHaveProperty("statusCode", 422);
    });
  });
});
