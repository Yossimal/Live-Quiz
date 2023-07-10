import * as fs from "fs";

export function generateTemplateHtml(
  templatePath: string,
  templateParams: object
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!templatePath) {
      reject("cant resolve template path");
    }
    fs.readFile(templatePath, "utf8", (err, templateText) => {
      if (err) {
        reject(err);
      } else {
        let template = templateText;
        for (const [key, value] of Object.entries(templateParams)) {
          template = template.replace(`{{${key}}}`, value as string);
        }
        resolve(template);
      }
    });
  });
}
