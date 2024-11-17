import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js"
//2qgEmT3JTqgFm58b
dotenv.config();
//dotenv to load env varaiable
const app = express();
const PORT=process.env.PORT||5000;
// app.get("/",(req,res)=>{
//     res.send("Welcome  tftfghfgf");
// });  for testing only

app.use(cors({origin:"http://localhost:5173",credentials:true}));
app.use(express.json());//allows us to parse incomng reqsts wid json payloads:req body
app.use(cookieParser());// ---- parse incmg cookies


app.use("/api/auth",authRoutes);


app.listen(PORT,()=>{
    connectDB();
    console.log("Server is running on PORT 3000",PORT);
});