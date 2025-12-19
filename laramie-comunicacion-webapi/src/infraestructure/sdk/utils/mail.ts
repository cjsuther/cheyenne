import nodemailer from 'nodemailer'
import config from '../../../server/configuration/config'

export const sendMail = async ({ to, subject, html }: { to: string, subject: string, html: string }) => {
    let transport = nodemailer.createTransport({
        host: config.mail.HOST,
        port: config.mail.PORT,
        auth: {
            user: config.mail.USER,
            pass: config.mail.PASS,
        },
    })
    
    try {
        let info = await transport.sendMail({
            from: `"Laramie" <${config.mail.USER}>`,
            to,
            subject,
            html,
        })
        return {result: true, data: info.messageId}
    }
    catch (err) {
        return {result: false, data: err};
    }
}
