const transporter = require("../../configs/mailer");

const sendVerificationEmail = async (to, token) => {
  const verificationLink = `${process.env.BASE_URL}/sahakka-api/v2/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `Sahakka <noreply@Sahakka.com>`,
    to,
    subject: "Confirm your email address",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm your email</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #eef1f5; }

    @media screen and (max-width: 600px) {
      .email-wrapper { padding: 24px 12px !important; }
      .email-card { width: 100% !important; border-radius: 14px !important; }
      .inner-content { padding: 32px 22px !important; }
      .cta-button { display: block !important; width: 100% !important; box-sizing: border-box; text-align: center !important; }
      .heading { font-size: 21px !important; }
      .logo-img { width: 44px !important; height: 44px !important; }
      .logo-text { font-size: 20px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#eef1f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <!-- Preheader (hidden preview text in inbox) -->
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
    Confirm your email to activate your Sahakka account.
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-wrapper" style="background-color:#eef1f5; padding:48px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="560" class="email-card" style="max-width:560px; width:100%; background-color:#ffffff; border:1px solid #e7ebf0; border-radius:18px; box-shadow:0 8px 24px rgba(15,23,42,0.05);">
          <tr>
            <td class="inner-content" style="padding:44px 48px;">

              <!-- Logo: icon + wordmark -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="middle" style="padding-right:10px;">
                          <img src="${process.env.BASE_URL}/uploads/images/image.png" alt="Sahakka" width="44" height="44" class="logo-img" style="display:block; width:44px; height:44px; border-radius:12px;">
                        </td>
                        <td valign="middle">
                          <span class="logo-text" style="font-size:24px; font-weight:700; color:#0f172a; letter-spacing:-0.3px;">Sahakka</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Heading -->
              <h1 class="heading" style="margin:0 0 8px 0; font-size:23px; line-height:1.3; font-weight:700; color:#0f172a; text-align:center; letter-spacing:-0.3px;">
                Confirm your email address
              </h1>
              <p style="margin:0 0 32px 0; font-size:14px; color:#64748b; text-align:center;">
                You're one click away from activating your Sahakka account.
              </p>

              <!-- Body copy -->
              <p style="margin:0 0 28px 0; font-size:15px; color:#334155; line-height:1.65;">
                Hi there,<br><br>
                Thanks for signing up for Sahakka. To finish setting up your account, please confirm that this is your email address by clicking the button below.
              </p>

              <!-- CTA -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <a href="${verificationLink}" target="_blank" class="cta-button"
                      style="display:inline-block; padding:15px 36px; font-size:15px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:10px; background-color:#171717;">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry notice -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8fafc; border-radius:10px; margin-bottom:28px;">
                <tr>
                  <td style="padding:14px 18px; font-size:13px; color:#64748b; text-align:center; line-height:1.5;">
                    This link <strong style="color:#0f172a;">expires in 1 hour</strong>. If you didn't create a Sahakka account, you can safely ignore this email.
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid #f1f5f9; margin-bottom:22px;"><tr><td>&nbsp;</td></tr></table>

              <!-- Fallback link -->
              <p style="margin:0 0 6px 0; font-size:12px; color:#94a3b8; text-align:center;">
                Button not working? Paste this link into your browser:
              </p>
              <p style="margin:0; font-size:12px; text-align:center; line-height:1.6; word-break:break-all;">
                <a href="${verificationLink}" style="color:#4f46e5; text-decoration:none; font-family:monospace;">${verificationLink}</a>
              </p>

            </td>
          </tr>
        </table>
        <!-- /Card -->

        <!-- Footer -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="560" style="max-width:560px; width:100%; margin-top:24px;">
          <tr>
            <td align="center" style="font-size:12px; color:#94a3b8; line-height:1.6;">
              Sent by Sahakka &bull; &copy; ${new Date().getFullYear()} Sahakka Inc. All rights reserved.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
    `,
  });
};

