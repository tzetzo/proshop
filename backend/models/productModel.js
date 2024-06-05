import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: { // the user who created the review
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // the user comes from the User collection
    },
    name: { // the name of the user who created the review
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
})

const productSchema = new mongoose.Schema({
    user: { // the user who created the product
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // the user comes from the User collection
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    reviews: [reviewSchema],
    rating: {
        type: Number,
        required: true,
        default: 0,
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0,
    },
}, {
    timestamps: true, // adds two properties of type Date to your schema - createdAt & updatedAt
});

const Product = mongoose.model('Product', productSchema);

export default Product;