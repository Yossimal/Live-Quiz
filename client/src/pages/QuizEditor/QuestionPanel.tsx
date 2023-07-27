import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import NumberInput from "./NumberInput";
import QuestionOptionList from "./QuestionOptionList";
import { Divider } from "primereact/divider";

type QuestionPanelProps = {
  questionState: PartialState<EdibleQuestionType>;
  onDelete: FullFunciton<void, [number]>;
  moveUp: FullFunciton<void, [number]>;
  moveDown: FullFunciton<void, [number]>;
};

type PanelHeaderTemplateProps = {
  questionText?: string;
  onDelete: FullFunciton<void, []>;
  options: PanelHeaderTemplateOptions;
  moveUp: FullFunciton<void, []>;
  moveDown: FullFunciton<void, []>;
};

type PanelHeaderControlsProps = {
  onDelete: FullFunciton<void, []>;
  toggleCollapsed: FullFunciton<void, [any]>;
  isCollapsed: boolean;
  moveUp: FullFunciton<void, []>;
  moveDown: FullFunciton<void, []>;
};

type PanelHeaderStartProps = {
  question?: string;
};

function PanelHeaderControls({
  onDelete,
  toggleCollapsed,
  moveUp,
  moveDown,
  isCollapsed,
}: PanelHeaderControlsProps) {
  return (
    <>
      <Button
        icon="pi pi-arrow-up"
        rounded
        text
        aria-label="Move Question Up"
        onClick={moveUp}
        severity="secondary"
      />

      <Button
        icon="pi pi-arrow-down"
        rounded
        text
        aria-label="Move Question Down"
        onClick={moveDown}
        severity="secondary"
      />

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
  moveUp,
  moveDown,
}: PanelHeaderTemplateProps) {
  return (
    <Toolbar
      start={<PanelHeaderStart question={questionText} />}
      end={
        <PanelHeaderControls
          isCollapsed={options.collapsed}
          toggleCollapsed={options.onTogglerClick}
          onDelete={onDelete}
          moveUp={moveUp}
          moveDown={moveDown}
        />
      }
    />
  );
}

export default function QuestionPanel({
  questionState,
  onDelete,
  moveUp,
  moveDown,
}: QuestionPanelProps) {
  const [question, setQuestion] = questionState;

  const setOptions = (newOptions: OptionalQuestionOptionType[]) => {
    setQuestion({ ...question, options: newOptions, isChanged: true });
  };

  const headerTemplate = (options: any) => {
    return <PanelHeaderTemplate
      questionText={question.question}
      onDelete={() => onDelete(question.id)}
      options={options}
      moveUp={() => moveUp(question.id)}
      moveDown={() => moveDown(question.id)}
    />
};

  return (
    <Panel className="surface mb-2 shadow-3 border-round" headerTemplate={headerTemplate} collapsed toggleable>
      <div className="flex flex-column gap-2">
        <div className="flex flex-column gap-2 align-items-center justify-content-center ">
          <div className="flex align-items-center w-full justify-content-start gap-3 align-self-start">
            <label htmlFor="question">Question:</label>
            <InputText
              id="question"
              className='w-full'
              value={question.question}
              onChange={(e) =>
                setQuestion({
                  ...question,
                  question: e.currentTarget.value,
                  isChanged: true,
                })
              }
            />
          </div>
          <div className="flex w-9 lg:w-full flex-column lg:flex-row lg:justify-content-between">
            <NumberInput
              id="score"
              labelText="Score: 🏆"
              value={question.score ?? 10}
              onChange={(score) =>
                setQuestion({ ...question, score, isChanged: true })
              }
            />
            <Divider layout="vertical" className="hidden lg:block" />
            <NumberInput
              id="time"
              labelText="Time: ⏳ (seconds)"
              value={question.time ?? 100}
              onChange={(time) =>
                setQuestion({ ...question, time, isChanged: true })
              }
            />
          </div>
          <Divider align="center">
            <div className="inline-flex align-items-center">
              <i className="pi pi-list mr-2"></i>
              <b>Options</b>
            </div>
          </Divider>
          <QuestionOptionList
            optionsState={[question.options ?? [], setOptions]}
          />
        </div>
      </div>
    </Panel>
  );
}
