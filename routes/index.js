const router = require("express").Router();
const userRouter = require("./users");
const clothingitem = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { NotFoundError } = require("../utils/errors");
const {
  validateLogin,
  validateUserBody,
} = require("../middlewares/validation");

router.post("/signin", validateLogin, login);
router.post("/signup", validateUserBody, createUser);

router.use("/items", clothingitem);

router.use("/users", auth, userRouter);

router.use(() => {
  throw new NotFoundError("Route not found");
});
module.exports = router;
