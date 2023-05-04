const mongoose = require("mongoose");

const RegistrationsSchema = new mongoose.Schema(
  {
    Student_Name: String,
    JobID: Number,
    Branch: String,
    CGPA: Number,
    passoutYear: Number,
    emailID: String,
    phonenumber: Number,
    Home_Address: String,
    Job_Status: String,
    Job_application_date: Number,
  },
  { timestamps: true }
);
const Registrationsmodel = mongoose.model("Registrations", RegistrationsSchema);
module.exports = Registrationsmodel;
