const express = require("express");
const router = express.Router();

//Handle Register
router.get("/", (req, res) => {
  res.send("api is online");
});

module.exports = router;
