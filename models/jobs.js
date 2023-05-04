const mongoose = require("mongoose");

const jobsSchema = new mongoose.Schema(
  {
    Company_Name: String,
    Job_Role: String,
    Job_Location: String,
    Salary: Number,
    Vacancy: Number,
    Branch_Eligibility: String,
    Minimum_CGPA: Number,
    Deadline_Date: Number,
  },
  { timestamps: true }
);
const jobsmodel = mongoose.model("jobs", jobsSchema);
module.exports = jobsmodel;
