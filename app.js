const express = require("express");
const mongoose = require("mongoose");

const app = express();
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
const { PORT = 3001 } = process.env;
app.use(express.json());
const routes = require("./routes/index");

app.use((req, res, next) => {
  req.user = {
    _id: "697ac1576409499ff9c34cd3", // step
  };
  next();
});

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports.createClothingItem = (req, res) => {
  console.log(req.user._id); // _id will become accessible
};
