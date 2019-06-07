const express = require("express");
const router = express.Router();
const contextHelper = require("../helpers/contextHelper.js");

// GET ALL CONTEXT
router.get("/", async (req, res) => {
  try {
    const contexts = await contextHelper.get();
    if (contexts.length > 0) {
      res.status(200).json(contexts);
    } else {
      res
        .status(400)
        .json({ ERROR_MESSAGE: "There are no contexts to display" });
    }
  } catch (error) {
    res.status(500).json({
      ERROR_MESSAGE: "There was an error while retrieving the contexts."
    });
  }
});

// This is a custom middleware function to validate context Id
// The following validations have been performed.
// 1. Check if the id exist in the req params.
// 2. Check if id is not null 0 or empty string
// 3. Check if the id is available in the database
async function validateContextId(req, res, next) {
  if (req.params.id) {
    if (req.params.id !== 0 && req.params.id !== null && req.params.id !== "") {
      const context = await contextHelper.get(req.params.id);
      if (context) {
        req.context = context;
        next();
      } else {
        res.status(400).json({
          ERROR_MESSAGE: "No context available for this id in the database."
        });
      }
    } else {
      res.status(400).json({
        ERROR_MESSAGE: "The context id provided is either null or empty."
      });
    }
  } else {
    res
      .status(400)
      .json({ ERROR_MESSAGE: "There is no context id available." });
  }
}

module.exports = router;
