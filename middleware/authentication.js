import jwt from "jsonwebtoken";

export const checkUserToken = (req, res, next) => {
  if (req.cookies && req.cookies.accessToken) {
    const userToken = req.cookies.accessToken;
    console.log(userToken)

    jwt.verify(userToken, "secretkey", (err, decoded) => {
      if (err) {
        return res.status(401).json({
          error: "Unauthorized access. Token is invalid or expired.",
        });
      }

      req.userId = decoded.id; // Store the user ID from the token
      req.userRole = req.cookies.userRole; // Store the user role from the cookie

      next();
    });
  } else {
    return res.status(401).json({ error: "Unauthorized access. Token is missing." });
  }
};
export const checkUserRole = (requiredRole) => (req, res, next) => {
  console.log(req.userRole)
  if (req.userRole) {
    if (req.userRole === requiredRole) {
      return next();
    } else {
      return res.status(403).json({
        error: "Access denied. You do not have the required permissions.",
      });
    }
  } else {
    return res.status(401).json({ error: "Unauthorized access. Role is missing." });
  }
};
