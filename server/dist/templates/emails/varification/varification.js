"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const templatesGenerator_1 = require("../../templatesGenerator");
function varificationEmailTemplate(userName, token) {
    const templatePath = path_1.default.join(__dirname, "varification.html");
    const templateParams = {
        name: userName,
        link: `${process.env.CLIENT_URL}/varifyEmail/${token}`,
    };
    return (0, templatesGenerator_1.generateTemplateHtml)(templatePath, templateParams).then((html) => ({
        subject: "Varify your email",
        text: html,
        isHtml: true,
    }));
}
exports.default = varificationEmailTemplate;
//# sourceMappingURL=varification.js.map