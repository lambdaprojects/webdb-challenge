const express = require("express");
const router = express.Router();
const actionContextHelper = require("../helpers/actionContextHelper.js");
const actionHelper = require("../helpers/actionHelper.js");
const contextHelper = require("../helpers/contextHelper.js");

// GET ALL ACTION CONTEXT
router.get("/", async (req, res) => {
  try {
    const actionContext = await actionContextHelper.get();
    if (actionContext.length > 0) {
      res.status(200).json(actionContext);
    } else {
      res
        .status(400)
        .json({ ERROR_MESSAGE: "There are no action-contexts to display" });
    }
  } catch (error) {
    console.log(":::: ERROR ::::" + error);
    res.status(500).json({
      ERROR_MESSAGE: "There was an error while retrieving the action-contexts."
    });
  }
});

//ADD AN ACTION CONTEXT
router.post("/", validateActionContext, async (req, res) => {
  try {
    const actionContext = await actionContextHelper.add(req.body);
    res.status(200).json(actionContext);
  } catch (error) {
    console.log(":::: ERROR ::::" + error);
    res.status(500).json({
      ERROR_MESSAGE: "There was an error while inserting the action-context."
    });
  }
});

//UPDATE AN ACTION CONTEXT
router.put(
  "/:id",
  validateActionContextId,
  validateActionContext,
  async (req, res) => {
    try {
      const actionContextId = req.params.id;
      const updateActionContext = await actionContextHelper.update(
        actionContextId,
        req.body
      );
      res.status(200).json(updateActionContext);
    } catch (error) {
      res.status(500).json({
        ERROR_MESSAGE: "There was an error while updating the action-context."
      });
    }
  }
);

//DELETE AN ACTION CONTEXT
router.delete("/:id", validateActionContextId, async (req, res) => {
  try {
    const actionContextId = req.params.id;
    const deleteActionContext = await actionContextHelper.remove(
      actionContextId
    );
    res
      .status(200)
      .json({ SUCCESS_MESSAGE: "Action Context deleted successfully." });
  } catch (error) {
    res.status(500).json({
      ERROR_MESSAGE: "There was an error while deleting the action context."
    });
  }
});

// This is a custom middleware function to validate action context Id
// The following validations have been performed.
// 1. Check if the id exist in the req params.
// 2. Check if id is not null 0 or empty string
// 3. Check if the id is available in the database
async function validateActionContextId(req, res, next) {
  if (req.params.id) {
    if (req.params.id !== 0 && req.params.id !== null && req.params.id !== "") {
      const actionContext = await actionContextHelper.get(req.params.id);
      if (actionContext) {
        req.actionContext = actionContext;
        next();
      } else {
        res.status(400).json({
          ERROR_MESSAGE:
            "No action context available for this id in the database."
        });
      }
    } else {
      res.status(400).json({
        ERROR_MESSAGE: "The action context id provided is either null or empty."
      });
    }
  } else {
    res
      .status(400)
      .json({ ERROR_MESSAGE: "There is no action context id available." });
  }
}

//This is a custom middleware to validate a context
// Following are the validations:
// 1. Validates the body on a request to create a new context
// 2. validate if request body is not missing else 400
// 3. validate if the request body has the name and description field
async function validateActionContext(req, res, next) {
  if (req.body) {
    if (req.body.action_id && req.body.context_id) {
      console.log(":: ACTION ID IN REQ BODY IS ::" + req.body.action_id);
      console.log(":: CONTEXT ID IN REQ BODY IS ::" + req.body.context_id);
      const action_id = await actionHelper.get(req.body.action_id);
      const context_id = await contextHelper.getById(req.body.context_id);
      console.log(":: ACTION ID value::" + JSON.stringify(action_id));
      console.log(":: CONTEXT ID value ::" + JSON.stringify(context_id));
      if (action_id !== null && context_id !== null) {
        next();
      } else {
        res
          .status(404)
          .json({ ERROR_MESSAGE: "Cannot find records for the ids provided." });
      }
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