const sendResetPasswordOTP = async (to, otp) => {
  await transporter.sendMail({
    from: `Sahakka Dev <noreply@Sahakka.com>`,
    to,
    subject: "Password Reset OTP",

    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset OTP</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #eef1f5; }

    @media screen and (max-width: 600px) {
      .email-wrapper { padding: 24px 12px !important; }
      .email-card { width: 100% !important; border-radius: 14px !important; }
      .inner-content { padding: 32px 22px !important; }
      .heading { font-size: 21px !important; }
      .logo-img { width: 44px !important; height: 44px !important; }
      .logo-text { font-size: 20px !important; }
      .otp-text { font-size: 26px !important; letter-spacing: 6px !important; padding: 12px 16px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#eef1f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
    Your Sahakka password reset OTP is inside. Expires in 3 minutes.
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-wrapper" style="background-color:#eef1f5; padding:48px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="560" class="email-card" style="max-width:560px; width:100%; background-color:#ffffff; border:1px solid #e7ebf0; border-radius:18px; box-shadow:0 8px 24px rgba(15,23,42,0.05);">
          <tr>
            <td class="inner-content" style="padding:44px 48px;">

              <!-- Logo: icon + wordmark -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="middle" style="padding-right:10px;">
                          <img src="${process.env.BASE_URL}/uploads/images/image.png" alt="Sahakka" width="44" height="44" class="logo-img" style="display:block; width:44px; height:44px; border-radius:12px;">
                        </td>
                        <td valign="middle">
                          <span class="logo-text" style="font-size:24px; font-weight:700; color:#0f172a; letter-spacing:-0.3px;">Sahakka</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Heading -->
              <h1 class="heading" style="margin:0 0 8px 0; font-size:23px; line-height:1.3; font-weight:700; color:#0f172a; text-align:center; letter-spacing:-0.3px;">
                Password reset code
              </h1>
              <p style="margin:0 0 32px 0; font-size:14px; color:#64748b; text-align:center;">
                Use the code below to reset your Sahakka password.
              </p>

              <p style="margin:0 0 24px 0; font-size:15px; color:#334155; line-height:1.65;">
                Hello,<br><br>
                We received a request to reset your password. Enter the one-time code below to continue.
              </p>

              <!-- OTP box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <div class="otp-text" style="display:inline-block; font-size:32px; letter-spacing:10px; font-weight:700; background-color:#f3f4f6; padding:16px 28px; border-radius:10px; color:#0f172a; font-family: monospace;">
                      ${otp}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Expiry warning -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#fef2f2; border-radius:10px; margin-bottom:28px;">
                <tr>
                  <td style="padding:14px 18px; font-size:13px; color:#991b1b; text-align:center; line-height:1.5;">
                    This code <strong>expires in 3 minutes</strong>. If you didn't request this, you can safely ignore this email.
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid #f1f5f9; margin-bottom:22px;"><tr><td>&nbsp;</td></tr></table>

              <p style="margin:0; font-size:12px; color:#94a3b8; text-align:center; line-height:1.5;">
                For your security, never share this code with anyone, including Sahakka staff.
              </p>

            </td>
          </tr>
        </table>
        <!-- /Card -->

        <!-- Footer -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="560" style="max-width:560px; width:100%; margin-top:24px;">
          <tr>
            <td align="center" style="font-size:12px; color:#94a3b8; line-height:1.6;">
              Sent by Sahakka &bull; &copy; ${new Date().getFullYear()} Sahakka Dev Inc. All rights reserved.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

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
  workspaceId,
  teamId,
) => {
  const taskLink = `${process.env.FRONTEND_URL}/workspace/${workspaceId}/team/${teamId}/tasks`;

  await transporter.sendMail({
    from: `Sahakka Dev <noreply@myapp.com>`,
    to,

    subject: `${assignerName} assigned the task to you : ${taskTitle}`,

    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Task Assigned</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #eef1f5; }

    @media screen and (max-width: 600px) {
      .email-wrapper { padding: 24px 12px !important; }
      .email-card { width: 100% !important; border-radius: 14px !important; }
      .inner-content { padding: 32px 22px !important; }
      .cta-button { display: block !important; width: 100% !important; box-sizing: border-box; text-align: center !important; }
      .heading { font-size: 20px !important; }
      .logo-img { width: 44px !important; height: 44px !important; }
      .logo-text { font-size: 20px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#eef1f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
    ${assignerName} assigned you a new task on Sahakka.
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-wrapper" style="background-color:#eef1f5; padding:48px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="560" class="email-card" style="max-width:560px; width:100%; background-color:#ffffff; border:1px solid #e7ebf0; border-radius:18px; box-shadow:0 8px 24px rgba(15,23,42,0.05);">
          <tr>
            <td class="inner-content" style="padding:44px 48px;">

              <!-- Logo: icon + wordmark -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="middle" style="padding-right:10px;">
                          <img src="${process.env.BASE_URL}/uploads/images/image.png" alt="Sahakka" width="44" height="44" class="logo-img" style="display:block; width:44px; height:44px; border-radius:12px;">
                        </td>
                        <td valign="middle">
                          <span class="logo-text" style="font-size:24px; font-weight:700; color:#0f172a; letter-spacing:-0.3px;">Sahakka</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Heading -->
              <h1 class="heading" style="margin:0 0 20px 0; font-size:22px; line-height:1.3; font-weight:700; color:#0f172a; text-align:center; letter-spacing:-0.3px;">
                ${taskTitle}
              </h1>

              <!-- Workspace / Team info box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8fafc; border-radius:10px; margin-bottom:28px;">
                <tr>
                  <td style="padding:14px 18px; font-size:13px; color:#475569; line-height:1.7;">
                    <strong style="color:#0f172a;">Workspace:</strong> ${workspaceName}<br>
                    <strong style="color:#0f172a;">Team:</strong> ${teamName}
                  </td>
                </tr>
              </table>

              <!-- Assigner row: img + text vertically centered via table -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:30px;">
                <tr>
                  <td align="center">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="middle" style="padding-right:10px;">
                          <img src="${assignerAvatar}" width="40" height="40" style="display:block; border-radius:50%;">
                        </td>
                        <td valign="middle" style="font-size:14px; color:#334155;">
                          <strong style="color:#0f172a;">${assignerName}</strong> assigned a task to you
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${taskLink}" target="_blank" class="cta-button"
                      style="display:inline-block; padding:14px 34px; font-size:15px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:10px; background-color:#171717;">
                      View Task
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
        <!-- /Card -->

        <!-- Footer -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="560" style="max-width:560px; width:100%; margin-top:24px;">
          <tr>
            <td align="center" style="font-size:12px; color:#94a3b8; line-height:1.6;">
              Sent by Sahakka &bull; &copy; ${new Date().getFullYear()} Sahakka Inc. All rights reserved.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
    `,
  });
};

const sendInviteByEmail = async (
  to,
  workspaceName,
  teamName,
  inviterName,
  inviterAvatar,
  token,
) => {
  const inviteLink = `${process.env.BASE_URL}/sahakka-api/v2/invite/accept?token=${token}`;

  await transporter.sendMail({
    from: `Sahakka Dev <noreply@myapp.com>`,
    to,

    subject: `${inviterName} invited you to join team ${teamName}`,

    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Team Invitation</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #eef1f5; }

    @media screen and (max-width: 600px) {
      .email-wrapper { padding: 24px 12px !important; }
      .email-card { width: 100% !important; border-radius: 14px !important; }
      .inner-content { padding: 32px 22px !important; }
      .cta-button { display: block !important; width: 100% !important; box-sizing: border-box; text-align: center !important; }
      .heading { font-size: 20px !important; }
      .logo-img { width: 44px !important; height: 44px !important; }
      .logo-text { font-size: 20px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#eef1f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
    ${inviterName} invited you to join team ${teamName} on Sahakka.
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-wrapper" style="background-color:#eef1f5; padding:48px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="560" class="email-card" style="max-width:560px; width:100%; background-color:#ffffff; border:1px solid #e7ebf0; border-radius:18px; box-shadow:0 8px 24px rgba(15,23,42,0.05);">
          <tr>
            <td class="inner-content" style="padding:44px 48px;">

              <!-- Logo: icon + wordmark -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="middle" style="padding-right:10px;">
                          <img src="${process.env.BASE_URL}/uploads/images/image.png" alt="Sahakka" width="44" height="44" class="logo-img" style="display:block; width:44px; height:44px; border-radius:12px;">
                        </td>
                        <td valign="middle">
                          <span class="logo-text" style="font-size:24px; font-weight:700; color:#0f172a; letter-spacing:-0.3px;">Sahakka</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Heading -->
              <h1 class="heading" style="margin:0 0 8px 0; font-size:22px; line-height:1.3; font-weight:700; color:#0f172a; text-align:center; letter-spacing:-0.3px;">
                You've been invited
              </h1>
              <p style="margin:0 0 28px 0; font-size:14px; color:#64748b; text-align:center;">
                Join a team and start collaborating on Sahakka.
              </p>

              <!-- Inviter row -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="middle" style="padding-right:10px;">
                          <img src="${inviterAvatar}" width="45" height="45" style="display:block; border-radius:50%;">
                        </td>
                        <td valign="middle" style="font-size:14px; color:#334155;">
                          <strong style="color:#0f172a;">${inviterName}</strong> invited you to join a team
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Workspace / Team info box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8fafc; border-radius:10px; margin-bottom:28px;">
                <tr>
                  <td style="padding:14px 18px; font-size:13px; color:#475569; line-height:1.7;">
                    <strong style="color:#0f172a;">Workspace:</strong> ${workspaceName}<br>
                    <strong style="color:#0f172a;">Team:</strong> ${teamName}
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:14px;">
                <tr>
                  <td align="center">
                    <a href="${inviteLink}" target="_blank" class="cta-button"
                      style="display:inline-block; padding:14px 34px; font-size:15px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:10px; background-color:#171717;">
                      Accept Invite
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 28px 0; font-size:12px; color:#94a3b8; text-align:center;">
                This invite will expire in 24 hours.
              </p>

              <!-- Divider -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid #f1f5f9; margin-bottom:22px;"><tr><td>&nbsp;</td></tr></table>

              <!-- Fallback token -->
              <p style="margin:0 0 6px 0; font-size:12px; color:#94a3b8; text-align:center;">
                If the button doesn't work, use this token:
              </p>
              <p style="margin:0; font-size:12px; text-align:center; line-height:1.6; word-break:break-all;">
                <span style="color:#4f46e5; font-family:monospace;">${token}</span>
              </p>

            </td>
          </tr>
        </table>
        <!-- /Card -->

        <!-- Footer -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="560" style="max-width:560px; width:100%; margin-top:24px;">
          <tr>
            <td align="center" style="font-size:12px; color:#94a3b8; line-height:1.6;">
              Sent by Sahakka &bull; &copy; ${new Date().getFullYear()} Sahakka Inc. All rights reserved.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
    `,
  });
};

const sendSubmissionReviewEmail = async (
  to,
  workspaceName,
  teamName,
  taskTitle,
  reviewerName,
  reviewerAvatar,
  status,
  feedback,
  workspaceId,
  teamId,
) => {
  const isApproved = status === "approved";
  const taskLink = `${process.env.FRONTEND_URL}/workspace/${workspaceId}/team/${teamId}/tasks`;

  await transporter.sendMail({
    from: `Sahakka Dev <noreply@myapp.com>`,
    to,
    subject: `${reviewerName} ${isApproved ? "approved" : "rejected"} your submission`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Submission ${isApproved ? "Approved" : "Rejected"}</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #eef1f5; }

    @media screen and (max-width: 600px) {
      .email-wrapper { padding: 24px 12px !important; }
      .email-card { width: 100% !important; border-radius: 14px !important; }
      .inner-content { padding: 32px 22px !important; }
      .cta-button { display: block !important; width: 100% !important; box-sizing: border-box; text-align: center !important; }
      .heading { font-size: 20px !important; }
      .logo-img { width: 44px !important; height: 44px !important; }
      .logo-text { font-size: 20px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#eef1f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
    ${reviewerName} ${isApproved ? "approved" : "rejected"} your submission on Sahakka.
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-wrapper" style="background-color:#eef1f5; padding:48px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="560" class="email-card" style="max-width:560px; width:100%; background-color:#ffffff; border:1px solid #e7ebf0; border-radius:18px; box-shadow:0 8px 24px rgba(15,23,42,0.05);">
          <tr>
            <td class="inner-content" style="padding:44px 48px;">

              <!-- Logo: icon + wordmark -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="middle" style="padding-right:10px;">
                          <img src="${process.env.BASE_URL}/uploads/images/image.png" alt="Sahakka" width="44" height="44" class="logo-img" style="display:block; width:44px; height:44px; border-radius:12px;">
                        </td>
                        <td valign="middle">
                          <span class="logo-text" style="font-size:24px; font-weight:700; color:#0f172a; letter-spacing:-0.3px;">Sahakka</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Status badge -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:16px;">
                <tr>
                  <td align="center">
                    <span style="display:inline-block; background-color:${isApproved ? "#dcfce7" : "#fee2e2"}; color:${isApproved ? "#16a34a" : "#dc2626"}; font-size:12px; font-weight:700; padding:6px 14px; border-radius:20px; letter-spacing:0.3px;">
                      ${isApproved ? "✓ APPROVED" : "✕ REJECTED"}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Heading -->
              <h1 class="heading" style="margin:0 0 20px 0; font-size:22px; line-height:1.3; font-weight:700; color:#0f172a; text-align:center; letter-spacing:-0.3px;">
                ${taskTitle}
              </h1>

              <!-- Workspace / Team info box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8fafc; border-radius:10px; margin-bottom:24px;">
                <tr>
                  <td style="padding:14px 18px; font-size:13px; color:#475569; line-height:1.7;">
                    <strong style="color:#0f172a;">Workspace:</strong> ${workspaceName}<br>
                    <strong style="color:#0f172a;">Team:</strong> ${teamName}
                  </td>
                </tr>
              </table>

              <!-- Reviewer row -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="middle" style="padding-right:10px;">
                          <img src="${reviewerAvatar}" width="40" height="40" style="display:block; border-radius:50%;">
                        </td>
                        <td valign="middle" style="font-size:14px; color:#334155;">
                          <strong style="color:#0f172a;">${reviewerName}</strong> ${isApproved ? "approved" : "rejected"} your submission
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Feedback box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8fafc; border-radius:10px; margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0 0 6px 0; font-size:12px; font-weight:700; color:#0f172a; text-transform:uppercase; letter-spacing:0.4px;">Feedback</p>
                    <p style="margin:0; font-size:14px; color:#475569; line-height:1.6;">${feedback || "No feedback provided"}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${taskLink}" target="_blank" class="cta-button"
                      style="display:inline-block; padding:14px 34px; font-size:15px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:10px; background-color:#171717;">
                      View Task
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
        <!-- /Card -->

        <!-- Footer -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="560" style="max-width:560px; width:100%; margin-top:24px;">
          <tr>
            <td align="center" style="font-size:12px; color:#94a3b8; line-height:1.6;">
              Sent by Sahakka &bull; &copy; ${new Date().getFullYear()} Sahakka Inc. All rights reserved.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
    `,
  });
};

const sendActivateAccountMail = async (user) => {
  await transporter.sendMail({
    from: `Sahakka Dev <noreply@myapp.com>`,
    to: user.email,
    subject: "Your Account Has Been Activated",
    html: `
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Activated</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #eef1f5; }

    @media screen and (max-width: 600px) {
      .email-wrapper { padding: 24px 12px !important; }
      .email-card { width: 100% !important; border-radius: 14px !important; }
      .inner-content { padding: 32px 22px !important; }
      .cta-button { display: block !important; width: 100% !important; box-sizing: border-box; text-align: center !important; }
      .heading { font-size: 20px !important; }
      .logo-img { width: 44px !important; height: 44px !important; }
      .logo-text { font-size: 20px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#eef1f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <!-- Preheader -->
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
    Your Sahakka account is now active. You can log in and start working right away.
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-wrapper" style="background-color:#eef1f5; padding:48px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="560" class="email-card" style="max-width:560px; width:100%; background-color:#ffffff; border:1px solid #e7ebf0; border-radius:18px; box-shadow:0 8px 24px rgba(15,23,42,0.05);">
          <tr>
            <td class="inner-content" style="padding:44px 48px;">

              <!-- Logo -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="middle" style="padding-right:10px;">
                          <img src="${process.env.BASE_URL}/uploads/images/image.png" alt="Sahakka" width="44" height="44" class="logo-img" style="display:block; width:44px; height:44px; border-radius:12px;">
                        </td>
                        <td valign="middle">
                          <span class="logo-text" style="font-size:24px; font-weight:700; color:#0f172a; letter-spacing:-0.3px;">Sahakka</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Status badge -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:20px;">
                <tr>
                  <td align="center">
                    <span style="display:inline-block; background-color:#f0fdf4; color:#16a34a; font-size:12px; font-weight:600; letter-spacing:0.4px; text-transform:uppercase; padding:5px 14px; border-radius:999px; border:1px solid #bbf7d0;">
                      ✓ &nbsp;Account Activate
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Heading -->
              <h1 class="heading" style="margin:0 0 10px 0; font-size:22px; line-height:1.3; font-weight:700; color:#0f172a; text-align:center; letter-spacing:-0.3px;">
                You're all set, ${user.name}
              </h1>
              <p style="margin:0 0 32px 0; font-size:14px; color:#64748b; text-align:center; line-height:1.6;">
                Your account has been activated by the administrator.<br>You can now log in and start using Sahakka.
              </p>

              <!-- Info box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8fafc; border-radius:10px; margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-size:13px; color:#475569; line-height:1.8;">
                          <strong style="color:#0f172a;">Account:</strong> ${user.email}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size:13px; color:#475569; line-height:1.8;">
                          <strong style="color:#0f172a;">Activated by:</strong> Administrator
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:14px;">
                <tr>
                  <td align="center">
                    <a href="${process.env.FRONTEND_URL}/login" target="_blank" class="cta-button"
                      style="display:inline-block; padding:14px 34px; font-size:15px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:10px; background-color:#171717;">
                      Log In Now
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 28px 0; font-size:12px; color:#94a3b8; text-align:center;">
                If you didn't expect this, please contact your administrator.
              </p>

              <!-- Divider -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid #f1f5f9; margin-bottom:22px;"><tr><td>&nbsp;</td></tr></table>

              <!-- Sign-off -->
              <p style="margin:0; font-size:13px; color:#94a3b8; text-align:center; line-height:1.6;">
                Thanks for being part of the team.<br>
                <strong style="color:#64748b;">Sahakka Dev</strong>
              </p>

            </td>
          </tr>
        </table>
        <!-- /Card -->

        <!-- Footer -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="560" style="max-width:560px; width:100%; margin-top:24px;">
          <tr>
            <td align="center" style="font-size:12px; color:#94a3b8; line-height:1.6;">
              Sent by Sahakka &bull; &copy; ${new Date().getFullYear()} Sahakka Inc. All rights reserved.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
    `,
  });
};

const sendBlockedAccountMail = async (user) => {
  await transporter.sendMail({
    from: `Sahakka Dev <noreply@myapp.com>`,
    to: user.email,
    subject: "Your Account Has Been Blocked",
    html: `
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Blocked</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #eef1f5; }

    @media screen and (max-width: 600px) {
      .email-wrapper { padding: 24px 12px !important; }
      .email-card { width: 100% !important; border-radius: 14px !important; }
      .inner-content { padding: 32px 22px !important; }
      .heading { font-size: 20px !important; }
      .logo-img { width: 44px !important; height: 44px !important; }
      .logo-text { font-size: 20px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#eef1f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <!-- Preheader -->
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
    Your Sahakka account has been blocked by the administrator.
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-wrapper" style="background-color:#eef1f5; padding:48px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="560" class="email-card" style="max-width:560px; width:100%; background-color:#ffffff; border:1px solid #e7ebf0; border-radius:18px; box-shadow:0 8px 24px rgba(15,23,42,0.05);">
          <tr>
            <td class="inner-content" style="padding:44px 48px;">

              <!-- Logo -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="middle" style="padding-right:10px;">
                          <img src="${process.env.BASE_URL}/uploads/images/image.png" alt="Sahakka" width="44" height="44" class="logo-img" style="display:block; width:44px; height:44px; border-radius:12px;">
                        </td>
                        <td valign="middle">
                          <span class="logo-text" style="font-size:24px; font-weight:700; color:#0f172a; letter-spacing:-0.3px;">Sahakka</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Status badge -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:20px;">
                <tr>
                  <td align="center">
                    <span style="display:inline-block; background-color:#fff1f2; color:#dc2626; font-size:12px; font-weight:600; letter-spacing:0.4px; text-transform:uppercase; padding:5px 14px; border-radius:999px; border:1px solid #fecdd3;">
                      ✕ &nbsp;Account Blocked
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Heading -->
              <h1 class="heading" style="margin:0 0 10px 0; font-size:22px; line-height:1.3; font-weight:700; color:#0f172a; text-align:center; letter-spacing:-0.3px;">
                Your account has been blocked
              </h1>
              <p style="margin:0 0 32px 0; font-size:14px; color:#64748b; text-align:center; line-height:1.6;">
                Dear user ${user.name}, an administrator has restricted<br>access to your Sahakka account.
              </p>

              <!-- Info box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8fafc; border-radius:10px; margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-size:13px; color:#475569; line-height:1.8;">
                          <strong style="color:#0f172a;">Account:</strong> ${user.email}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size:13px; color:#475569; line-height:1.8;">
                          <strong style="color:#0f172a;">Blocked by:</strong> Administrator
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Notice box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;">
                <tr>
                  <td style="background-color:#fff1f2; border-radius:10px; border:1px solid #fecdd3; padding:16px 20px; font-size:13px; color:#9f1239; line-height:1.7;">
                    Access to your account has been temporarily disabled. If you believe this is a mistake, please reach out to your administrator or contact support.
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid #f1f5f9; margin-bottom:22px;"><tr><td>&nbsp;</td></tr></table>

              <!-- Sign-off -->
              <p style="margin:0; font-size:13px; color:#94a3b8; text-align:center; line-height:1.6;">
                If you need help, reply to this email.<br>
                <strong style="color:#64748b;">Sahakka Dev</strong>
              </p>

            </td>
          </tr>
        </table>
        <!-- /Card -->

        <!-- Footer -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="560" style="max-width:560px; width:100%; margin-top:24px;">
          <tr>
            <td align="center" style="font-size:12px; color:#94a3b8; line-height:1.6;">
              Sent by Sahakka &bull; &copy; ${new Date().getFullYear()} Sahakka Inc. All rights reserved.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
    `,
  });
};

module.exports = {
  sendVerificationEmail,
  sendResetPasswordOTP,
  sendTaskAssignByEmail,
  sendInviteByEmail,
  sendSubmissionReviewEmail,
  sendActivateAccountMail,
  sendBlockedAccountMail,
};
