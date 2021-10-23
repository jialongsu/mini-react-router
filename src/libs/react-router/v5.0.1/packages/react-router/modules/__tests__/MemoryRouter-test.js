import React from "react";
import ReactDOM from "react-dom";
import { MemoryRouter } from "react-router";

import renderStrict from "./utils/renderStrict.js";

describe("A <MemoryRouter>", () => {
  const node = document.createElement("div");

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(node);
  });

  describe("with a history prop", () => {
    it("logs a warning", () => {
      jest.spyOn(console, "warn").mockImplementation(() => {});

      const history = {};
      renderStrict(<MemoryRouter history={history} />, node);

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("<MemoryRouter> ignores the history prop")
      );
    });
  });
});
