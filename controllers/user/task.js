const task = require("../../services/user/task");
const { getIO } = require("../../configs/socket");

exports.getTasksByTeam = async (req, res) => {
  try {
    const { team_id, workspace_id } = req.params;

    const rows = await task.getTasksByTeam(team_id, workspace_id);

    return res.json({
      result: true,
      message: "Get Task Successfully",
      data: rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      result: false,
      message: error.message,
    });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { team_id } = req.params;
    const user_id = req.user.id;

    const result = await task.createTask(team_id, req.body, user_id);
    const row = await task.findTaskById(result);

    const io = getIO();

    io.emit("task-created", {
      team_id: Number(team_id),
      task: row[0],
    });

    return res.json({
      result: true,
      message: "Task created successfully",
      data: row[0],
    });
  } catch (err) {
    return res.status(400).json({
      result: false,
      message: err.message,
    });
  }
};
