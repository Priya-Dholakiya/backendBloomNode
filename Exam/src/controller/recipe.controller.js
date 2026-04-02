const Recipe = require('../model/recip.model');
const { StatusCodes } = require("http-status-codes");
const fs = require("fs");
const path = require("path");


exports.addRecipe = async (req, res) => {
    try {
        let admin = req.user;

        if (!admin) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: ' Admin Not Found' });
        }

        let imagePath = "";
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        let newRecipe = await Recipe.create({
            ...req.body,
            recipeImage: imagePath,
            adminId: admin._id
        });

        return res.status(StatusCodes.CREATED).json({ message: 'Added Success', newRecipe });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
}

exports.getAllRecipe = async (req, res) => {
    try {
        let recipe = await Recipe.find().populate('createdBy');

        return res.status(StatusCodes.OK).json({ message: 'All Recipe', recipe })
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
}

exports.singleViewRecipe = async (req, res) => {
    try {
        let id = req.params.id;
        let recipe = await Recipe.findById(id);

        if (!recipe) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Recipe Not Found' })
        }

        return res.status(StatusCodes.OK).json({ message: 'Single Recipe ', recipe });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
}

exports.deleteRecipe = async (req, res) => {
    try {
        let recipe = await Recipe.findById(req.params.id);

        if (recipe.recipeImage != '') {
            let filepath = path.join(__dirname, '..', recipe.recipeImage);
            try {
                await fs.unlinkSync(filepath)
            } catch (error) {
                console.log('Recipe Not Found!');
            }
        }
        let recipeDelete = await Recipe.findByIdAndDelete(req.params.id);

        return res.status(StatusCodes.OK).json({ message: 'Delete Recipe', recipeDelete })
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
}

exports.updateRecipe = async (req, res) => {
    try {
        let recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Recipe Not Found ' })
        }

        let filepath = recipe.recipeImage;

        if (req.file) {
            if (recipe.recipeImage != '') {
                let oldpath = path.join(__dirname, '..', recipe.recipeImage);
                try {
                    await fs.unlinkSync(oldpath);
                } catch (error) {
                    console.log('old file is missing');
                }
            }
            filepath = `/uploads/${req.file.filename}`;
        }

        let recipeUpdate = await Recipe.findByIdAndUpdate(req.params.id, {
            ...req.body,
            recipeImage: filepath
        }, { new: true });

        return res.status(StatusCodes.OK).json({ message: 'Update Recipe', recipeUpdate })
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
}