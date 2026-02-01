export const getVerificationEmail = (name: string, url: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .container { border: 1px solid #e1e4e8; border-radius: 8px; padding: 40px; background: #ffffff; }
    .header { text-align: center; margin-bottom: 30px; }
    .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff !important; text-decoration: none; border-radius: 5px; font-weight: bold; }
    .footer { margin-top: 30px; font-size: 12px; color: #6a737d; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Verify your email</h1>
    </div>
    <p>Hi ${name},</p>
    <p>Thanks for signing up! Please verify your email address by clicking the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${url}" class="button">Verify Email Address</a>
    </div>
    <p>If you did not create an account, you can safely ignore this email.</p>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Better Auth App. All rights reserved.
    </div>
  </div>
</body>
</html>
`

export const getMagicLinkEmail = (url: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .container { border: 1px solid #e1e4e8; border-radius: 8px; padding: 40px; background: #ffffff; }
    .header { text-align: center; margin-bottom: 30px; }
    .button { display: inline-block; padding: 12px 24px; background-color: #28a745; color: #ffffff !important; text-decoration: none; border-radius: 5px; font-weight: bold; }
    .footer { margin-top: 30px; font-size: 12px; color: #6a737d; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Sign in to your account</h1>
    </div>
    <p>Click the button below to sign in instantly. This link will expire shortly.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${url}" class="button">Sign In Now</a>
    </div>
    <p>If you didn't request this, you can safely ignore this email.</p>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Better Auth App. All rights reserved.
    </div>
  </div>
</body>
</html>
`

export const getResetPasswordEmail = (url: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .container { border: 1px solid #e1e4e8; border-radius: 8px; padding: 40px; background: #ffffff; }
    .header { text-align: center; margin-bottom: 30px; }
    .button { display: inline-block; padding: 12px 24px; background-color: #dc3545; color: #ffffff !important; text-decoration: none; border-radius: 5px; font-weight: bold; }
    .footer { margin-top: 30px; font-size: 12px; color: #6a737d; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Reset your password</h1>
    </div>
    <p>We received a request to reset your password. Click the button below to choose a new one:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${url}" class="button">Reset Password</a>
    </div>
    <p>If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Better Auth App. All rights reserved.
    </div>
  </div>
</body>
</html>
`
