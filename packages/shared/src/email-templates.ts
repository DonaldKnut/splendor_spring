export type EmailTemplate = {
  subject: string;
  html: string;
  text: string;
};

function shell(brand: string, title: string, bodyHtml: string) {
  return `<!doctype html>
<html>
<body style="margin:0;background:#0f1712;font-family:Georgia,serif;color:#f7f3ea;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(160deg,#142019,#1f3b28);padding:32px 12px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.14);border-radius:20px;padding:28px;backdrop-filter:blur(12px);">
        <tr><td style="font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#c8dccb;">${brand}</td></tr>
        <tr><td style="padding-top:14px;font-size:28px;line-height:1.25;color:#fff;">${title}</td></tr>
        <tr><td style="padding-top:16px;font-size:15px;line-height:1.7;color:#e7efe8;font-family:Arial,sans-serif;">${bodyHtml}</td></tr>
        <tr><td style="padding-top:28px;font-size:12px;color:#9bb3a0;font-family:Arial,sans-serif;">If you did not request this, you can ignore this email.</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function otpEmailTemplate(input: {
  brand: string;
  name: string;
  code: string;
  purposeLabel: string;
  expiresMinutes: number;
}): EmailTemplate {
  const subject = `${input.code} is your ${input.brand} verification code`;
  const html = shell(
    input.brand,
    input.purposeLabel,
    `<p>Hi ${input.name},</p>
     <p>Your one-time code is:</p>
     <p style="font-size:34px;letter-spacing:.28em;font-weight:700;color:#fff;margin:18px 0;">${input.code}</p>
     <p>This code expires in <strong>${input.expiresMinutes} minutes</strong>.</p>`
  );
  const text = `Hi ${input.name},\n\nYour ${input.brand} code is ${input.code}. It expires in ${input.expiresMinutes} minutes.\n`;
  return { subject, html, text };
}

export function passwordResetEmailTemplate(input: {
  brand: string;
  name: string;
  link: string;
}): EmailTemplate {
  const subject = `Reset your ${input.brand} password`;
  const html = shell(
    input.brand,
    "Password reset",
    `<p>Hi ${input.name},</p>
     <p>Use the secure link below to set a new password (valid for 1 hour):</p>
     <p style="margin:20px 0;"><a href="${input.link}" style="display:inline-block;background:#2f5d3a;color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;font-family:Arial,sans-serif;">Reset password</a></p>
     <p style="word-break:break-all;font-size:12px;color:#c8dccb;">${input.link}</p>`
  );
  const text = `Hi ${input.name},\n\nReset your password: ${input.link}\n`;
  return { subject, html, text };
}

export function welcomeVerifyEmailTemplate(input: {
  brand: string;
  name: string;
  code: string;
}): EmailTemplate {
  return otpEmailTemplate({
    brand: input.brand,
    name: input.name,
    code: input.code,
    purposeLabel: "Verify your email",
    expiresMinutes: 15,
  });
}

export function accountWelcomeEmailTemplate(input: {
  brand: string;
  name: string;
  roleLabel: string;
  email: string;
  temporaryPassword: string;
  loginUrl: string;
}): EmailTemplate {
  const subject = `Your ${input.brand} portal access`;
  const html = shell(
    input.brand,
    "Your account is ready",
    `<p>Hi ${input.name},</p>
     <p>An administrator created your <strong>${input.roleLabel}</strong> account for ${input.brand}.</p>
     <p style="margin:18px 0;padding:14px 16px;border-radius:12px;background:rgba(255,255,255,0.08);font-family:Arial,sans-serif;">
       <strong>Login email:</strong> ${input.email}<br/>
       <strong>Temporary password:</strong> <span style="letter-spacing:.06em;">${input.temporaryPassword}</span>
     </p>
     <p>Sign in here, then you will be asked to set a new password immediately:</p>
     <p style="margin:20px 0;"><a href="${input.loginUrl}" style="display:inline-block;background:#2f5d3a;color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;font-family:Arial,sans-serif;">Open portal login</a></p>
     <p style="word-break:break-all;font-size:12px;color:#c8dccb;">${input.loginUrl}</p>
     <p>Do not share this temporary password. It stops working after you change it.</p>`
  );
  const text = `Hi ${input.name},

Your ${input.roleLabel} account for ${input.brand} is ready.

Login email: ${input.email}
Temporary password: ${input.temporaryPassword}

Sign in at ${input.loginUrl} and change your password on first login.
`;
  return { subject, html, text };
}
