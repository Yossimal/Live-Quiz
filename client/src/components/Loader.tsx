import { ProgressBar } from "primereact/progressbar";

export default function Loader() {
    return (
        <div className="card flex align-items-center justify-content-center">
            <ProgressBar
                mode="indeterminate"
                style={{ height: "6px" }}
            ></ProgressBar>
        </div>
    );
}