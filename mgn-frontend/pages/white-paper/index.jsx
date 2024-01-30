import Mainlayout from "../../components/layouts/Mainlayout";
import React from "react";
import TabWhitepaper from "../../components/tab/Whitepaper";

const Whitepaper = () => {
  return (
    <>
      <section>
        <div className="homepage_wp">
          <div className="container fix-container">
            <div className="layout-tap-leftmain_WP">
              <TabWhitepaper />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Whitepaper;
Whitepaper.layout = Mainlayout;
