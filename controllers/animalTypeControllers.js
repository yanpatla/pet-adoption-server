const TypeAnimal = require("../model/AnimalType");

exports.postType = async (req, res) => {
  if (req.user.role === false) {
    res
      .status(401)
      .json({ msg: "You do not have the permissions to enter this route" });
    return next();
  }

  const type = new TypeAnimal(req.body);
  try {
    await type.save();
    res.json(type);
  } catch (error) {
    console.log(error);
  }
};

exports.getType = async (req, res) => {
  try {
    const type = await TypeAnimal.find();
    res.json(type);
  } catch (error) {
    console.log(error);
  }
};
