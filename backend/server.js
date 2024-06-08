import path from 'path';
import { fileURLToPath } from 'url';
import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

connectDB();

const port = process.env.PORT || 5000;

const app = express();
const __dirname = path.resolve();

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// parse application/json
app.use(express.json());
// populate req.cookies so we have access to the JWT which is part of it
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);
app.use("/api/upload", uploadRoutes);

app.use('/api/uploads', express.static(path.join(path.resolve(), '/api/uploads')));

// production/ci version
if (["production", "ci"].includes(process.env.NODE_ENV)) {
  // set static folder
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  // any route that is not api will be redirected to index.html
  // if none of the above routes match, serve up the index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  })
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// define error-handling middleware last, after other app.use() and routes calls
// app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
