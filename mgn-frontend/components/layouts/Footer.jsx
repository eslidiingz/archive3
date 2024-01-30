import Link from "next/link"
import { Button } from "react-bootstrap"
import ScrollToTop from "react-scroll-to-top";


function FooterNew() {


  return (
    <>
      <footer className="footer-bg pt-4 pb-3">
        <div className="container fix-container">
          <div className="row">
            <div className="col-12 d-flex align-items-center justify-content-center">
              <Link href="/">
                <div className="d-flex align-items-center">
                  <img src="/assets/image/footer/icon-logo.svg" className="img-logo_footer" />
                  <p className="mb-0 mx-3 text-logo_footer">SIAM CANNABIS</p>
                </div>
              </Link>
            </div>
            {/* <div className="col-12 d-flex align-items-center justify-content-center mt-3">
              <p className="text-detail_footer">Be the leader of agriculture with a Blockchain system in commerce and services for the benefit of Thai traditional medicine and public health.</p>
            </div> */}
            {/* <div className="col-12 d-flex align-items-center justify-content-center my-2">
              <p className="text-copyright_footer">Copyright  © 2022 Siam Cannabis All rights reserved.</p>
            </div> */}

            <div className="col-12 d-flex align-items-center justify-content-center my-2">
              <div className="ul-set w-100 d-flex align-items-center justify-content-center">
                <ul className="mb-0">
                  <li>
                    <Link href={"https://www.facebook.com/Siam-Cannabis-107505868658162"}>
                      <a target="_blank">
                        <i className="fab fa-facebook-f icon-social_footer icon-facebook_footer"></i>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href={"https://www.facebook.com/Siam-Cannabis-107505868658162"}>
                      <a target="_blank">
                        <i className="fab fa-facebook-messenger icon-social_footer icon-ms-facebook_footer"></i>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href={"https://manager.line.biz/account/@691gheed"}>
                      <a target="_blank">
                        <img src="/assets/image/footer/icon-Line2.svg" className="icon-img-social_footer" />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href={"https://www.youtube.com/channel/UCFkHLfcJ-AUjjKElH0hBuVg"}>
                      <a target="_blank">
                        <i className="fab fa-youtube icon-social_footer icon-youtube_footer mx-0"></i>
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="layout-backtotop_footer">
                {/* <Link href={"#body"}>
                  <div className="layout-bg-bscktotop_footer">
                    <img src="/assets/image/footer/backtotop.svg" className="icon-backtotop_footer" />
                  </div>
                </Link>  */}
                <ScrollToTop className="layout-bg-bscktotop_footer btn text-white" smooth />
              </div>

            </div>
            {/* <hr className="hr_footer" /> */}
            <div className="col-12 d-flex align-items-center justify-content-center my-2">
              <p className="text-copyright_footer">Copyright  © 2022 Siam Cannabis All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
export default FooterNew