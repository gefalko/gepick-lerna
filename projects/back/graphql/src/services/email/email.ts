import generateEmailVerificationHtml from './verifyEmailHtml'
import generateResetPasswordHtml from './resetPasswordEmailHtml'

const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '',
    pass: '',
  },
})

interface ISendEmailVerificationEmailArgs {
  token: string
  to: string
}

export function sendEmailVerificationEmail(args: ISendEmailVerificationEmailArgs) {
  const mailOptions = {
    from: 'Gepick <no-replay@gepick.com>',
    to: args.to,
    sender: 'Gepick',
    subject: 'Email verification',
    html: generateEmailVerificationHtml(args.token),
  }

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err)
    else console.log(info)
  })
}

interface ISendResetPasswordEmailArgs {
  token: string
  email: string
}

export function sendResetPasswordEmail(args: ISendResetPasswordEmailArgs) {
  const mailOptions = {
    from: 'Gepick <no-replay@gepick.com>',
    to: args.email,
    sender: 'Gepick',
    subject: 'Password reset',
    html: generateResetPasswordHtml(args.token),
  }

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err)
    else console.log(info)
  })
}
