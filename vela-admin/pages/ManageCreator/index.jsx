import Link from "next/link";
import Mainlayout from "../../components/layouts/Mainlayout";
import { useState, useEffect } from "react";
import { getCreators } from "utils/models/Creator";
import { numberComma } from "utils/global/global";

function ManageCreator() {
  /** Data */
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [creators, setCreators] = useState();

  const initialize = async () => {
    await fetchCreator();
  };

  const fetchCreator = async () => {
    let queryStr = `?roles=newbie`;

    let res = await getCreators(queryStr);

    const resCreators = Array.isArray(res?.rows) ? res?.rows : [];

    window.localStorage.setItem('creators', JSON.stringify(resCreators));

    setCreators(res.rows);
  };

  const handleFilterBySearchTerm = () => {
    try {
      const storedCreators = JSON.parse(window.localStorage.getItem('creators'));
      if (Array.isArray(storedCreators) && storedCreators.length) {
        let filteredCreators = [];
        if (searchTerm?.trim()) {
          filteredCreators = storedCreators.filter((creator) => creator.address?.includes(searchTerm));
        } else {
          filteredCreators = storedCreators;
        }
        setCreators(filteredCreators);
      }
      setLoading(false);
    } catch {
      setLoading(false);
      return;
    }
  };

  const handleChangeSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {

    initialize();

  }, []);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      handleFilterBySearchTerm();
    }, 700);

    return () => clearTimeout(delayDebounceFn);

  }, [searchTerm]);

  return (
    <>
      <div>
        {/* content all */}
        <div className="container">
          <div className="row">
            {/* name header */}
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
                      onChange={handleChangeSearchTerm}
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
                <div className="sm:rounded-lg">
                  <table className="w-full text-left">
                    <thead className="text12">
                      <tr Align="center">
                        <th scope="col" className="layout08">
                          Number
                        </th>
                        {/* <th scope="col" className="layout08">
                          Profile
                        </th> */}
                        <th scope="col" className="layout08" Align="left">
                          Wallet
                        </th>
                        <th scope="col" className="layout08">
                          Collection Qty
                        </th>
                        <th scope="col" className="layout08">
                          Asset Qty
                        </th>
                        {/* <th scope="col" className="layout08">
                          Action
                        </th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {loading && (
                        <tr className="text-center odd:bg-white even:bg-gray-50">
                          <td colSpan={4}>
                            <i className="fa fa-spinner fa-spin mr-2"></i>
                          </td>
                        </tr>
                      )}
                      {(!loading && !creators?.length) && (
                        <tr className="text-center odd:bg-white even:bg-gray-50">
                          <td colSpan={4}>
                            <h4 className="my-6">ไม่พบข้อมูล</h4>
                          </td>
                        </tr>
                      )}
                      {(!loading && creators) &&
                        creators.map((user, key) => {
                          return (
                            <tr
                              className="odd:bg-white even:bg-gray-50"
                              key={key}
                            >
                              <th
                                scope="row"
                                className="px-6 py-4"
                                Align="center"
                              >
                                <p className="text09">{key + 1}</p>
                              </th>
                              {/* <td className="px-6 py-4" Align="center">
                                <img
                                  alt=""
                                  className="profileimg"
                                  src="/assets/images/profile/Ellipse 48-6.png"
                                />
                              </td> */}
                              <td>
                                <Link href={`/ManageCreator/${user._id}/Detail`}>
                                  <a
                                    className="text09 hover:text-primary"
                                    Align="left"
                                  >
                                    {user.address}
                                  </a>
                                </Link>
                                <p className="text13" Align="left">
                                  {user.register?.firstName}{" "}
                                  {user.register?.lastName}
                                </p>
                              </td>
                              <td className="px-6 py-4" Align="center">
                                <p className="text14">{numberComma(user?.whitelistUser?.collectionAssetDetail?.length || 0)}</p>
                              </td>
                              <td className="px-6 py-4" Align="center">
                                <p className="text14">{numberComma(user?.whitelistUser?.collectionAssetDetail?.reduce?.((accumulator, collection) => (accumulator + collection.userAssets), 0) || 0)}</p>
                              </td>
                              {/* <td className="px-6 py-4" Align="center">
                                <a href="#">
                                  <img
                                    alt=""
                                    className="iconmc"
                                    src="/assets/images/icons/fi-sr-edit1.svg"
                                  />
                                </a>
                              </td> */}
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
                {/* content table */}
              </div>
              {/* End-table */}
            </div>
            {/* table conten */}

            {/* Pagination */}
            {/* <div className="grid grid-cols-6 gap-4 layout09" Align="right">
              <div className="col-start-1 col-end-7">
                <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-2">
                    <a href="#" className="hover:text-gray-600">
                      <img
                        alt=""
                        className="numberimg"
                        src="/assets/images/icons/down_button.svg"
                      />
                    </a>
                    <div className="flex flex-row space-x-1">
                      <div className="bg-gr-btn">1</div>
                      <div className="bg-gra-btn hover:bg-gra-btn hover:text-black">
                        2
                      </div>
                      <div className="bg-gra-btn hover:bg-gra-btn hover:text-black">
                        3
                      </div>
                    </div>
                    <a href="#" className="hover:text-gray-600">
                      <img
                        alt=""
                        className="numberimg"
                        src="/assets/images/icons/down_button-1.svg"
                      />{" "}
                    </a>
                  </div>
                </div>
              </div>
            </div> */}
            {/* End Pagination */}
          </div>
        </div>

        {/* End-content all */}
      </div>
    </>
  );
}
export default ManageCreator;
ManageCreator.layout = Mainlayout;
