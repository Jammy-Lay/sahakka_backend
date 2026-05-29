const transporter = require("../../configs/mailer");

const sendVerificationEmail = async (to, token) => {
  const verificationLink = `${process.env.BASE_URL}/api/verify-email?token=${token}`;

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

const sendTaskAssignByEmail = async (
  to,
  workspaceName,
  teamName,
  taskTitle,
  assignerName,
  assignerAvatar,
) => {
  await transporter.sendMail({
    from: `My App <noreply@myapp.com>`,
    to,
    subject: `${assignerName} assigned the task to you : ${taskTitle}`,
    html: `
      <div style="background:#f5f5f5; padding:20px; font-family:Arial;">
        
        <div style="max-width:600px; margin:auto; background:#fff; padding:20px; border-radius:8px;">
          
          <p style="font-size:14px; color:#555;">
            You have a new notification on <strong>MyApp</strong>
          </p>

          <p style="font-size:13px; color:#777;">
            Workspace: <strong>${workspaceName}</strong><br/>
            Team: <strong>${teamName}</strong>
          </p>

          <h2 style="margin:16px 0; font-size:18px;">
            ${taskTitle}
          </h2>

          <div style="display:flex; align-items:center; margin-top:10px;">
            
            <img
              src="${assignerAvatar}"
              width="40"
              height="40"
              style="border-radius:50%; margin-right:10px;"
            />

            <span style="font-size:14px;">
              <strong>${assignerName}</strong> assigned a task to you
            </span>

          </div>

          <div style="margin-top:20px;">
            <a href="http://localhost:5173/tasks"
              style="background:#4F46E5; color:#fff; padding:10px 16px; text-decoration:none; border-radius:5px;">
              View Task
            </a>
          </div>

          <hr style="margin:20px 0; border:none; border-top:1px solid #eee;" />

          <p style="font-size:12px; color:#999;">
            This is an automated notification from MyApp.
          </p>

        </div>
      </div>
    `,
  });
};

const sendInviteByEmail = async (
  to,
  workspaceName,
  teamName,
  inviterName,
  token,
) => {
  const inviteLink = `${process.env.BASE_URL}/api/invite/accept?token=${token}`;

  await transporter.sendMail({
    from: `My App <noreply@myapp.com>`,
    to,
    subject: `${inviterName} invited you to join team ${workspaceName}`,
    html: `
      <div style="background:#f5f5f5; padding:20px; font-family:Arial;">
        
        <div style="max-width:600px; margin:auto; background:#fff; padding:24px; border-radius:10px;">
          
          <h2 style="margin-bottom:10px;">
            ${inviterName} invited you 
          </h2>

          <p style="color:#555; font-size:14px;">
            You have been invited to join a team.
          </p>

          <div style="margin:16px 0; font-size:14px; color:#333;">
            <p><strong>Workspace:</strong> ${workspaceName}</p>
            <p><strong>Team:</strong> ${teamName}</p>
          </div>

          <div style="margin:24px 0; text-align:center;">
            <a href="${inviteLink}"
              style="background:#4F46E5; color:#fff; padding:12px 20px; text-decoration:none; border-radius:6px; display:inline-block;">
              Accept Invite
            </a>
          </div>

          <p style="font-size:12px; color:#888;">
            This invite will expire in 24 hours.
          </p>

          <hr style="margin:20px 0; border:none; border-top:1px solid #eee;" />

          <p class="link-alt">If the button doesn't work, use this token: ${token}</p>

        </div>
      </div>
    `,
  });
};



const sendActivateAccountMail = async (user) => {
  await transporter.sendMail({
    from: `"Task Management System" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Your Account Has Been Activated",
    html: `
      <div style="
        max-width:600px;
        margin:auto;
        font-family:Arial,sans-serif;
        background:#f4f4f4;
        padding:30px;
      ">

        <div style="
          background:#ffffff;
          border-radius:10px;
          overflow:hidden;
          box-shadow:0 2px 10px rgba(0,0,0,0.1);
        ">

          <div style="
            background:#16a34a;
            padding:20px;
            text-align:center;
            color:white;
          ">
            <h1>Account Activated</h1>
          </div>

          <div style="padding:30px; color:#333;">
            <h2>Hello ${user.name},</h2>

            <p>
              Your account has been successfully activated by the administrator.
            </p>

            <p>
              You can now login and access the system.
            </p>

            <div style="margin:30px 0; text-align:center;">
              <a href="${process.env.BASE_URL}/api/login"
                style="
                  background:#16a34a;
                  color:white;
                  padding:12px 25px;
                  text-decoration:none;
                  border-radius:5px;
                  display:inline-block;
                ">
                Login Now
              </a>
            </div>

            <p>
              Thank you,<br>
              Task Management Team
            </p>
          </div>

        </div>
      </div>
    `,
  });
};

const sendBlockedAccountMail = async (user) => {
  await transporter.sendMail({
    from: `"Task Management System" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Your Account Has Been Blocked",
    html: `
      <div style="
        max-width:600px;
        margin:auto;
        font-family:Arial,sans-serif;
        background:#f4f4f4;
        padding:30px;
      ">

        <div style="
          background:#ffffff;
          border-radius:10px;
          overflow:hidden;
          box-shadow:0 2px 10px rgba(0,0,0,0.1);
        ">

          <div style="
            background:#dc2626;
            padding:20px;
            text-align:center;
            color:white;
          ">
            <h1>Account Blocked</h1>
          </div>

          <div style="padding:30px; color:#333;">
            <h2>Hello ${user.name},</h2>

            <p>
              Your account has been blocked by the administrator.
            </p>

            <p>
              If you believe this was a mistake, please contact support.
            </p>

            <div style="
              background:#fef2f2;
              padding:15px;
              border-left:5px solid #dc2626;
              margin-top:20px;
            ">
              Access to the system has been temporarily disabled.
            </div>

            <p style="margin-top:30px;">
              Thank you,<br>
              Task Management Team
            </p>
          </div>

        </div>
      </div>
    `,
  });
};


module.exports = {
  sendVerificationEmail,
  sendResetPasswordOTP,
  sendTaskAssignByEmail,
  sendInviteByEmail,
  sendActivateAccountMail,
  sendBlockedAccountMail
};
