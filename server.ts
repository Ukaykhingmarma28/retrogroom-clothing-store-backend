import express from "express";
import {config} from "./src/config";
import connectDb from "./src/dbConnection";
import globalErrorHAndler from "./src/middlewares/globalErrorHandler";
import userRouter from "./services/user/userRouter";
import productRouter from "./services/product/productRouter";
import orderRouter from "./services/order/orderRouter";
import collectionRouter from "./services/collection/collectionRouter";
// import {isAdmin} from "./src/middlewares/isAdmin"



const app = express();
const Port = config.port || 4001;
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Adjust the origin to match your frontend URL
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true'); // Allow cookies to be sent with requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

//MongoDB connection
connectDb();

// Routes
app.use("/api/user", userRouter);

app.use("/api/product", productRouter);

app.use("/api/order", orderRouter);

app.use("/api/collection", collectionRouter);

//Global Error Handler
app.use(globalErrorHAndler)

// Start listening
app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});