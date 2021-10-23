"use strict";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./cjs/react-router-dom.min.js");
} else {
  module.exports = require("./modules/index.js");
  // module.exports = require("./cjs/react-router-dom.js");
}
