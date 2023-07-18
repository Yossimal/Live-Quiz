
import { useOutlet } from "react-router-dom";


export default function Main() {
    const element = useOutlet();
    return (
        <main className="flex-grow-1">
            {element}
        </main>
    )
}