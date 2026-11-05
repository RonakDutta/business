const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.header("authorization") || "";

  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Sign in to continue." });
  }

  const token = header.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Your session has expired. Sign in again." });
  }
};
