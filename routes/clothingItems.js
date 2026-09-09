const router = require("express").Router();
const auth = require("../middlewares/auth");
const { validateCardBody, validateId } = require("../middlewares/validation");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);

router.use(auth);

router.post("/", validateCardBody, createItem);

router.delete("/:itemId", validateId("itemId"), deleteItem);

router.put("/:itemId/likes", validateId("itemId"), likeItem);

router.delete("/:itemId/likes", validateId("itemId"), dislikeItem);
module.exports = router;
