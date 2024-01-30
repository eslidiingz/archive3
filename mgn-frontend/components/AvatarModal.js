import { Component } from "react";
import Web3 from "web3";
import Config from "/utils/config";
import nft from "/utils/abis/item.json";
import AvatarDetail from "/components/avatars/avatar-detail";

const data = {
  nft: [
    {
      tokenId: 1,
    },
    {
      tokenId: 2,
    },
    {
      tokenId: 3,
    },
    {
      tokenId: 4,
    },
    {
      tokenId: 5,
    },
  ],
};

const web3 = new Web3(
  Web3.givenProvider || "https://data-seed-prebsc-1-s1.binance.org:8545"
);
const nftContract = new web3.eth.Contract(nft, Config.ItemAddress);

const ListCollection = (props) => {
  const price = new Intl.NumberFormat("en-EN").format(props.price);
  return (
    <div>
      <div className="relative">
        <div className="relative w-full h-72 rounded-lg overflow-hidden">
          <img
            src={props.image}
            alt="Front of zip tote bag with white canvas, black canvas straps and handle, and black zipper pulls."
            className="w-full h-full object-center object-cover"
          />
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">{props.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{props.description}</p>
          </div>
          <p className="text-5xl font-medium text-gray-400">{props.amount}</p>
        </div>
        <div className="absolute top-0 inset-x-0 h-72 rounded-lg p-4 flex items-end justify-end overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"></div>
          <p className="relative text-lg font-semibold text-white">{price}</p>
        </div>
      </div>
    </div>
  );
};

class AvatarModal extends Component {
  constructor(props) {
    super(props);
    this.state = { account: "", collection: [] };
  }

  async componentDidMount() {
    await this.loadRewardCollection();
  }

  async loadRewardCollection() {
    const _collectionUrl = await nftContract.methods.getBaseUrl().call();

    const _index = async (tokenId) => {
      return await nftContract.methods.nftIndex(tokenId).call();
    };

    const _item = async (tokenId) => {
      return await nftContract.methods.nftAmount(tokenId).call();
    };

    const _reward = this.props.collection;

    const _arrItem = _reward;

    const _data = _arrItem.map(async (item) => {
      const _id = await _index(item);
      const _count = await _item(item);
      const _metadata = await this.getCollectionMetadata(_collectionUrl, _id);

      return [_id, _count, _metadata];
    });

    const _collection = await Promise.all(_data);

    this.setState({ collection: _collection });
  }

  async getCollectionMetadata(url, item) {
    const _url = `${url}/${item}.json`;
    const _res = await fetch(_url);
    const json = await _res.json();
    return json;
  }
  onClose = (event) => {
    this.props.onClose && this.props.onClose(event);
  };

  render() {
    const collection = this.state.collection;
    if (!this.props.show) {
      return null;
    }
    return (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
            &#8203;
          </span>
          <div className="modal-global-size transform transition-all">
            <div className="hidden close-modal">
              <button
                type="button"
                onClick={() => this.onClose()}
                className="close-modal-text"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-8 w-8"
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
            <div className="bg-modal">
              <div className="bg-modal-warpper max-w-3xl mx-auto px-4 sm:py-5 sm:px-6 lg:max-w-7xl lg:px-8 m-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-4 gap-y-6">
                  {data.nft.map((item, itemKey) => {
                    return <AvatarDetail data={item} />;
                  })}
                </div>

                <div className="flex justify-center mt-3">
                  <button
                    onClick={() => this.onClose()}
                    type="button"
                    className="btn-theme btn-primary"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AvatarModal;
