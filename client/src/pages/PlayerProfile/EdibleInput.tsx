import { InputText } from "primereact/inputtext";

type EdibleInputProps = {
  label: string;
  id: string;
  valueState: PartialState<string>;
  isEdible: boolean;
  type?: "text" | "password";
};

export default function EdibleInput({
  valueState,
  isEdible,
  id,
  label,
  type = "text",
}: EdibleInputProps) {
  const [value, setValue] = valueState;

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <InputText
        id={id}
        value={value}
        disabled={!isEdible}
        onChange={(e) => setValue(e.target.value)}
        type={type}
      />
    </>
  );
}
