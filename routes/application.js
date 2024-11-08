import express from "express";
import { checkUserRole } from "../middleware/authentication.js"; // Assuming you have role-based auth middleware
import { getApplications} from "../controllers/application.js";

const router = express.Router();


router.get("/applications", checkUserRole("recruiter"), getApplications);

export default router;
