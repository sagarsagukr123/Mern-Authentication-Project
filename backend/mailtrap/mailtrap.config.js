import { MailtrapClient } from 'mailtrap';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Access the Mailtrap token from environment variables
// {const TOKEN =  process.env.MAILTRAP_TOKEN,
// const ENDPOINT=process.env.MAILTRAP_ENDPOINT}

// {if (!TOKEN) {
//   console.error('MAILTRAP_TOKEN is not defined in .env file');
//   process.exit(1);
// }}

// Create an instance of the Mailtrap client
export const mailtrapClient = new MailtrapClient({ 
  endpoint:process.env.MAILTRAP_ENDPOINT,
  token: process.env.MAILTRAP_TOKEN });

// Define the sender and recipient
 export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Sagar",
};
// {const recipients = [
//   {
//     email: "sagarsagukr123@gmail.com",
//   }
// ];
//
// {// Send the email
// client.send({
//   from: sender,
//   to: recipients,
//   subject: "You are awesome!",
//   html: "Congrats for sending test email with Mailtrap!",
//   category: "Integration Test",
// })
//   .then(response => {
//     console.log('Email sent successfully:', response);
//   })
//   .catch(error => {
//     console.error('Error sending email:', error);
//   });}
