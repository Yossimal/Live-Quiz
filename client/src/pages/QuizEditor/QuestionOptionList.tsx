import { Button } from "primereact/button";
import { QuestionOptionType } from "../../types/dataObjects";
import QuestionOption from "./QuestionOption";

type QuestionOptionListProps = {
  optionsState: PartialState<QuestionOptionType[]>;
};

export default function QuestionOptionList({
  optionsState,
}: QuestionOptionListProps) {
  const [options, setOptions] = optionsState;

  const setOption = (newOption: QuestionOptionType) => {
    const newOptions = options.map((option: QuestionOptionType) => {
      if (option.id === newOption.id) {
        return newOption;
      }
      return option;
    });
    setOptions(newOptions);
  };

  const deleteOption = (id: number) => {
    const newOptions = options.filter(
      (option: QuestionOptionType) => option.id !== id
    );
    setOptions(newOptions);
  };
  const optionsDOM = options.map((option) => {
    <QuestionOption
      optionState={[option, setOption]}
      deleteOption={() => deleteOption(option.id)}
    />;
  });

  return <>
    {optionsDOM}
    <Button/>
  </>;
}
