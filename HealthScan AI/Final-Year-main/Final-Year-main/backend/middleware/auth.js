// Authentication is now handled per-route by middleware/roleAuth.js (protect),
// and errors flow through the centralized handler in middleware/errorHandler.js.
// This file is kept as a re-export for backwards compatibility.
module.exports = require("./roleAuth");
