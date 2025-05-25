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
        <h1>:3 Сердечко---><3</h1>
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
    const {subject, mainInfo, seat, row, time} = messageData
    
    await transporter.sendMail({
        from: '"CinemaPetproject" <cinemapetproject@gmail.com>',
        to: "tomifa7058@ofular.com", //<--10 minutes mail
        subject: subject,
        html: TicketEmail({mainInfo, seat, row, time}), // HTML body
    });
};