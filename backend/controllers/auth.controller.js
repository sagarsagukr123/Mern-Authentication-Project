import bcryptjs from 'bcryptjs';
import crypto from "crypto";



import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail,sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";
import { User } from "../models/user.model.js";



export const signup =async (req,res)=>{
   const {email,password,name}=req.body;
   try {
    if(!email || !password || !name){
        throw new Error("All fields are required");

    }
    const userAlreadyExists=await User.findOne({email});
    console.log("userAlreadyExists",userAlreadyExists);
    
    if(userAlreadyExists) {
        return res.status(400).json({
            success:false,
            message:"User already exists"
        });
   }
const hashedPassword=await bcryptjs.hash(password,10);
const verificationToken= Math.floor(10000+Math.random() *900000).toString()
// 123456 => $12-34gy37t8  like this so password cant be seen by anyone crypted form
// hash password create and verify token and set cokie then user authntcted save() user to database
const user=new User({
    email,
    password:hashedPassword,
    name,
    verificationToken,
    verificationTokenExpireAt:Date.now() + 24 * 60 * 60 * 1000,});
await user.save();

//jwt  create token and send verification emailn  wid tokn
generateTokenAndSetCookie(res,user._id);

await sendVerificationEmail(user.email,verificationToken);//send verifitokn to mail

res.status(201).json({
    success:true,
    message:"User created successfully",
    user:{
        ...user._doc,
        password:undefined,
    }
})
}catch(error) {
    res.status(400).json({
        success:false,
        message:error.message
    });
    
   }
};


export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        // Check for verification code and its expiration
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpireAt: { $gt: Date.now() }
        });

        if (!user) {
            // Return a 400 status for invalid or expired token
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code"
            });
        }

        // Update user to verified
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpireAt = undefined;
        await user.save();

        // Send a welcome email
        await sendWelcomeEmail(user.email, user.name);

        // Return success response
        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        });
    } catch (error) {
        console.error("Error in verifyEmail:", error);
        // Return a 500 status for server errors
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


export const login =async (req,res)=>{
    const{email,password}=req.body;
    try {
        const user= await User.findOne({email}); // find email of user in databse
            
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid credentials"
        });
    }
    const isPasswordValid=await bcryptjs.compare(password,user.password);//password user pass and paasword in databse compare
    if (!isPasswordValid) {
        return res.status(400).json({
            success: false,
            message: "Invalid credentials"
        });}
    
    generateTokenAndSetCookie(res,user._id);

    user.lastLogin = new Date();//check lastlogin
    await user.save();

    res.status(200).json({
        success: true,
        message: "Logged in successfully",
        user: {
            ...user._doc,
            password: undefined,
            }
    })

 } catch (error) {
    console.error("Error in login:", error);
    res.status(400).json({
        success: false,
        message: error.message,
    })
        
    }
};

export const logout =async (req,res)=>{
   // res.send("logout route");
   res.clearCookie("token");// claear cookie name token so user unautenticated
   res.status(200).json({
    success:true,
    message:"logged out successfully"

   })
};

export const forgotPassword=async(req,res)=>{
    const {email}=req.body;
    try {
        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"});
            }
                const resetToken= crypto.randomBytes(20).toString("hex");
                const resetTokenExpiresAt= Date.now() + 1 * 60 * 60 *1000;//1 hour
                user.resetPasswordToken=resetToken;
                user.resetPasswordExpireAt=resetTokenExpiresAt;
                await user.save();

                //send email
                
                await sendPasswordResetEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`);//forgot page with token in urlpath
                res.status(200).json({
                    success:true,
                    message:"Password reset link sent to your email"

                })

        
    } catch (error) {
        console.log("Error in forgotPassword ",error);
        res.status(400).json({
            success:false,
            message:error.message
        })

        
        
    }
};


export const resetPassword=async(req,res)=>{
    const { token }=req.params;
    const {password}=req.body;
    try {
        const user = await User.findOne({
            resetPasswordToken:token,
            resetPasswordExpiresAt:
            { $gt: Date.now() },
        });
            if(!user){
                return res.status(400).json({
                    success:false,
                    message:"Invalid reset token or expired token"});
                    }

                    //update password
                    const hashedPassword= await bcryptjs.hash(password,10);
                    user.password=hashedPassword;
                    user.resetPasswordToken=undefined;
                    user.resetPasswordExpireAt=undefined;
                    await user.save();

                    await sendResetSuccessEmail(user.email);
                    res.status(200).json({
                        success:true,
                        message:"Password updated successfully"
                        });


                }catch(error){
                    console.log("Error in resetPassword ",error);
                    res.status(400).json({
                        success:false,
                        message:error.message
                        });
                        }

                    


                };

export const checkAuth= async(req,res)=>{
    try {
        const user = await User.findById(req.userId).select("-password");
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"

            });
            }
            res.status(200).json({
                success:true,
                user
            });
}catch(error){
    console.log("Error in checkAuth ",error);
    res.status(400).json({
        success:false,
        message:error.message

    });

}};