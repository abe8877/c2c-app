import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Google Workspace SMTP
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER, // info@insiders-hub.jp
        pass: process.env.SMTP_APP_PASSWORD, // Googleアカウントのアプリパスワード
    },
});

export const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
    return transporter.sendMail({
        from: `"INSIDERS. Team" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
    });
};
