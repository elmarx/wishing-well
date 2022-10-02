import { initBailoutHandler } from "./bailout";
import { createRequest, createResponse } from "node-mocks-http";

describe("bailout handler", () => {
  const subject = initBailoutHandler();

  test("favicon request", () => {
    const sampleRequest = createRequest({
      url: "/favicon.ico",
    });
    const sampleResponse = createResponse();
    const next = jest.fn();

    subject(sampleRequest, sampleResponse, next);
    expect(sampleResponse.statusCode).toStrictEqual(204);
    expect(sampleResponse._isEndCalled());
    expect(sampleResponse._getData()).toStrictEqual("");
  });
});
