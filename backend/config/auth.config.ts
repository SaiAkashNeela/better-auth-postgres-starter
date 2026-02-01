import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { magicLink } from 'better-auth/plugins'
import { DB } from '.'
//
import { BETTER_AUTH_URL, APP_URL, sendEmail } from '~/libs'

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
    requireEmailVerification: true, // Enabled as requested
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url, token }) => {
        await sendEmail({
          to: user.email,
          subject: 'Verify your email',
          text: `Click the link to verify your email address: ${url}`,
        })
      },
    },
    sendResetPassword: async ({ user, url, token }) => {
      await sendEmail({
        to: user.email,
        subject: 'Reset your password',
        text: `Click the link to reset your password: ${url}. If you didn't request this, ignore this email.`,
      })
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendEmail({
          to: email,
          subject: 'Sign in to your account',
          text: `Click the link to sign in: ${url}`,
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
