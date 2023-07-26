import path from "path";
import { generateTemplateHtml } from "../../templatesGenerator";
import { EmailData } from "../../../lib/email/sendEmail";

export default function resetPasswordTemplate(
  userName: string,
  token: string
): Promise<EmailData> {
  const templatePath = path.join(__dirname, "resetPassword.html");
  const templateParams = {
    name: userName,
    link: `${process.env.CLIENT_URL}/resetPassword/${token}`,
  };
  return generateTemplateHtml(templatePath, templateParams).then((html) => ({
    subject: "Reset Your Password",
    text: html,
    isHtml: true,
  }));
}
