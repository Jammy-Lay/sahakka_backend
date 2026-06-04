const xss = require("xss");

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
    return res.status(400).json({
      result: false,
      message: "Invalid Field",
      details: error.details.map((d) => d.message),
    });
  }

  req.validData = value;
  // console.log(value);

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

    const pending = await submission.findPendingByTask(task_id);
    if (pending.length > 0) {
      throw new Error("Task already submitted, waiting for review");
    }

    next();
  } catch (err) {
    return res.status(400).json({
      result: false,
      message: err.message,
    });
  }
};
