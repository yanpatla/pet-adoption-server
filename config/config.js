require("dotenv").config({ path: "variables.env" });

module.exports = {
  BucketName: process.env.BUCKET_NAME || "",
  EndPoint: process.env.ENDPOINT || "",
};
