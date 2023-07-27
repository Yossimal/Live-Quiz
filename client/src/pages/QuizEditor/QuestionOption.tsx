import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";

type QuestionOptionProps = {
  optionState: PartialState<OptionalQuestionOptionType>;
  deleteOption: FullFunciton<void, []>;
};

export default function QuestionOption({
  optionState,
  deleteOption,
}: QuestionOptionProps) {
  const [option, setOption] = optionState;

  return (
    <div className="p-inputgroup">
      <span className="p-inputgroup-addon flex gap-2">
        <label htmlFor="isCorrect">Correct:</label>
        <Checkbox
          id="isCorrect"
          checked={option.isCorrect ?? false}
          onChange={(e) =>
            setOption({
              ...option,
              isCorrect: e.checked ?? false,
              isChanged: true,
            })
          }
        />
      </span>
      <InputText
        placeholder="Enter the option text here"
        value={option.data}
        onChange={(e) =>
          setOption({
            ...option,
            data: e.target.value,
            isChanged: true,
          })
        }
      />
      <Button
        icon="pi pi-trash"
        className="p-button-danger"
        tooltip="Delete this option"
        onClick={deleteOption}
      />
    </div>
  );
}
