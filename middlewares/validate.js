const xss = require("xss");
const fs = require("fs");

const removeUploadedFile = (req) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.log("Delete uploaded file error:", err.message);
      }
    });
  }
};

exports.validate = (schema) => (req, res, next) => {
  const sanitizedBody = {};

  for (const key in req.body) {
    sanitizedBody[key] =
      typeof req.body[key] === "string"
        ? xss(req.body[key].trim())
        : req.body[key];
  }

  const { error, value } = schema.validate(sanitizedBody, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    removeUploadedFile(req);

    return res.status(400).json({
      result: false,
      message: "Invalid Field",
      details: error.details.map((d) => d.message),
    });
  }

  req.validData = value;

  next();
};

const task = require("../models/user/task");
const submission = require("../models/user/submission");

exports.validateSubmitTask = async (req, res, next) => {
  try {
    const { task_id } = req.params;
    const user = req.user;

    const checkTask = await task.findTaskById(task_id);

    if (checkTask.length === 0) {
      throw new Error("Task not found");
    }

    const taskData = checkTask[0];

    if (!taskData.assigned_to_id) {
      throw new Error("Task is not assigned yet");
    }

    if (taskData.assigned_to_id !== user.id) {
      throw new Error("You are not assigned to this task");
    }

    const lastSubmission = await submission.findSubmissionByTask(task_id);

    if (lastSubmission.length > 0) {
      const status = lastSubmission[0].status;

      if (status === "pending") {
        throw new Error("Task already submitted, waiting for review");
      }

      if (status === "approved") {
        throw new Error("Task already approved");
      }

    }

    next();
  } catch (err) {
    // remove uploaded file when validation fail
    removeUploadedFile(req);

    return res.status(400).json({
      result: false,
      message: err.message,
    });
  }
};
