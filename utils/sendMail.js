import nodemailer from "nodemailer";
var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.username,
        pass: process.env.password,
    },
});

export const resetPasswordEmail = async (email, otp) => {
    await smtpTransport.sendMail({
        from: "HOLOGRAM",
        to: email,
        subject: "Reset Password",
        text: `OTP is ${otp}`,
        html: `<h3> USE THIS OTP TO RESET YOUR PASSWORD <b>${otp}</b> </h3>`,
    });
};
