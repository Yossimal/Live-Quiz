import { Dialog } from "primereact/dialog";
import {
  FileUpload,
  FileUploadHandlerEvent,
  FileUploadHeaderTemplateOptions,
} from "primereact/fileupload";
import { useRef } from "react";

type ChangeImageDialogProps = {
  isVisible: State<boolean>;
  changeImage: FullFunciton<void, [File]>;
};

function emptyTemplate() {
  return (
    <div className="p-d-flex p-ai-center p-dir-col">
      <p>Drag the new image to here.</p>
    </div>
  );
}

type FileUploadFile = {
  objectURL: string;
  name: string;
};

function isFileUploadFile(file: any): file is FileUploadFile {
  return file && file.objectURL && file.name;
}

function bodyTemplate(file: object) {
  if (!isFileUploadFile(file)) {
    return <div>error</div>;
  }
  const { name, objectURL } = file as FileUploadFile;
  return (
    <div className="p-d-flex p-ai-center p-dir-col">
      <img
        src={objectURL}
        role="presentation"
        alt={name}
        width={200}
        height={"auto"}
      />
    </div>
  );
}

function headerTemplate(options: FileUploadHeaderTemplateOptions) {
  const { className, chooseButton, uploadButton, cancelButton } = options;

  return (
    <div
      className={className}
      style={{
        backgroundColor: "transparent",
        display: "flex",
        alignItems: "center",
      }}
    >
      {chooseButton}
      {uploadButton}
      {cancelButton}
    </div>
  );
}

export default function ChangeImageDialog({
  isVisible,
  changeImage,
}: ChangeImageDialogProps) {
  const fileUpload = useRef<FileUpload>(null);
  const [visible, setVisible] = isVisible;

  const onUpload = (event: FileUploadHandlerEvent) => {
    changeImage(event.files[0]);
    setVisible(false);
  };

  const chooseOptions = {
    icon: "pi pi-fw pi-images",
    iconOnly: true,
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };
  const uploadOptions = {
    icon: "pi pi-fw pi-cloud-upload",
    iconOnly: true,
    className:
      "custom-upload-btn p-button-success p-button-rounded p-button-outlined",
  };
  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    iconOnly: true,
    className:
      "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
  };

  return (
    <Dialog visible={visible} onHide={() => setVisible(false)}>
      <FileUpload
        ref={fileUpload}
        customUpload
        accept="image/*"
        maxFileSize={10000000} // 10MB
        auto={false} // We'll handle the upload manually
        itemTemplate={bodyTemplate}
        emptyTemplate={emptyTemplate}
        headerTemplate={headerTemplate}
        uploadHandler={onUpload}
        chooseOptions={chooseOptions}
        uploadOptions={uploadOptions}
        cancelOptions={cancelOptions}
      />
    </Dialog>
  );
}
