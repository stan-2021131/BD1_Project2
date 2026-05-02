import Navbar from "../components/Navbar/NavBar";
import { Outlet } from "react-router-dom";
import "../index.css";

const MainLayout = () => {
    return (
        <>
            <Navbar />
            <main className="main-content fade-in">
                <Outlet />
            </main>
        </>
    );
};

export default MainLayout;