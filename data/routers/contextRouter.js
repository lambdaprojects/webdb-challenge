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

//GET CONTEXT BY ID
router.get("/:id", validateContextId, async (req, res) => {
  try {
    res.status(200).json(req.context);
  } catch (error) {
    res.status(500).json({
      ERROR_MESSAGE: "There was an error while retrieving the context."
    });
  }
});

//ADD A CONTEXT
router.post("/", validateContext, async (req, res) => {
  try {
    const context = await contextHelper.add(req.body);
    res.status(200).json(context);
  } catch (error) {
    res.status(500).json({
      ERROR_MESSAGE: "There was an error while inserting the context."
    });
  }
});

//UPDATE A CONTEXT
router.put("/:id", validateContextId, validateContext, async (req, res) => {
  try {
    const contextId = req.params.id;
    const updateContext = await contextHelper.update(contextId, req.body);
    res.status(200).json(updateContext);
  } catch (error) {
    res.status(500).json({
      ERROR_MESSAGE: "There was an error while updating the context."
    });
  }
});

//DELETE A CONTEXT
router.delete("/:id", validateContextId, async (req, res) => {
  try {
    const contextId = req.params.id;
    const deleteContext = await contextHelper.remove(contextId);
    res.status(200).json({ SUCCESS_MESSAGE: "Context deleted successfully." });
  } catch (error) {
    res.status(500).json({
      ERROR_MESSAGE: "There was an error while deleting the context."
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

//This is a custom middleware to validate a context
// Following are the validations:
// 1. Validates the body on a request to create a new context
// 2. validate if request body is not missing else 400
// 3. validate if the request body has the name and description field
function validateContext(req, res, next) {
  if (req.body) {
    if (req.body.name) {
      next();
    } else {
      res.status(400).json({
        ERROR_MESSAGE: "Missing required name field."
      });
    }
  } else {
    res.status(400).json({ ERROR_MESSAGE: "Missing context data." });
  }
}

module.exports = router;
