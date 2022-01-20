const mongoose = require("mongoose");
require("dotenv").config({ path:"variables.env" });

const conectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB WORKS");
  } catch (error) {
    console.log(error);
    process.exit(1); //* Esto lo que hace es que en caso de que haya un error detenga la app
  }
};
module.exports = conectDB;
