import mongoose from "mongoose"

const OrderSchema = new mongoose.Schema({

    customerName: String,
    products: Array,
    totalPrice: Number,
    status: {
        type: String,
        default: "Processing"
    }

})

export default mongoose.models.Order ||
    mongoose.model("Order", OrderSchema)