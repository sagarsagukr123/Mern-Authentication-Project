import { response } from "express";
import { PASSWORD_RESET_REQUEST_TEMPLATE,PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";


export const sendVerificationEmail = async (email, verificationToken) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,// mailtrap.config.js  demo domain
			to: recipient,
			subject: "Verify your email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),// REPLACE VRFCTONTKN WID VRFCNCODE SEE IN HTML AND MESSAGE
			// send mail in html format using template fuction
			category: "Email Verification",
		});

		console.log("Email sent successfully", response);
	} catch (error) {
		console.error(`Error sending verification`, error);

		throw new Error(`Error sending verification email: ${error}`);
	}
};

export const sendWelcomeEmail= async (email,name)=>{
	const recipient = [{ email }];
	try {
		const response= await mailtrapClient.send({
			from: sender,
			to: recipient,
			template_uuid:"0b6502ee-2202-4ee9-91f7-86dec1d4e0ba",
			template_variables:{
				 company_info_name: "Auth Company",
      			 name: name
			},

});

console.log(" Welcome Email sent successfully",response);
} catch (error) {
	console.error(`Error sending welcome email`,error);
	throw new Error(`Error sending welcome email: ${error}`);
}};


export const sendPasswordResetEmail= async(email,resetURL)=>{
	const recipient = [{ email }];

	try {
		const response= await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Reset your password",
			html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
			category: "Password Reset",

		})
	} catch (error) {
		console.error(`Error sending password reset email`,error);
		throw new Error(`Error sending password reset email: ${error}`);
		
	}
}

export const sendResetSuccessEmail=async(email)=>{
	const recipient = [{ email }];
	try {
		const response= await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject:"password Reset Successful",
			html:PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "Password Reset",
			});
			console.log("Password reset email sent successfully",response);
			
			} catch (error) {
				console.error(`Error sending password reset success email`,error);
				throw new Error(`Error sending password reset success email: ${error}`);


}};