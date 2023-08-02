"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporterConfig = {
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
};
function sendEmail(to, data) {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer_1.default.createTransport(transporterConfig);
        const message = {
            from: process.env.EMAIL_USER,
            to,
            subject: data.subject,
        };
        if (data.isHtml) {
            message.html = data.text;
        }
        else {
            message.text = data.text;
        }
        transporter.sendMail(message, (err, info) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(info);
            }
        });
    });
}
exports.default = sendEmail;
//# sourceMappingURL=sendEmail.js.map