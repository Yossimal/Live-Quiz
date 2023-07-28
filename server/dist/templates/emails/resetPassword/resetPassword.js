"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const templatesGenerator_1 = require("../../templatesGenerator");
function resetPasswordTemplate(userName, token) {
    const templatePath = path_1.default.join(__dirname, "resetPassword.html");
    const templateParams = {
        name: userName,
        link: `${process.env.CLIENT_URL}/resetPassword/${token}`,
    };
    return (0, templatesGenerator_1.generateTemplateHtml)(templatePath, templateParams).then((html) => ({
        subject: "Reset Your Password",
        text: html,
        isHtml: true,
    }));
}
exports.default = resetPasswordTemplate;
//# sourceMappingURL=resetPassword.js.map