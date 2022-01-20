const Pet = require("../model/Pet");
const User = require("../model/User");
const { validationResult } = require("express-validator");
const config = require("../config/config");
const querystring = require("querystring");
const AWS = require("aws-sdk");

const spacesEndPoint = new AWS.Endpoint(config.EndPoint);
const s3 = new AWS.S3({
  endpoint: spacesEndPoint,
});
exports.newPet = async (req, res, next) => {
  if (req.user.role === false) {
    res
      .status(401)
      .json({ msg: "You do not have the permissions to enter this route" });
    return next();
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { file } = req.files;

  try {
    await s3
      .putObject({
        ACL: "public-read",
        Bucket: config.BucketName,
        Body: file.data,
        Key: file.name,
      })
      .promise();

    const urlImage = `https://${config.BucketName}.${config.EndPoint}/${file.name}`;

    const pet = new Pet(req.body);
    pet.picture.url = urlImage;
    pet.picture.originalName = file.name;

    await pet.save();
    res.json(pet);
  } catch (error) {
    console.log(error);
  }
};

exports.getPetsById = async (req, res) => {
  try {
    const pets = await Pet.findById(req.params.id);

    res.json(pets);
  } catch (error) {
    res.status(500).json({ msg: "Sorry, there was a mistake" });
  }
};

exports.updatePetById = async (req, res) => {
  if (req.user.role === false) {
    res
      .status(401)
      .json({ msg: "You do not have the permissions to enter this route" });
    return next();
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { file } = req.files;

  const {
    name,
    animalType,
    adoptionStatus,
    height,
    weight,
    color,
    hypoallergenic,
    breed,
    bio,
    dietaryRestrictions,
  } = req.body;

  //   // updatePet.picture.originalName = file.name;

  await s3
    .putObject({
      ACL: "public-read",
      Bucket: config.BucketName,
      Body: file.data,
      Key: file.name,
    })
    .promise();

  const urlImage = `https://${config.BucketName}.${config.EndPoint}/${file.name}`;

  try {
    let pets = await Pet.findById(req.params.id);
    pets.name = name;
    pets.animalType = animalType;
    pets.adoptionStatus = adoptionStatus;
    pets.height = height;
    pets.weight = weight;
    pets.color = color;
    pets.hypoallergenic = hypoallergenic;
    pets.dietaryRestrictions = dietaryRestrictions;
    pets.breed = breed;
    pets.bio = bio;
    pets.picture.url = urlImage;
    pets.picture.originalName = file.name;

    if (!pets) {
      res.status(404).json({ msg: "Pet not Found" });
    }

    pets = await Pet.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: pets },
      { new: true }
    );

    res.json({ pets });
  } catch (error) {
    console.log(error);
    res.status(500).send("there was a mistake");
  }
};

exports.getPetsByCriteria = async (req, res, next) => {
  const { data } = req.query;

  const pets = await Pet.find().or([
    { animalType: data },
    { name: data },
    { adoptionStatus: data },
    { height: data },
  ]);
  if (pets.length === 0) {
    const returnPets = await Pet.find();
    res.json(returnPets);
    return next();
  }
  res.json(pets);
};

exports.adoptPet = async (req, res) => {
  let pets = await Pet.find({ _id: req.params.id });

  try {
    if (pets[0].adoptionStatus === "Adopted") {
      res.status(400).json({ msg: "This Pet Already Has Been Adopted" });
    } else {
      const updatePet = await Pet.findByIdAndUpdate(
        req.params.id,
        { adoptionStatus: "Adopted" },
        { new: true }
      );

      const updateUser = await User.findByIdAndUpdate(
        req.user.id,

        {
          $push: { adoptedPets: req.params.id },
        },
        { new: true }
      );

      return res.json({ updatePet, updateUser });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.returnPet = async (req, res) => {
  let pets = await Pet.find({ _id: req.params.id });

  if (pets[0].adoptionStatus === "Available") {
    res
      .status(400)
      .json({ msg: "You cannot return a pet that has not been adopted" });
  } else {
    const updatePet = await Pet.findByIdAndUpdate(
      req.params.id,
      { adoptionStatus: "Available" },
      { new: true }
    );

    const updateUser = await User.findByIdAndUpdate(
      req.user.id,

      {
        $pull: { adoptedPets: req.params.id },
      },
      { new: true }
    );

    return res.json({ updatePet, updateUser });
  }
};
//!MEJORAR VALIDACION ACA
exports.savePet = async (req, res) => {
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.user.id,

      {
        $push: { savedPets: { _id: req.params.id } },
      },
      { new: true }
    );
    return res.json({ msg: "The Pet Has Been Save it", updateUser });
  } catch (error) {
    console.log(error);
  }
};

//!Mejorara Validacion ACa
exports.deleteSave = async (req, res) => {
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.user.id,

      { $pull: { savedPets: { $in: [req.params.id] } } },

      { new: true }
    );

    return res.json({ updateUser });
  } catch (error) {
    console.log(error);
  }
};

exports.getPEtsByUserId = async (req, res) => {
  const usersPet = await User.findById(req.params.id, {
    adoptedPets: 1,
    _id: 0,
    savedPets: 1,
  });
  
  const petSave = await Pet.find({
    _id: { $in: usersPet.savedPets },
  });

  const petAdopted = await Pet.find({
    _id: { $in: usersPet.adoptedPets },
  });

  res.json({ petSave: petSave, petAdopted: petAdopted });
};
