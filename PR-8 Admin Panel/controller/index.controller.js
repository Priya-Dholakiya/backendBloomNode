const Product = require("../model/product.model")

exports.webpage = async (req, res) => {
    try {
        let products = await Product.find();
        return res.render("webpage/index",{products});
    }
    catch (err) {
        console.log(err);
    }
}

exports.singleProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        return res.render("webpage/single-product", { product });
    }
    catch (err) {
        console.log(err);
    }
}



