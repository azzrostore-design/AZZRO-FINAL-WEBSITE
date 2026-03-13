import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({

    name: String,
    price: Number,
    gender: String,
    category: String,
    subcategory: String,
    images: [String],
    stock: Number,
    brand: String,
    discount: Number

});

export default mongoose.models.Product ||
    mongoose.model("Product", ProductSchema);