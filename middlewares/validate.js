exports.validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.json({
      result: false,
      message: "Invalid Field",
      details: error.details.map((d) => d.message),
    });
  }

  req.validDate = value;
  next();

  // console.log(value);
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
