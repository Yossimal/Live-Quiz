
import { useOutlet } from "react-router-dom";


export default function Main() {
    const element = useOutlet();
    return (
        <div style={{
            marginLeft: "12rem",
        }} className="flex-grow-1">
            {element}
        </div>
    )
}