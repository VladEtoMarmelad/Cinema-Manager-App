"use server"

const nodemailer = require("nodemailer");

const TicketEmail = ({ mainInfo, seat, row, time }) =>
    `
        <h1 style="text-align:center">${mainInfo}</h1>
        <h2>Место: ${seat}</h2>
        <h2>Ряд: ${row}</h2>
        <h2>Время сеанса: ${time}</h2>
        <hr/>
        <p>(P.S. Отсчёт номеров места и ряда начинаются с 0. 0-самый первый, а 1-второй)</p>
    `

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: "cinemapetproject@gmail.com",
        pass: process.env.NODEMAILER_SECRET,
    },
});

export const sendFilmTicketMail = async (messageData) => {
    const {recipientEmail, subject, mainInfo, seat, row, time} = messageData
    
    await transporter.sendMail({
        from: '"CinemaPetProject" <cinemapetproject@gmail.com>',
        to: recipientEmail,
        subject: subject,
        html: TicketEmail({mainInfo, seat, row, time})
    });
};