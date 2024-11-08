import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../connect.js";

export const register = (req, res) => {
  const { name, email, password, role } = req.body;
  console.log(req.body)

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (role !== "user" && role !== "recruiter") {
    return res.status(400).json({ error: "Role must be 'user' or 'recruiter'" });
  }

  const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmailQuery, [email], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (data.length > 0) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const insertQuery =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    const values = [name, email, hashedPassword, role];

    db.query(insertQuery, values, (insertErr, result) => {
      if (insertErr) {
        return res.status(500).json({ error: "User registration failed" });
      }

      return res.status(200).json({
        message: "User registered successfully",
        userId: result.insertId,
      });
    });
  });
};


export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE email = ?";
  return db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("Email not found!");
    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    if (!checkPassword)
      return res.status(400).json("Wrong password or username!");
    const userRole = data[0].role;
    const token = jwt.sign({ id: data[0].id }, "secretkey");
    const { password, ...others } = data[0];
    res.cookie("accessToken", token, { httpOnly: true });
    res.cookie("userRole", userRole, { httpOnly: true });
    return res.status(200).json(others);
  });
};

export const logout = (req, res) => {
  const cookiesToClear = ["accessToken", "userRole"];
  cookiesToClear.forEach((cookieName) => {
    res.clearCookie(cookieName, {
      secure: true,
      sameSite: "none",
    });
  });
  return res.status(200).json("User has been logged out.");
};
