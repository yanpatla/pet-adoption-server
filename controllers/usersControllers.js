const User = require("../model/User");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
require("dotenv").config({ path: "variables.env" });
exports.newUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, validatePassword, phoneNumber } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ msg: "The User Already Exist" });
  }
  if (password !== validatePassword) {
    return res.status(400).json({ msg: "The Passwords Don't match" });
  }

  user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.validatePassword = await bcrypt.hash(validatePassword, salt);
  if (email === process.env.ADMIN) {
    user.role = await true;
  }

  try {
    await user.save();
    res.json({ msg: "The User Has Been Created" });
  } catch (err) {
    if (err) {
      if (err.keyPattern.phoneNumber && err.code === 11000) {
        return res
          .status(400)
          .json({ succes: false, msg: "The Phone Already Exist" });
      }
    }
    console.log(error);
  }
};

exports.updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const salt = await bcrypt.genSalt(10);
  const { password, email, name, phoneNumber, validatePassword, bio } =
    req.body;

  const userUpdated = {};
  if (password && validatePassword != undefined) {
    userUpdated.email = email;
    userUpdated.name = name;
    userUpdated.phoneNumber = phoneNumber;
    userUpdated.bio = bio;
    userUpdated.password = await bcrypt.hash(password, salt);
    userUpdated.validatePassword = await bcrypt.hash(validatePassword, salt);
  } else {
    userUpdated.email = email;
    userUpdated.name = name;
    userUpdated.phoneNumber = phoneNumber;
    userUpdated.bio = bio;
  }

  if (password !== validatePassword) {
    return res.status(400).json({ msg: "The Passwords Don't match" });
  }
  try {
    const updateUser = await User.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: userUpdated },
      { new: true }
    );

    res.json(updateUser);
  } catch (error) {
    console.log(error);
  }
};

exports.getUser = async (req, res) => {
  if (req.user.role === false) {
    res
      .status(401)
      .json({ msg: "You do not have the permissions to enter this route" });
    return next();
  }
  const getUser = await User.find({});

  res.json({ user: getUser });
};

exports.getUserbyId = async (req, res) => {
  const getUser = await User.find({ _id: req.params.id });

  res.json(getUser);
};
