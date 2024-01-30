import ButtonState from "../button/button-state";

const ApproveUserList = () => {
  return (
    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg approve-table-scorll">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Users
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Abouts
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Portfolios
                </th>

                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {whitelist.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-0">
                          <div className="text-sm font-medium text-gray-900">
                            {`${item.register.firstName} ${item.register.lastName}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getWalletAddress(item.address)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 td-about">
                      <span className="text-black">{item.register.about}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ul>
                        {item.register.portfolio.length > 0 &&
                          item.register.portfolio.map((item, sub) => {
                            return (
                              <li key={sub} className="text-black">
                                <a
                                  href={item.value}
                                  target={`_blank`}
                                  className="cursor-pointer underline td-port-link"
                                  rel="noreferrer"
                                >
                                  {item.value}
                                </a>
                              </li>
                            );
                          })}
                      </ul>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <ButtonState
                        onFunction={() =>
                          approveWhitelist(item._id, item.address, index)
                        }
                        icon={"fa fa-check mr-2"}
                        text={"Approve"}
                        loading={
                          statusLoading.index === index &&
                          statusLoading.loading === true
                        }
                        classStyle={"btn-theme btn-primary btn-sm mr-1"}
                      />

                      <button
                        onClick={() => cancelWhitelist(item._id)}
                        className="btn-theme btn-danger btn-sm ml-1"
                      >
                        <i className="fa fa-trash mr-2"></i>
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApproveUserList;
