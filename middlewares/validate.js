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
