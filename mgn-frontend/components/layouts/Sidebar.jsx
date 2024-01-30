import Link from "next/link";
import { Button } from "react-bootstrap";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useState } from "react";
import { useRouter } from "next/router";


function Sidebar() {
  const router = useRouter();
  const [isActive, setActive] = useState(false);
  const toggleMode = () => {
    setActive(!isActive);
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="sidebar-menu">
        <Link href="/">
          <a className={`nav-sidebar-link ${ router.pathname == "/" ? "active" : "" }`}>
            <div className="icon-nav icon-home"></div>
            <p className="nav-text">HOME</p>
          </a>
        </Link>

        <Link href="/project">
          <a className={`nav-sidebar-link ${ router.pathname == "/project" ? "active" : "" }`}>
          <div className="icon-nav icon-project"></div>
            <p className="nav-text">Project</p>
          </a>
        </Link>

        <Link href="/inventory">
          <a className={`nav-sidebar-link ${ router.pathname == "/inventory" ? "active" : "" }`}>
          <div className="icon-nav icon-inventory"></div>
            <p className="nav-text">Inventory</p>
          </a>
        </Link>

        <Link href="/market">
          <a className={`nav-sidebar-link ${ router.pathname == "/market" ? "active" : "" }`}>
          <div className="icon-nav icon-market"></div>
            <p className="nav-text">Market</p>
          </a>
        </Link>

        <Link href="https://siamcannabis-io.gitbook.io/white-paper-update/">
          <a className={`nav-sidebar-link ${ router.pathname == "/white-paper" ? "active" : "" }`} target="_blank">
            <div className="icon-nav icon-whitepaper"></div>
            <p className="nav-text">White Paper</p>
          </a>
        </Link>
      </div>
    </>
  )
}
export default Sidebar
