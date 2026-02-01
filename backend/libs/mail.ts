import axios from 'axios'
import nodemailer from 'nodemailer'
import { EMAILIT_API_KEY, EMAILIT_API_URL, FROM_EMAIL, FROM_NAME } from '~/libs'

const isDev = process.env.NODE_ENV === 'development'

// Configure Nodemailer for Maildev in development
const devTransporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  secure: false, // Maildev doesn't use SSL by default
})

export const sendEmail = async ({ to, subject, text, html }: { to: string, subject: string, text: string, html?: string }) => {
  const from = `${FROM_NAME} <${FROM_EMAIL}>`

  if (isDev) {
    try {
      console.log('Sending email via Maildev...')
      await devTransporter.sendMail({
        from,
        to,
        subject,
        text,
        html: html || text,
      })
      console.log(`✅ Email sent to ${to} via Maildev`)
      return
    } catch (error) {
      console.error('❌ Error sending email via Maildev:', error)
      return
    }
  }

  // Production via Emailit
  const apiKey = EMAILIT_API_KEY
  const apiUrl = EMAILIT_API_URL

  if (!apiKey || !apiUrl || !from) {
    console.error('Mailit API key or URL not found')
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
    console.log('Email sent successfully via Emailit:', response.data)
  } catch (error) {
    console.error('Error sending email via Emailit:', error)
  }
}
