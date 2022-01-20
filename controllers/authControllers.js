const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
require("dotenv").config({ path: "variables.env" });

exports.authenticateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ msg: "The User Doesn't Exist" });
    return next();
  }

  if (bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.SECRET,
      {
        expiresIn: "8h",
      }
    );
    res.json({ token });
  } else {
    res.status(401).json({ msg: "Password is Wrong" });
    return next();
  }
};

exports.userAuht = async (req, res, next) => {
  res.json({ user: req.user });
};
