const Cart = require("../model/cart.model");
const Product = require("../model/product.model");

exports.addToCart = async (req, res) => {
    try {
        const { productId } = req.body;

        const product = await Product.findById(productId);

        let item = await Cart.findOne({
            productId,
            sessionId: req.sessionID
        });

        if (item) {
            item.quantity += 1;
            await item.save();
        } else {
            await Cart.create({
                productId,
                quantity: 1,
                price: product.Productprice,
                sessionId: req.sessionID
            });
        }

        res.json({ success: true });

    } catch (err) {
        console.log(err);
    }
};


exports.viewCart = async (req, res) => {

    const items = await Cart.find({
        sessionId: req.sessionID
    }).populate("productId");

    res.render("webpage/cart", { items });
};


exports.getCartData = async (req, res) => {

    const items = await Cart.find({
        sessionId: req.sessionID
    }).populate("productId");

    res.json(items);
};

exports.updateQty = async (req, res) => {

    const { cartId, change } = req.body;

    const item = await Cart.findById(cartId);

    item.quantity += change;

    if (item.quantity < 1) {
        item.quantity = 1;
    }

    await item.save();

    res.json({ success: true });
};

exports.deleteItem = async (req, res) => {

    const { cartId } = req.body;

    await Cart.findByIdAndDelete(cartId);

    res.json({ success: true });
};

