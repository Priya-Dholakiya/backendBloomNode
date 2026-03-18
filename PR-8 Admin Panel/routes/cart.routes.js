const express = require("express");
const router = express.Router();

const { addToCart, viewCart, getCartData, updateQty, deleteItem } = require("../controller/cart.controller");

router.post("/add-to-cart", addToCart);
router.get("/", viewCart);
router.get("/data", getCartData);
router.post("/update-qty", updateQty);
router.post("/delete", deleteItem);




module.exports = router;
