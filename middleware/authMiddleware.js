const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });
module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    try {
      const user = jwt.verify(token, process.env.SECRET);
      req.user = user;
      return next();
    } catch (error) {
      res.status(401).json({msg:"You are not authenticated. Login to authenticate"})
    }
  }

};
