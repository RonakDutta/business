const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.header("authorization") || "";

  if (header.startsWith("Bearer ")) {
    const token = header.replace("Bearer ", "");

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: payload.id, role: payload.role };
    } catch (err) {
      req.user = undefined;
    }
  }

  next();
};
