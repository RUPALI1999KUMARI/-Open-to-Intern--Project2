const internModel = require("../models/internModel");
const collegeModel = require("../models/collegeModel");
const validator = require("../utils/validator");

const interns = async function (req, res) {
  try {
    let data = req.body;
    let { name, email, mobile, collegeName } = data;
    if (!validator.isValidRequestBody(data)) {
      return res
        .status(400)
        .send({ status: false, msg: "incomplete request data" });
    }
    //--mandatory field--//
    if (!validator.isValid(collegeName)) {
      return res
        .status(400)
        .send({ status: false, msg: " collegeName is required...!" });
    }
    if (!validator.isValidName(name)) {
      return res
        .status(400)
        .send({
          status: false,
          msg: " Name is required and first character must be capital...!",
        });
    }
    const mobile1 = await internModel.findOne({ mobile: mobile });
    const email1 = await internModel.findOne({ email: email });
    if (!validator.isValidEmail(email) || email1) {
      return res.status(400).send({
        status: false,
        msg: "emailId is required and must be unique...!",
      });
    }
    if (!validator.isValid(mobile) || mobile1) {
      return res.status(400).send({
        status: false,
        msg: "mobile is required and must be unique...!",
      });
    }
    const college = await collegeModel.findOne({ name: collegeName });
    if (!college) {
      return res
        .status(404)
        .send({ status: false, msg: "college not found...!" });
    }
    data.collegeId = college._id;
    let internData = await internModel.create(data);
    res.status(201).send({
      status: true,
      data: internData,
      message: "Intern created successfully..",
    });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};
module.exports = { interns };