import 'dotenv/config'
import axios from 'axios'
import nodemailer from 'nodemailer'
import { EMAILIT_API_KEY, EMAILIT_API_URL, FROM_EMAIL, FROM_NAME } from './constants'

const isDev = process.env.NODE_ENV === 'development'

// Configure Nodemailer for Maildev in development
// Using 127.0.0.1 to avoid potential localhost resolution issues
const devTransporter = nodemailer.createTransport({
  host: '127.0.0.1',
  port: 1025,
  secure: false,
})

export const sendEmail = async ({ to, subject, text, html }: { to: string, subject: string, text: string, html?: string }) => {
  const from = `${FROM_NAME} <${FROM_EMAIL}>`
  const nodeEnv = process.env.NODE_ENV

  console.log(`[MailService] Environment: ${nodeEnv}, isDev: ${isDev}`)

  if (isDev) {
    try {
      console.log(`[MailService] Sending email via Maildev (127.0.0.1:1025) to ${to}...`)
      const info = await devTransporter.sendMail({
        from,
        to,
        subject,
        text,
        html: html || text,
      })
      console.log(`✅ [MailService] Email sent to ${to} via Maildev (ID: ${info.messageId})`)
      return
    } catch (error) {
      console.error('❌ [MailService] Error sending email via Maildev:', error)
      return
    }
  }

  // Production via Emailit
  console.log(`[MailService] Sending email via Emailit to ${to}...`)
  const apiKey = EMAILIT_API_KEY
  const apiUrl = EMAILIT_API_URL

  if (!apiKey || !apiUrl || !from) {
    console.error('❌ [MailService] Mailit API key, URL, or From email not found')
    return
  }

  const emailData = {
    from,
    to: to,
    subject: subject,
    text: text,
    html: html || text,
  }

  try {
    const response = await axios.post(apiUrl, emailData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    })
    console.log('✅ [MailService] Email sent successfully via Emailit:', response.data)
  } catch (error: any) {
    console.error('❌ [MailService] Error sending email via Emailit:', error?.response?.data || error.message)
  }
}
