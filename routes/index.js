const router = require("express").Router();
const userRouter = require("./users");
const clothingitem = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const {
  validateLogin,
  validateUserBody,
} = require("../middlewares/validation");

router.post("/signin", validateLogin, login);
router.post("/signup", validateUserBody, createUser);

router.use("/items", clothingitem);

router.use("/users", auth, userRouter);

router.use((req, res) => {
  res.status(404).send({ message: "Route not found" });
});
module.exports = router;
