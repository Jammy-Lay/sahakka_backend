const transporter = require("../../configs/mailer");

const sendVerificationEmail = async (to, token) => {
  const verificationLink = `http://localhost:3000/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `My App <noreply@myapp.com>`, // Professional "From" header
    to,
    subject: "Confirm your email address",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #e1e1e1;
          border-radius: 10px;
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .button {
          background-color: #4F46E5;
          color: white !important;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          display: inline-block;
        }
        .footer {
          font-size: 12px;
          color: #888;
          text-align: center;
          margin-top: 30px;
        }
        .link-alt {
          word-break: break-all;
          font-size: 11px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Welcome to MyApp!</h2>
        </div>
        <p>Hi there,</p>
        <p>Thanks for signing up! Please confirm your email address to activate your account and get started.</p>
        
        <div class="button-container">
          <a href="${verificationLink}" class="button">Verify Email Address</a>
        </div>
        
        <p>This link will <strong>expire in 1 hour</strong>. If you did not create an account, no further action is required.</p>
        
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} MyApp Inc. All rights reserved.</p>
          <p class="link-alt">If the button doesn't work, copy and paste this link into your browser:<br>
          ${verificationLink}</p>
        </div>
      </div>
    </body>
    </html>
    `,
  });
};

const sendResetPasswordOTP = async (to, otp) => {
  await transporter.sendMail({
    from: `My App <noreply@myapp.com>`,
    to,
    subject: "Password Reset OTP",

    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 20px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          color: #333;
        }

        .header {
          text-align: center;
          margin-bottom: 20px;
        }

        .otp-box {
          text-align: center;
          margin: 30px 0;
        }

        .otp {
          display: inline-block;
          font-size: 32px;
          letter-spacing: 10px;
          font-weight: bold;
          background: #f3f4f6;
          padding: 15px 25px;
          border-radius: 8px;
          color: #111827;
        }

        .warning {
          background: #fef2f2;
          color: #991b1b;
          padding: 12px;
          border-radius: 6px;
          margin-top: 20px;
        }

        .footer {
          text-align: center;
          font-size: 12px;
          color: #888;
          margin-top: 30px;
        }
      </style>
    </head>

    <body>
      <div class="container">

        <div class="header">
          <h2>Password Reset OTP</h2>
        </div>

        <p>Hello,</p>

        <p>
          Use the OTP below to reset your password.
        </p>

        <div class="otp-box">
          <div class="otp">
            ${otp}
          </div>
        </div>

        <div class="warning">
          This OTP will expire in
          <strong>1 minute</strong>.
        </div>

        <p>
          If you did not request this,
          please ignore this email.
        </p>

        <div class="footer">
          <p>
            &copy; ${new Date().getFullYear()}
            MyApp Inc. All rights reserved.
          </p>
        </div>

      </div>
    </body>
    </html>
    `,
  });
};
module.exports = { sendVerificationEmail, sendResetPasswordOTP };
