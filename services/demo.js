const demo = require("../models/demo");

exports.updateToApproved = async (id) => {
  await demo.updateToApproved(id);
};

exports.updateToRejected = async (id) => {
  await demo.updateToRejected(id);
};

exports.getTask = async () => {
  let row = await demo.getTask();
  return row;
}
