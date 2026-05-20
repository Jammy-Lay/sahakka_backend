const demo = require("../services/demo");
const { getIO } = require("../configs/socket");

exports.updateToApproved = async (req, res) => {
  try {
    const task_id = req.params.task_id;

    await demo.updateToApproved(task_id);

    const io = getIO();

    io.emit("task-update", {
      id: Number(task_id),
      status: "approved",
    });

    return res.json({
      result: true,
      message: "Updated to Approved",
    });
  } catch (error) {
    return res.status(500).json({
      result: false,
      message: error.message,
    });
  }
};

exports.updateToRejected = async (req, res) => {
  try {
    const task_id = req.params.task_id;

    await demo.updateToRejected(task_id);

    const io = getIO();

    io.emit("task-update", {
      id: Number(task_id),
      status: "rejected",
    });
    return res.json({
      result: true,
      message: "Update Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      result: false,
      message: error.message,
    });
  }
};

exports.getTask = async (req, res) => {
  try {
    const row = await demo.getTask();
    return res.json({
      result: true,
      message: "Get Task Successfully",
      data: row,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      result: false,
      message: error.message,
    });
  }
};
