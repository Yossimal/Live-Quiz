import { Button } from "primereact/button";
import QuestionOption from "./QuestionOption";
import { randomNumberIdNeg } from "../../common/uniqueGen";

type QuestionOptionListProps = {
  optionsState: PartialState<OptionalQuestionOptionType[]>;
};

export default function QuestionOptionList({
  optionsState,
}: QuestionOptionListProps) {
  const [options, setOptions] = optionsState;

  const setOption = (newOption: OptionalQuestionOptionType) => {
    const newOptions = options.map((option: OptionalQuestionOptionType) => {
      if (option.id === newOption.id) {
        return newOption;
      }
      return option;
    });
    setOptions(newOptions);
  };

  const deleteOption = (id: number) => {
    const optionIndex = options.findIndex(
      (option: OptionalQuestionOptionType) => option.id === id
    );
    const newOptions = [...options];
    newOptions[optionIndex].isDeleted = true;
    newOptions[optionIndex].isChanged = true;
    setOptions(newOptions);
  };
  const optionsDOM = options.filter(o=>!o.isDeleted).map((option) => {
    return (
      <QuestionOption
        key={option.id}
        optionState={[option, setOption]}
        deleteOption={() => option.id && deleteOption(option.id)}
      />
    );
  });

  return (
    <>
      {optionsDOM}
      <Button
        label="Add Option"
        icon="pi pi-plus"
        className="p-button-secondary align-self-start"
        onClick={() =>
          setOptions([
            ...options,
            {
              id: randomNumberIdNeg(),
              data: "",
              isCorrect: false,
              isChanged: true,
            },
          ])
        }
      />
    </>
  );
}
