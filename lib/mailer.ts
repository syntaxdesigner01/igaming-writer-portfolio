import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendContactNotification({
  fullName,
  email,
  phone,
  message,
}: {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}) {
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER,
    replyTo: email,
    subject: `New brief from ${fullName}`,
    text: `Name: ${fullName}\nEmail: ${email}\nPhone: ${phone || "-"}\n\n${message}`,
  });
}
