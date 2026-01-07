// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     description: { type: Array, required: true, },
//     price: { type: Number, required: true },
//     offerPrice: { type: Number, required: true },
//     image: { type: Array, required: true },
//     category: { type: Array, required: true },
//     inStock: { type: Boolean, default: true },
// }, { timestamps: true })


// const Product = mongoose.models.user || mongoose.model('product', productSchema)

// export default Product


import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: Array, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true }, // FIXED (see below)
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ✅ FIXED MODEL NAME
const Product =
  mongoose.models.product || mongoose.model("product", productSchema);

export default Product;
