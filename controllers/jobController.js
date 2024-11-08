
import { db } from "../connect.js";

// Controller for retrieving job postings with optional filtering
export const getJobs = (req, res) => {
  let { location, salary } = req.query;
  let query = "SELECT * FROM jobs";
  let conditions = [];

  if (location) {
    conditions.push(`location LIKE '%${location}%'`);
  }
  if (salary) {
    conditions.push(`salary >= ${salary}`);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve jobs" });
    }
    return res.status(200).json(data);
  });
};


// Controller for updating a job posting
export const updateJob = (req, res) => {
  const { id } = req.params;
  const { title, description, company_name, location, salary } = req.body;

  const updateQuery =
    "UPDATE jobs SET title = ?, description = ?, company_name = ?, location = ?, salary = ? WHERE id = ?";

  const values = [title, description, company_name, location, salary, id];

  db.query(updateQuery, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Job update failed" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Job not found" });
    }
    return res.status(200).json({ message: "Job updated successfully" });
  });
};

// Controller for deleting a job posting
export const deleteJob = (req, res) => {
  const { id } = req.params;

  const deleteQuery = "DELETE FROM jobs WHERE id = ?";

  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete job" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Job not found" });
    }
    return res.status(200).json({ message: "Job deleted successfully" });
  });
};


// Controller for applying to a job
export const applyForJob = (req, res) => {
  const jobId = req.params.id;
  const userId = req.userId; // Assuming userId is set by the token middleware

  // Check if a file (cover letter) was uploaded
  if (!req.file) {
    return res.status(400).json({ error: "Cover letter is required and should be a PDF file." });
  }

  // Get the file path (Multer stores the file in the 'uploads/cover_letters/' directory)
  const coverLetterPath = req.file.path;

  const insertQuery = "INSERT INTO applications (job_id, user_id, cover_letter) VALUES (?, ?, ?)";
  const values = [jobId, userId, coverLetterPath];

  db.query(insertQuery, values, (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to apply for job" });
    }
    return res.status(200).json({ message: "Job application successful", coverLetterPath });
  });
};



// Controller for creating a new job posting with "JOB" prefix
export const createJob = (req, res) => {
    const { title, description, company_name, location, salary, posted_by } = req.body;
    console.log(req.body)
  
    const insertQuery =
      "INSERT INTO jobs (title, description, company_name, location, salary, posted_by) VALUES (?, ?, ?, ?, ?, ?)";
  
    const values = [title, description, company_name, location, salary, posted_by];
  
    db.query(insertQuery, values, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Job creation failed" });
      }
      // Adding "JOB" prefix to the inserted job ID
      const jobIdWithPrefix = `JOB${result.insertId}`;
      return res.status(200).json({ message: "Job created successfully", jobId: jobIdWithPrefix });
    });
  };
  