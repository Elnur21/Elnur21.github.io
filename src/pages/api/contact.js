import { emailConfiguration } from "@/libs/helpers";
import nodemailer from "nodemailer";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ msg: "Only POST requests are allowed" });
  }
  try {
    const { name, email, subject, message } = JSON.parse(req.body);
    const transporter = nodemailer.createTransport(emailConfiguration);
    let mailOptions = {
      from: process.env.NEXT_PUBLIC_SENDER_MAIL,
      to: "elnur2370@gmail.com",
      subject: "New contact received from protfolio",
      html: `
                <p>
                  Email: <a href="mailto:${email}">${email}</a>.  <br/>
                  Name: ${name}  <br/> <br/>
                  Subject: ${subject} <br/> <br/>
                  Message: ${message} <br/> <br/>
                </p>
              `,
    };
    await transporter.sendMail(mailOptions);
    res.status(201).json({ msg: "Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Failed" });
  }
};
