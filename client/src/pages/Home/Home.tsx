import makePrivate from "../../router/makePrivate";
import Sidebar from "../../components/Sidebar"


function Home() {
    return (
        <div>
            <Sidebar />
        </div>
    )
}

export default makePrivate(Home);
