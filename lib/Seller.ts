import mongoose from "mongoose";

const SellerSchema = new mongoose.Schema({

    name: String,
    contact: String,
    revenue: Number,
    products: Number,
    rating: Number,
    status: String

});

export default mongoose.models.Seller ||
    mongoose.model("Seller", SellerSchema);