const express = require("express");
//const mongoose = require("mongoose");
const app = express();

const { connectDatabase } = require("./connection/connect");
const JOBS_MODEL = require("./models/jobs");
const REGISTRATIONS_MODEL = require("./models/Registrations");
app.use(express.json());
app.post("/api/jobs", async (req, res) => {
  try {
    let no_of_jobs = await JOBS_MODEL.find({
      Company_Name: req.body.Name,
    }).countDocuments();
    if (no_of_jobs < 2) {
      const jobsobject = {
        Company_Name: req.body.Name,
        Job_Role: req.body.Job_Role,
        Job_Location: req.body.Job_Location,
        Salary: req.body.Salary,
        Vacancy: req.body.Vacancy,
        Branch_Eligibility: req.body.Eligibility,
        Minimum_CGPA: req.body.CGPA,
        Deadline_Date: req.body.Deadline_Date,
      };
      const jobsdata = new JOBS_MODEL(jobsobject);
      await jobsdata.save();
      return res.json({
        success: true,
        message: "Job details saved successfully",
      });
    } else {
      return res.json({
        success: false,
        message: "maximum of two jobs by one companys",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.messaage });
  }
});
app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await JOBS_MODEL.find();
    return res.json({ success: true, data: jobs });
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
});
app.post("/api/Registrations", async (req, res) => {
  try {
    let data = await REGISTRATIONS_MODEL.find({
      Job_Status: req.body.Status,
      Job_ID: req.body.job_id,
    }).countDocuments();
    if (data < 1) {
      const studentobject = {
        Student_Name: req.body.Name,
        JobID: req.body.ID,
        Branch: req.body.Branch,
        CGPA: req.body.CGPA,
        passoutYear: req.body.Year,
        emailID: req.body.email,
        phonenumber: req.body.number,
        Home_Address: req.body.Address,
        Job_Status: req.body.Status,
        Job_application_date: req.body.date,
      };
      const Registrationsdata = new REGISTRATIONS_MODEL(studentobject);
      await Registrationsdata.save();
      return res.json({
        success: true,
        message: "Student applied successfully",
      });
    } else {
      return res.json({ message: "Already applied, and should not ry-appli" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.messaage });
  }
});
app.get("/api/Registrations", async (req, res) => {
  try {
    const Registrations = await REGISTRATIONS_MODEL.find();
    return res.json({ success: true, data: Registrations });
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
});
// TnP can change the job status of the students from applied or shortlisted or hired or declined
app.put("/updatestatus/:Job_Status", async (req, res) => {
  try {
    const data = await REGISTRATIONS_MODEL.findByIdAndUpdate(req.params.id, {
      Job_Status: "Applied",
    });
    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});
// TnP can change job details if required
app.put("/update_jobs_details/:id", async (req, res) => {
  try {
    const data = await JOBS_MODEL.findByIdAndUpdate(req.param.id, {
      Branch_Eligibility: "ECE",
      Minimum_CGPA: "7.8",
      Deadline_Date: "09052023",
    });

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});
// student can change their registration details if required
app.put("/update_Registrations/:id", async (req, res) => {
  try {
    const data = await REGISTRATIONS_MODEL.findByIdAndUpdate(req.params.id, {
      Home_Address: "Delhi",
      Job_Status: "Applied",
      Job_application_date: "4052023",
    });

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

//  student must be able to view all the job posting applied
app.post("/api/AllJobpostings/:id", async (req, res) => {
  try {
    const registrationsData = await REGISTRATIONS_MODEL.find({
      JobID: req.body.ID,
    });
    return res.json({ success: true, data: registrationsData });
  } catch (error) {
    console.log(error);
    return res.status(403).json({ success: false, error: error.message });
  }
});

// $lte---->matches values that are greater than or equal to specified value
// $in---->matches any of the value specified in an array
// students can also see job postings according to their branch and cgpa
app.post("/api/filtered_Job_Postings/:cgpa/:branch", async (req, res) => {
  try {
    const CGPA = parseFloat(req.params.GPA);
    const filteredJobData = await JOBS_MODEL.find({
      minimum_CGPA: { $lte: CGPA },
      Branch_Eligibility: { $in: req.params.Eligibility },
    });
    return res.json({ success: true, data: filteredJobData });
  } catch (error) {
    console.log(error);
    return res.status(403).json({ success: false, error: error.message });
  }
});

// TnP can see all students registered for a job
app.post("/api/studentsregisteredforjob/:Job_Id", async (req, res) => {
  try {
    const Data = await REGISTRATIONS_MODEL.find({
      JobID: req.body.ID,
    });
    return res.json({ success: true, data: Data });
  } catch (error) {
    console.log(error);
    return res.status(403).json({ success: false, error: error.message });
  }
});
//  TnP can see all the hired/shortlisted/rejected students
app.post("/api/filtered_Job_Status/:jobstatus", async (req, res) => {
  try {
    const filteredData = await REGISTRATIONS_MODEL.find({
      Job_Status: req.body.Status,
    });
    return res.json({ success: true, data: filteredData });
  } catch (error) {
    console.log(error);
    return res.status(403).json({ success: false, error: error.message });
  }
});

// TnP can see hired student for a company
app.post("/api/candidate_hired/:job_id", async (req, res) => {
  try {
    const hired = await REGISTRATIONS_MODEL.find({
      Job_Status: "Hired",
      Job_ID: req.params.job_id,
    });
    return res.json({ success: true, data: hired });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, error: error.message });
  }
});

// TnP can delete any job posting
app.delete("/delete_job-posting/:id", async (req, res) => {
  try {
    const deletedocument = await JOBS_MODEL.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      data: deletedocument,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});
// student can delete their registration
app.delete("/api/delete/Registrationsdetails/:id", async (req, res) => {
  try {
    const del_jobposting = await REGISTRATIONS_MODEL.findByIdAndDelete(
      req.params.id
    );
    return res.json({ success: true, data: del_jobposting });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, error: error.message });
  }
});

const PORT = 5000;
const a = connectDatabase();
console.log(a);

app.listen(PORT, async () => {
  console.log("Server is running at port", PORT);
});
