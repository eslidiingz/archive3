import Link from "next/link";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Mainlayout({ children }) {
  return (
    <>
      <div className="flex relative">
        <Navbar />
        <Sidebar />
        <div className="main-content">{children}</div>
      </div>
    </>
  );
}

export default Mainlayout;
