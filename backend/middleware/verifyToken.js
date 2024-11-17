import jwt from "jsonwebtoken";

export const verifyToken=(req,res,next)=>{//1st get endpoint /check-auth then verifytkn funct then next checkAuth funct
    const token=req.cookies.token
    if(!token)  return res.status(401).json({
        success:false,
        message:"Unauthorized  - no token provided"})
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET)// this we used vile crtng tokn

        if(!decoded)
            return res.status(401).json({
        success:false,
        message:"Unauthorized - invalid token"})
        req.userId=decoded.userId
        next();

        
    } catch (error) {
        console.log("Error in verifyToken",error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error - failed to verify token"
        })
        
        
    }
}