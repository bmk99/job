import express from "express";
import { checkUserRole } from "../middleware/authentication.js";
import upload from "../middleware/multer.js"; // Import Multer middleware
import { applyForJob, createJob, getJobs, updateJob, deleteJob } from "../controllers/jobController.js";

const router = express.Router();

// Public route for retrieving job postings without authentication
router.get("/", getJobs);

// Route for applying to a job (requires authentication and Multer for file upload)
router.post("/:id/apply", upload.single("coverLetter"), applyForJob);

// Routes requiring both authentication and recruiter role for job management
router.post("/", checkUserRole, createJob);
router.put("/:id", checkUserRole, updateJob);
router.delete("/:id", checkUserRole, deleteJob);

export default router;
