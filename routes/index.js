const router = require("express").Router();
const userRouter = require("./users");
const clothingitem = require("./clothingItems");

router.use("/Items", clothingitem);

router.use("/users", userRouter);

router.use((req, res) => {
  res.status(500).send({ message: "Route not found" });
});
module.exports = router;
