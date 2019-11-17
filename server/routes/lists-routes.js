const router = require("express").Router();

// retrieve owned lists first, then subscribed lists.
router.get("/lists/list?reverse=true");

module.exports = router;
