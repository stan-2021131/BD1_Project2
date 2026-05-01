import Navbar from "../components/Navbar/NavBar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <>
            <Navbar />
            <main style={{ padding: "20px" }}>
                <Outlet />
            </main>
        </>
    );
};

export default MainLayout;