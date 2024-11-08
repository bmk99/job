import { db } from "../connect.js";

// Controller to fetch all applications for a recruiter's jobs
export const getApplications = (req, res) => {
  const recruiterId = req.userId; // Assuming userId is set by the JWT middleware
  
  // Query to get all applications for the jobs posted by this recruiter
  const query = `
    SELECT a.id AS application_id, a.job_id, a.user_id, a.cover_letter, a.status, j.title AS job_title, u.name AS applicant_name, u.email AS applicant_email
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN users u ON a.user_id = u.id
    WHERE j.posted_by = ?;
  `;
  
  db.query(query, [recruiterId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve applications" });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: "No applications found for your jobs" });
    }
    
    return res.status(200).json(results);
  });
};
