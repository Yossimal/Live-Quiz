// type OptionPut =
//   | {
//       id?: number;
//       data?: string;
//       isCorrect?: boolean;
//     }
//   | undefined;



// router.put("/updateQuestion", updateQuestionValidation, async (req, res) => {
//   const { id, media, question, mediaType, options } = res.locals
//     .updatedQuestion as QuestionPutType;

//   const { newOptions, updatedOptions, deletedOptions } = getOptions(options);
//   try {
//     const updatedQuestion = await prisma.question.update({
//       where: {
//         id,
//       },
//       data: {
//         question,
//         mediaType,
//         options: {
//           createMany: {
//             data: newOptions,
//           },
//           updateMany: updatedOptions.map((opt) => ({
//             where: { id: opt.id },
//             data: {
//               data: opt.data,
//               isCorrect: opt.isCorrect,
//             },
//           })),
//           deleteMany: {
//             id: {
//               in: deletedOptions,
//             },
//           },
//         },
//       },
//       include: {
//         options: true,
//       },
//     });
//     res.send(updatedQuestion);
//   } catch (err) {
//     res.sendStatus(500);
//   }
// });

