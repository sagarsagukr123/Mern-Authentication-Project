import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js"
//2qgEmT3JTqgFm58b
dotenv.config();
//dotenv to load env varaiable
const app = express();
const PORT=process.env.PORT||5000;
const __dirname=path.resolve();
// app.get("/",(req,res)=>{
//     res.send("Welcome  tftfghfgf");
// });  for testing only

app.use(cors({origin:"http://localhost:5173",credentials:true}));
app.use(express.json());//allows us to parse incomng reqsts wid json payloads:req body
app.use(cookieParser());// ---- parse incmg cookies


app.use("/api/auth",authRoutes);
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"./frontend/dist")));
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"frontend","dist","index.html"));
    });
}

app.listen(PORT,()=>{
    connectDB();
    console.log("Server is running on PORT 3000",PORT);
});