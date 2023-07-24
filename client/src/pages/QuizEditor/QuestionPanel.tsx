import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { useState } from "react";

type QuestionPanelProps = {
  questionState: ArrayState<EdibleQuestionType>;
  onDelete: FullFunciton<void, [number]>;
};

type PanelHeaderTemplateProps = {
  questionText?: string;
  onDelete: FullFunciton<void, []>;
  options: PanelHeaderTemplateOptions;
};

type PanelHeaderControlsProps = {
  onDelete: FullFunciton<void, []>;
  toggleCollapsed: FullFunciton<void, [any]>;
  isCollapsed: boolean;
};

type PanelHeaderStartProps = {
  question?: string;
};

function PanelHeaderControls({
  onDelete,
  toggleCollapsed,
  isCollapsed,
}: PanelHeaderControlsProps) {
  return (
    <>
      <Button
        icon="pi pi-trash"
        rounded
        text
        aria-label="Delete Question"
        severity="danger"
        onClick={onDelete}
      />
      <Button
        onClick={toggleCollapsed}
        icon={`pi pi-${isCollapsed ? "plus" : "minus"}`}
        text
        severity="secondary"
        aria-label={isCollapsed ? "Expand" : "Collapse"}
      ></Button>
    </>
  );
}

function PanelHeaderStart({ question }: PanelHeaderStartProps) {
  return <h3>{question}</h3>;
}

function PanelHeaderTemplate({
  questionText,
  onDelete,
  options,
}: PanelHeaderTemplateProps) {
  return (
    <Toolbar
      start={<PanelHeaderStart question={questionText} />}
      end={
        <PanelHeaderControls
          isCollapsed={options.collapsed}
          toggleCollapsed={options.onTogglerClick}
          onDelete={onDelete}
        />
      }
    />
  );
}

export default function QuestionPanel({
  questionState,
  onDelete,
}: QuestionPanelProps) {
  const [question, setQuestion] = questionState;

  const headerTemplate = (options: any) => (
    <PanelHeaderTemplate
      questionText={question.question}
      onDelete={() => onDelete(question.id)}
      options={options}
    />
  );

  return (
    <Panel headerTemplate={headerTemplate} toggleable>
      <div className="flex flex-column gap-2">
        <div className="flex flex-column gap-2">
          <label htmlFor="question">Question:</label>
          <InputText
            id="question"
            value={question.question}
            onChange={(e) =>
              setQuestion({ ...question, question: e.currentTarget.value })
            }
          />
        </div>
      </div>
    </Panel>
  );
}
