const router = require("express").Router();
const userRouter = require("./users");
const clothingitem = require("./clothingItems");

router.use("/items", clothingitem);

router.use("/users", userRouter);

router.use((req, res) => {
  res.status(404).send({ message: "Route not found" });
});
module.exports = router;
