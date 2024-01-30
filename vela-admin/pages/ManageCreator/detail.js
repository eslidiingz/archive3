import Link from "next/link";
import Mainlayout from "../../components/layouts/Mainlayout";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

function ManagecreatorDetail() {
  return (
    <>
      <div>
        {/* content all */}
        <div className="container">
          <div className="row">
            {/* name header */}
            {/* <div className="grid grid-cols-6 gap-4">
                    <div className="col-start-1 col-end-7 text11">Manage Creator</div>
                </div> */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 text11">Manage Creator</div>
              <div>
                {/* Search */}
                <div
                  className="flex items-center max-w-md mx-autos bg-whites rounded-lg "
                  x-data="{ search: '' }"
                >
                  <div className="w-full">
                    <input
                      type="search"
                      className="w-full px-4 py-1 text-gray-800s rounded-full focus:outline-none"
                      placeholder="Search user wallet time"
                      x-model="search"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="flex items-center bg-gray justify-center w-12 h-12 text-white rounded-r-lg"
                      disabled="search.length == 0"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {" "}
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
                {/* End-Search */}
              </div>
            </div>
            {/* End-name header */}
            {/* table conten */}
            <div className="grid grid-cols-1 gap-3 mt-4 " Align="center">
              <div className="layout10" Align="left">
                {/* content table */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 layout12">
                    <div>
                      <img
                        src="/assets/images/profile/Ellipse 48-6.png"
                        className="img-radius img-ma"
                        width="45px"
                      />
                      <p className="text15" Align="left">
                        0xc514b57Be642a782342439D74EA598B0A2994359
                      </p>
                      <p className="text13" Align="left">
                        Last online 2 hour ago
                      </p>
                    </div>
                    <br />
                    <div>
                      <p className="text12 layout13">Portfolio</p>
                      <a href="#" className="text16">
                        www.google.com
                      </a>
                      <br />
                      <a href="#" className="text16">
                        www.google.com
                      </a>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="layout12-2">
                    <table className="w-full text-left">
                      <thead className="text14">
                        <tr>
                          <th scope="col" className="layout14" Align="left">
                            Asset Name
                          </th>
                          <th scope="col" className="layout14" Align="right">
                            Asset size
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="odd:bg-white">
                          <th scope="row" Align="left">
                            <a href="#">
                              <p className="text14">NAME Asset</p>
                            </a>
                          </th>
                          <td Align="right">
                            <p className="text14">3x3</p>
                          </td>
                        </tr>
                        <tr className="odd:bg-white">
                          <th scope="row" Align="left">
                            <a href="#">
                              <p className="text14">NAME Asset</p>
                            </a>
                          </th>
                          <td Align="right">
                            <p className="text14">3x3</p>
                          </td>
                        </tr>
                        <tr className="odd:bg-white">
                          <th scope="row" Align="left">
                            <a href="#">
                              <p className="text14">NAME Asset</p>
                            </a>
                          </th>
                          <td Align="right">
                            <p className="text14">3x3</p>
                          </td>
                        </tr>
                        <tr className="odd:bg-white">
                          <th scope="row" Align="left">
                            <a href="#">
                              <p className="text14">NAME Asset</p>
                            </a>
                          </th>
                          <td Align="right">
                            <p className="text14">3x3</p>
                          </td>
                        </tr>
                        <tr className="odd:bg-white">
                          <th scope="row" Align="left">
                            <a href="#">
                              <p className="text14">NAME Asset</p>
                            </a>
                          </th>
                          <td Align="right">
                            <p className="text14">3x3</p>
                          </td>
                        </tr>
                        <tr className="odd:bg-white">
                          <th scope="row" Align="left">
                            <a href="#">
                              <p className="text14">NAME Asset</p>
                            </a>
                          </th>
                          <td Align="right">
                            <p className="text14">3x3</p>
                          </td>
                        </tr>
                        <tr className="odd:bg-white">
                          <th scope="row" Align="left">
                            <a href="#">
                              <p className="text14">NAME Asset</p>
                            </a>
                          </th>
                          <td Align="right">
                            <p className="text14">3x3</p>
                          </td>
                        </tr>
                        <tr className="odd:bg-white">
                          <th scope="row" Align="left">
                            <a href="#">
                              <p className="text14">NAME Asset</p>
                            </a>
                          </th>
                          <td Align="right">
                            <p className="text14">3x3</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* End-content table */}
              </div>
            </div>

            {/* End-table conten */}
          </div>
        </div>
        {/* End-content all */}
      </div>
    </>
  );
}
export default ManagecreatorDetail;
ManagecreatorDetail.layout = Mainlayout;
