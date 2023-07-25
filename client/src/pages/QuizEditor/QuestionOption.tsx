import { InputText } from "primereact/inputtext";
import { QuestionOptionType } from "../../types/dataObjects";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";

type QuestionOptionProps = {
  optionState: PartialState<QuestionOptionType>;
  deleteOption: FullFunciton<void, []>;
};

export default function QuestionOption({
  optionState,
  deleteOption,
}: QuestionOptionProps) {
  const [option, setOption] = optionState;

  return (
    <div className="p-inputgroup">
      <span className="p-inputgroup-addon">
        <label htmlFor="isCorrect">Correct:</label>
        <Checkbox
          id="isCorrect"
          checked={option.isCorrect}
          onChange={(e) =>
            setOption({ ...option, isCorrect: e.checked ?? false })
          }
        />
      </span>
      <InputText placeholder="Enter the option text here" />
      <Button
        icon="pi pi-trash"
        className="p-button-danger"
        onClick={deleteOption}
      />
    </div>
  );
}
