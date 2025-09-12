import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function baseTemplate(title, body) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
    <div style="background: #e10600; color: #fff; padding: 16px; text-align: center;">
      <h2 style="margin: 0;">🏎️ F1 Forum</h2>
    </div>
    <div style="padding: 20px; background: #fafafa;">
      <h3 style="color: #333;">${title}</h3>
      ${body}
      <div style="margin-top: 20px; text-align: center;">
        <a href="https://github.com/xand1ex999" 
           style="background: #e10600; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">
          Go to Forum
        </a>
      </div>
    </div>
    <div style="background: #222; color: #bbb; font-size: 12px; padding: 12px; text-align: center;">
      <p style="margin: 4px 0;">This is an automated message. Please do not reply.</p>
      <p style="margin: 4px 0;">© ${new Date().getFullYear()} F1 Forum</p>
    </div>
  </div>
  `;
}

export async function sendLoginMail(user, req) {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const device = req.headers["user-agent"];

  const body = `
    <p>Hello <b>${user.username}</b>,</p>
    <p>You have successfully logged in to your account.</p>
    <p><b>IP:</b> ${ip}</p>
    <p><b>Device:</b> ${device}</p>
    <p>If this wasn’t you, please <a href="https://github.com/xand1ex999" style="color:#e10600;">reset your password</a> immediately.</p>
  `;

  await transporter.sendMail({
    from: '"F1 Forum" <no-reply@formulaone.com>',
    to: user.email,
    subject: "Login successful 🚀",
    html: baseTemplate("Login Successful", body),
  });
  console.log("email sent");
  
}

export async function sendRegisterMail(user, req) {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const device = req.headers["user-agent"];

  const body = `
    <p>Welcome <b>${user.username}</b>! 🎉</p>
    <p>Your account has been successfully created.</p>
    <p><b>Email:</b> ${user.email}</p>
    <p><b>IP:</b> ${ip}</p>
    <p><b>Device:</b> ${device}</p>
    <p>We’re excited to see you join the conversation. 🏁</p>
  `;

  await transporter.sendMail({
    from: '"F1 Forum" <no-reply@formulaone.com>',
    to: user.email,
    subject: "Welcome to F1 Forum 🎉",
    html: baseTemplate("Welcome to F1 Forum!", body),
  });
  console.log("email sent");
}
