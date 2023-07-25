import { InputNumber } from "primereact/inputnumber";

type NumberInputProps = {
  value: number;
  onChange: FullFunciton<void, [number]>;
  labelText: string;
  id: string;
};

export default function NumberInput({
  value,
  onChange,
  labelText,
  id,
}: NumberInputProps) {
  return (
    <>
      <label htmlFor={id}>{labelText}</label>
      <InputNumber
        id={id}
        value={value}
        onValueChange={(e) => onChange(e.value as number)}
        mode="decimal"
        min={0}
        incrementButtonClassName="p-button-success"
        decrementButtonClassName="p-button-danger"
        incrementButtonIcon="pi pi-plus"
        decrementButtonIcon="pi pi-minus"
        showButtons
        buttonLayout="horizontal"
      />
    </>
  );
}
