// this file is only used to seed some initial data in our MongoDB for development purposes
import mongoose from 'mongoose';
import 'dotenv/config';
import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import connectDB from './config/db.js';

connectDB();

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        const createdUsers = await User.insertMany(users);
        const adminUserId = createdUsers[0]._id;
        const sampleProducts = products.map(product => {
            return { ...product, user: adminUserId }
        });
        await Product.insertMany(sampleProducts);

        console.info('Data imported');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.info('Data destroyed');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}