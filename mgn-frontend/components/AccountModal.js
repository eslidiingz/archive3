import { Component } from "react";
import Web3 from "web3";
import { getWalletAddress } from "../utils/address";
import Config from "../pages/config";
class AccountModal extends Component {
  constructor(props) {
    super(props);
    this.state = { account: "" };
  }

  componentDidMount() {
    this.loadBlockchainData();
    this.loadTransaction();
  }

  async loadBlockchainData() {
    const web3 = new Web3(
      Web3.givenProvider || "https://data-seed-prebsc-1-s1.binance.org:8545"
    );
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
  }

  async loadTransaction() {
    // const web3 = new Web3(Web3.givenProvider || "https://data-seed-prebsc-1-s1.binance.org:8545");
    // const accounts = await web3.eth.getAccounts();
  }

  linkExplorer() {
    window.open(`${Config.BLOCK_EXPLORER}/address/${this.state.account}`);
  }

  render() {
    return (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
            &#8203;
          </span>

          <div className="inline-block align-bottom bg-yellow-200 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-4">
            <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
              <button
                type="button"
                onClick={() => console.log("close")}
                className="bg-yellow-200 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Your Wallet
                </h3>
                <div className="mt-2 w-full">
                  <div className="border-2 border-gray-200 rounded-xl p-3 bg-white">
                    <span className="text-sm text-gray-400">
                      Connected with MetaMask
                    </span>

                    <div className="mt-1">
                      <span className="text-xl">
                        {getWalletAddress(this.state.account)}
                      </span>
                    </div>
                    <div className="mt-2">
                      <button className="inline-flex items-center rounded bg-white text-gray-400 text-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2"
                          ></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <span className="ml-2">Copy Address</span>
                      </button>
                      <button
                        className="ml-10 inline-flex items-center rounded bg-white text-gray-400 text-sm"
                        onClick={() => this.linkExplorer()}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        <span className="ml-2">View on Explorer</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="inline-block mt-2">
              <span>Your transactions will appear here...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AccountModal;
