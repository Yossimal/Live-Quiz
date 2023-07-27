import path from "path";
import { generateTemplateHtml } from "../../templatesGenerator";
import { EmailData } from "../../../lib/email/sendEmail";

export default function varificationEmailTemplate(
  userName: string,
  token: string
): Promise<EmailData> {
  const templatePath = path.join(__dirname, "varification.html");
  const templateParams = {
    name: userName,
    link: `${process.env.CLIENT_URL}/varifyEmail/${token}`,
  };
  return generateTemplateHtml(templatePath, templateParams).then((html) => ({
    subject: "Varify your email",
    text: html,
    isHtml: true,
  }));
}
