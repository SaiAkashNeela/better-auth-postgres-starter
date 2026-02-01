import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { magicLink } from 'better-auth/plugins'
import { DB } from '.'
//
import { BETTER_AUTH_URL, APP_URL, sendEmail } from '~/libs'
import { getVerificationEmail, getMagicLinkEmail, getResetPasswordEmail } from '~/emails'

export const auth = betterAuth({
  database: prismaAdapter(DB, {
    provider: 'postgresql',
  }),
  baseURL: BETTER_AUTH_URL,
  trustedOrigins: [APP_URL],
  user: {
    // modelName: 'user' (default)
    additionalFields: {
      phone: { type: 'string', nullable: true, returned: true },
      isAdmin: { type: 'boolean', default: false, returned: true, input: false },
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, newEmail, url, token }) => {
        await sendEmail({
          to: newEmail,
          subject: 'Verify your new email',
          text: `Click the link to verify your new email: ${url}`,
        })
      },
    },
  },
  session: {
    // modelName: 'session' (default)
    expiresIn: 60 * 60 * 24 * 7, // 1 week
    updateAge: 60 * 60 * 24, // 1 day
  },
  account: {
    // modelName: 'account' (default)
    accountLinking: {
      enabled: true,
      trustedProviders: ['github', 'google', 'email-password'],
      allowDifferentEmails: true, // Allow linking accounts with different emails if verified
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }) => {
      console.log(`[AuthConfig] Triggering sendResetPassword for ${user.email}`)
      await sendEmail({
        to: user.email,
        subject: 'Reset your password',
        text: `Reset your password: ${url}`,
        html: getResetPasswordEmail(url),
      })
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    callbackURL: APP_URL,
    sendVerificationEmail: async ({ user, url, token }) => {
      console.log(`[AuthConfig] Triggering sendVerificationEmail for ${user.email}`)
      await sendEmail({
        to: user.email,
        subject: 'Verify your email',
        text: `Verify your email: ${url}`,
        html: getVerificationEmail(user.name, url),
      })
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        console.log(`[AuthConfig] Triggering sendMagicLink for ${email}`)
        await sendEmail({
          to: email,
          subject: 'Sign in to your account',
          text: `Sign in: ${url}`,
          html: getMagicLinkEmail(url),
        })
      },
    }),
  ],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
})
