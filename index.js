const express = require("express");
const conectDB = require("./config/db");
const fileUpload = require("express-fileupload");
require("dotenv").config({ path: "variables.env" });
const Pet = require("./model/Pet");
const cors = require("cors");



 
//*Create Server
const app = express();

//*Conect to DB
conectDB();

const corsOptions = {
  origin:process.env.FRONT_END_URL
}

app.use(cors(corsOptions));
//*PORT
const port = process.env.PORT || 4800;
app.use(
  fileUpload({
    tempFileDir: "./uploads",
  })
);
app.use(express.json());
//*Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/pet", require("./routes/pet"));
app.use("/api/animalType", require("./routes/animalType"));

//*Listen
app.listen(port, "0.0.0.0", () => {
  console.log(`Server Listen on Port ${port}`);
});
