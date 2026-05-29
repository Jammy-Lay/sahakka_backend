const submission = require("../../services/user/submission");
const workspace = require("../../services/user/workspace");
const team = require("../../services/user/team");

exports.submitTask = async (req, res) => {
  try {
    const { task_id } = req.params;

    const result = await submission.submitTask(
      task_id,
      req.user,
      req.body.message,
      req.file,
    );

    return res.json({
      result: true,
      message: "Task submitted successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      result: false,
      message: error.message,
    });
  }
};

exports.getAllSubmissions = async (req, res) => {
  try {
    const { workspace_id, team_id } = req.params;

    const submissions = await submission.getAllSubmissions(
      workspace_id,
      team_id,
    );

    const rowWorkspace = await workspace.findWorkspace(workspace_id);
    const rowTeam = await team.findTeam(team_id);

    return res.json({
      result: true,
      message: "Get Submissions Successfully",
      data: {
        workspace: rowWorkspace,
        team: rowTeam,
        submissions,
      },
    });
  } catch (error) {
    return res.status(400).json({
      result: false,
      message: error.message,
    });
  }
};

exports.updateSubmissionStatus = async (req, res) => {
  try {
    const { workspace_id, team_id, submission_id } = req.params;
    const { status, feedback } = req.body;

    const result = await submission.updateSubmissionStatus(
      workspace_id,
      team_id,
      submission_id,
      status,
      feedback,
      req.user,
    );

    return res.json({
      result: true,
      message: "Submission updated successfully",
      data: result,
    });
  } catch (err) {
    return res.status(400).json({
      result: false,
      message: err.message,
    });
  }
};
