import Link from "next/link";
import Mainlayout from "../../components/layouts/Mainlayout";
import React, { useState } from "react";
import {Bar} from 'react-chartjs-2';
import Chart from 'chart.js/auto'


function Land() {
    const [showDropdown, setDropdown] = useState(false);
    function openDropdown() {
      setDropdown(!showDropdown);
    };

      const chartData2 = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Online',
          data: [256, 425, 123, 425, 896, 236, 123, 423, 325, 552, 243, 800],
          backgroundColor: ['rgba(0, 252, 178)'],
          borderRadius: Number.MAX_VALUE,
          barPercentage: 0.3,
          borderSkipped: false,
        }
      ]
      }

  return (
    <>
    <div>
        <h3 className="font-header" >Online Traffic</h3>

        <div className="mt-5">
            <div className="grid grid-cols-1 2xl:grid-cols-4 2xl:gap-3">
                <div className="2xl:col-span-3 bg-sub-content p-4 relative">
                    <div className="flex gap-2 items-center">
                        <h5 className="text-[#8E8E93]">Fillter by :</h5>
                        <div className="flex gap-2 bg-pill c-pointer" onClick={openDropdown} >
                            <img className="icon-w" src="/assets/images/icons/calendar.svg" alt="" />
                            <p>Month</p>
                            <img className="icon-w" width={24} src="/assets/images/icons/down.svg" alt="" />
                        </div>
                    </div>
                    <div className={showDropdown? "block" : "hidden"}>
                        <div className="bg-dropdrown w-40 absolute p-dropdrown-filter">
                            <p className="list" onClick={openDropdown}>Daily</p>
                            <p className="list" onClick={openDropdown}>Weekly</p>
                            <p className="list" onClick={openDropdown}>Month</p>
                            <p className="list" onClick={openDropdown}>Yearly</p>
                        </div>
                    </div>
                    <div className="chart-container">
                            <Bar
                                data={chartData2}
                                width={500}
                                height={350}
                                options={{
                                    maintainAspectRatio: false
                                }}
                                />
                    </div>
                </div> 
                <div className="mt-3 2xl:mt-0">
                    <div className="grid grid-cols-4 2xl:grid-cols-2 gap-3 h-full">
                        <div className="bg-sub-content w-full p-4 grid content-between">
                            <h4 className="font-semibold tracking-wide">Daily</h4>
                            <div className="text-[#00FCB2] font-30vw">21</div>
                        </div>
                        <div className="bg-sub-content w-full p-4 grid content-between">
                            <h4 className="font-semibold tracking-wide">Weekly</h4>
                            <div className="text-[#00FCB2] font-30vw">345</div>
                        </div>
                        <div className="bg-sub-content w-full p-4 grid content-between">
                            <h4 className="font-semibold tracking-wide">Monthly</h4>
                            <div className="text-[#00FCB2] font-30vw">3,000</div>
                        </div>
                        <div className="bg-sub-content w-full p-4 grid content-between">
                            <h4 className="font-semibold tracking-wide">Yearly</h4>
                            <div className="text-[#00FCB2] font-30vw">15,523</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-sub-content my-3 table-custom onlineTraffic">
                <div className="flex justify-between p-4">
                    <h3 className="font-header">Online Traffic</h3>
                    <div className="flex gap-4">
                        <div className="flex gap-4 items-center bg-pill w-fit">
                            <img className="icon-w" width={24} alt="" src="/assets/images/icons/download.svg" />
                            <p>Export</p>
                        </div>
                        {/* <div className="flex gap-4 items-center bg-pill w-fit">
                            <p>5</p>
                            <p>entries</p>
                            <img className="icon-w" width={24} alt="" src="/assets/images/icons/down.svg" />
                        </div> */}
                    </div>
                </div>
                <table className="table-auto w-full ">
                    <thead className="thead-custom">
                        <tr className="text-[#8E8E93]">
                            <th className="text-left">
                                <h4>Date &amp; Time</h4>
                            </th>
                            <th className="text-left">
                                <h4>Profile</h4>
                            </th>
                            <th className="text-left">
                                <h4>Wallet</h4>
                            </th>
                            <th className="text-left">
                                <h4 className="whitespace-nowrap">In Map</h4>
                            </th>
                            <th className="text-left">
                                <h4>Status</h4>
                            </th>
                            <th className="text-left">
                                <h4>Action</h4>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="tbody-custom">
                        <tr>
                            <td><h4>07/05/2022 - 12.00 H</h4></td>
                            <td>
                                <img alt="" width={32} src="/assets/images/profile/Ellipse 48-1.png" />
                            </td>
                            <td><h4>0xc514b57Be642a782342439D74EA598B0A2994359</h4></td>
                            <td><h4 className="whitespace-nowrap">Yamoo</h4></td>
                            <td>
                                <div className="flex flex-nowrap gap-2 items-center">
                                    <div className="status-online"></div>
                                    <h4 className="whitespace-nowrap" >Online now</h4>
                                </div>
                            </td>
                            <td>
                                <div className="flex gap-2">
                                    <img className="icon-yellow" alt="" width={24} src="/assets/images/icons/edit-black.svg" />
                                    <img className="icon-red" alt="" width={24} src="/assets/images/icons/trash.svg" />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><h4>07/05/2022 - 12.00 H</h4></td>
                            <td>
                                <img alt="" width={32} src="/assets/images/profile/Ellipse 48-2.png" />
                            </td>
                            <td><h4>0xc514b57Be642a782342439D74EA598B0A2994359</h4></td>
                            <td><h4 className="whitespace-nowrap">Yamoo</h4></td>
                            <td>
                                <div className="flex flex-nowrap gap-2 items-center">
                                    <div className="status-online"></div>
                                    <h4 className="whitespace-nowrap" >Online now</h4>
                                </div>
                            </td>
                            <td>
                                <div className="flex gap-2">
                                    <img className="icon-yellow" alt="" width={24} src="/assets/images/icons/edit-black.svg" />
                                    <img className="icon-red" alt="" width={24} src="/assets/images/icons/trash.svg" />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><h4>07/05/2022 - 12.00 H</h4></td>
                            <td>
                                <img alt="" width={32} src="/assets/images/profile/Ellipse 48-3.png" />
                            </td>
                            <td><h4>0xc514b57Be642a782342439D74EA598B0A2994359</h4></td>
                            <td><h4 className="whitespace-nowrap">Yamoo</h4></td>
                            <td>
                                <div className="flex flex-nowrap gap-2 items-center">
                                    <div className="status-online"></div>
                                    <h4 className="whitespace-nowrap" >Online now</h4>
                                </div>
                            </td>
                            <td>
                                <div className="flex gap-2">
                                    <img className="icon-yellow" alt="" width={24} src="/assets/images/icons/edit-black.svg" />
                                    <img className="icon-red" alt="" width={24} src="/assets/images/icons/trash.svg" />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><h4>07/05/2022 - 12.00 H</h4></td>
                            <td>
                                <img alt="" width={32} src="/assets/images/profile/Ellipse 48-4.png" />
                            </td>
                            <td><h4>0xc514b57Be642a782342439D74EA598B0A2994359</h4></td>
                            <td><h4 className="whitespace-nowrap">Yamoo</h4></td>
                            <td>
                                <div className="flex flex-nowrap gap-2 items-center">
                                    <div className="status-online"></div>
                                    <h4 className="whitespace-nowrap" >Online now</h4>
                                </div>
                            </td>
                            <td>
                                <div className="flex gap-2">
                                    <img className="icon-yellow" alt="" width={24} src="/assets/images/icons/edit-black.svg" />
                                    <img className="icon-red" alt="" width={24} src="/assets/images/icons/trash.svg" />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><h4>07/05/2022 - 12.00 H</h4></td>
                            <td>
                                <img alt="" width={32} src="/assets/images/profile/Ellipse 48-5.png" />
                            </td>
                            <td><h4>0xc514b57Be642a782342439D74EA598B0A2994359</h4></td>
                            <td><h4 className="whitespace-nowrap">Yamoo</h4></td>
                            <td>
                                <div className="flex flex-nowrap gap-2 items-center">
                                    <div className="status-online"></div>
                                    <h4 className="whitespace-nowrap" >Online now</h4>
                                </div>
                            </td>
                            <td>
                                <div className="flex gap-2">
                                    <img className="icon-yellow c-pointer" alt="" width={24} src="/assets/images/icons/edit-black.svg" />
                                    <img className="icon-red c-pointer" alt="" width={24} src="/assets/images/icons/trash.svg" />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    </>
  )
}
export default Land
Land.layout = Mainlayout;