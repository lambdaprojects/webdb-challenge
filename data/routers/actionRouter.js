const express = require("express");
const router = express.Router();
const actionHelper = require("../helpers/actionModel.js");
const projectHelper = require("../helpers/projectModel.js");

//GET ALL ACTIONS
router.get("/", async (req, res) => {
  try {
    const actions = await actionHelper.get();
    if (actions.length > 0) {
      res.status(200).json(actions);
    } else {
      res
        .status(400)
        .json({ ERROR_MESSAGE: "There are no actions to display" });
    }
  } catch (error) {
    res.status(500).json({
      ERROR_MESSAGE: "There was an error while retrieving the actions."
    });
  }
});

//GET AN ACTION FOR THE ACTION ID PASSED AS PARAM
router.get("/:id", validateActionId, async (req, res) => {
  try {
    res.status(200).json(req.action);
  } catch (error) {
    res.status(500).json({
      ERROR_MESSAGE: "There was an error while retrieving the actions."
    });
  }
});

//ADD AN ACTION
router.post("/", validateProjectId, validateAction, async (req, res) => {
  try {
    const action = await actionHelper.insert(req.body);
    res.status(200).json(action);
  } catch (error) {
    res.status(500).json({
      ERROR_MESSAGE: "There was an error while inserting the action."
    });
  }
});

//UPDATE AN ACTION
router.put(
  "/:id",
  validateProjectId,
  validateActionId,
  validateAction,
  async (req, res) => {
    try {
      const actionId = req.params.id;
      const updateAction = await actionHelper.update(actionId, req.body);
      res.status(200).json(updateAction);
    } catch (error) {
      res.status(500).json({
        ERROR_MESSAGE: "There was an error while updating the action."
      });
    }
  }
);

//DELETE AN ACTION
router.delete("/:id", validateActionId, async (req, res) => {
  try {
    const actionId = req.params.id;
    const deleteAction = await actionHelper.remove(actionId);
    res.status(200).json({ SUCCESS_MESSAGE: "Action deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ ERROR_MESSAGE: "There was an error while deleting the action." });
  }
});

// This is a custom middleware function to validate action Id
// The following validations have been performed.
// 1. Check if the id exist in the req params.
// 2. Check if id is not null 0 or empty string
// 3. Check if the id is available in the database
async function validateActionId(req, res, next) {
  if (req.params.id) {
    if (req.params.id !== 0 && req.params.id !== null && req.params.id !== "") {
      const action = await actionHelper.get(req.params.id);
      if (action) {
        req.action = action;
        next();
      } else {
        res.status(400).json({
          ERROR_MESSAGE: "No action available for this post id in the database."
        });
      }
    } else {
      res.status(400).json({
        ERROR_MESSAGE: "The action id provided is either null or empty."
      });
    }
  } else {
    res.status(400).json({ ERROR_MESSAGE: "There is no action id available." });
  }
}

//This is a custom middleware to validate an action
// Following are the validations:
// 1. Validates the body on a request to create a new action
// 2. validate if request body is not missing else 400
// 3. validate if the request body has the projectId, notes and description field
// 4. Validates if the projectId is a valid project id.
// 5. Validates if the description size is not greater than 128
function validateAction(req, res, next) {
  if (req.body) {
    if (req.body.notes && req.body.description) {
      if (req.body.description.length < 129) {
        next();
      } else {
        res.status(400).json({
          ERROR_MESSAGE: "Description is greater than 128 characters."
        });
      }
    } else {
      res.status(400).json({
        ERROR_MESSAGE: "Missing required name field or description field"
      });
    }
  } else {
    res.status(400).json({ ERROR_MESSAGE: "Missing project data." });
  }
}

// This is a custom middleware function to validate project Id
// The following validations have been performed.
// 1. Check if the id exist in the req params.
// 2. Check if id is not null 0 or empty string
// 3. Check if the id is available in the database
async function validateProjectId(req, res, next) {
  if (req.body.project_id) {
    const project_id = req.body.project_id;
    if (project_id !== 0 && project_id !== null && project_id !== "") {
      const project = await projectHelper.get(project_id);
      if (project) {
        next();
      } else {
        res.status(400).json({
          ERROR_MESSAGE:
            "No project available for this post id in the database."
        });
      }
    } else {
      res.status(400).json({
        ERROR_MESSAGE: "The project id provided is either null or empty."
      });
    }
  } else {
    res
      .status(400)
      .json({ ERROR_MESSAGE: "There is no project id available." });
  }
}

module.exports = router;
