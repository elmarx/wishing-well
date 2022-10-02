import * as t from "io-ts";

export const HelloBodyParams = t.type({
  name: t.string,
});
export type HelloBodyParams = t.TypeOf<typeof HelloBodyParams>;
