import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    }, 
    category: {
      type: mongoose.ObjectId,
      ref: "Category",
      required: true,
    },  
    photo: {
      type: String,  
      required: true, 
    } ,
    variations: [{
      size    : { type: String },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
  }],
  keywords:[ {
    type: String,
    required: true,
  }],
  },

 
  { timestamps: true }
);

export default mongoose.model("Products", productSchema);
