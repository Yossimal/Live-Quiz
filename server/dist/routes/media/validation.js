"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadQuizImageValidation = void 0;
const zod_1 = require("zod");
const uploadQuizImage = zod_1.z.object({
    quizId: zod_1.z.number().int().positive(),
    extention: zod_1.z.string().regex(/(png|jpg|jpeg|gif)/),
});
function uploadQuizImageValidation(req, res, next) {
    try {
        const { quizId } = uploadQuizImage.parse(req.body);
        res.locals.quizId = quizId;
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            if (error.errors[0].path[0] === "extention") {
                return res.status(400).send({
                    error: "The file extention is not valid. The valid options are (png, jpg, jpegm, gif).",
                });
            }
            res
                .status(400)
                .send({ error: "There was an error processing the request data." });
        }
    }
}
exports.uploadQuizImageValidation = uploadQuizImageValidation;
//# sourceMappingURL=validation.js.map