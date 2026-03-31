const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
cors();
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
const { PORT = 3001 } = process.env;
app.use(cors());
app.use(express.json());
const routes = require("./routes/index");

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
