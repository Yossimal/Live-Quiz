import makePrivate from "../../router/makePrivate";
import SidebarMenu from "../../components/Sidebar"
// import { Outlet } from "react-router-dom";
import Main from "../../components/Main";


function Home() {
    return (
        <div className="flex flex-column">
            <SidebarMenu />

            <Main />

            {/* <Outlet /> */}
        </div>
    )
}

export default makePrivate(Home);
