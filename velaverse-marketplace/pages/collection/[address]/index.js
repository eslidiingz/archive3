import { useState, useEffect } from "react";

import CardCollectionDetail from "/components/collections/card-collection-detail";
const data = [
  {
    title: "",
    description: "",
    address: "0x000000001",
    nft: [
      {
        tokenId: 1,
        amount: 20,
        metadata: {
          type: "1155",
        },
      },
      {
        tokenId: 5,
        amount: 1,
        metadata: {
          type: "1155",
        },
      },
      {
        tokenId: 10,
        amount: 2,
        metadata: {
          type: "1155",
        },
      },
    ],
  },
  {
    title: "Test Collection Name",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in purus pharetra, fermentum dolor vitae, faucibus tellus. Nullam at aliquam erat, sed dignissim nibh. Donec ultricies ex ut scelerisque ornare. Integer fringilla consectetur varius. Phasellus scelerisque odio id risus euismod porta. Mauris pellentesque enim at tellus dapibus",
    address: "0x000000002",
    nft: [
      {
        tokenId: 3,
        amount: 1,
        metadata: {
          type: "721",
        },
      },
      {
        tokenId: 17,
        amount: 1,
        metadata: {
          type: "721",
        },
      },
      {
        tokenId: 22,
        amount: 1,
        metadata: {
          type: "721",
        },
      },
      {
        tokenId: 26,
        amount: 1,
        metadata: {
          type: "721",
        },
      },
      {
        tokenId: 27,
        amount: 1,
        metadata: {
          type: "721",
        },
      },
      {
        tokenId: 330,
        amount: 1,
        metadata: {
          type: "721",
        },
      },
    ],
  },
];
const CollectionDetail = () => {
  return (
    <>
      <main className="content">
        <div className="relative z-10 flex items-baseline justify-between pt-12 pb-6 border-b border-gray-200 mb-4">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Collection Name
          </h1>
          <p className="text-gray-500">Address 0x0000000000000000</p>
        </div>
        <div>
          {data.map((value, key) => {
            return (
              <div className="mb-8">
                <div className="bg-white rounded-lg p-4 shadow-xl mb-2">
                  <h2 className="text-xl">
                    {value.title
                      ? value.title + " (" + value.address + ")"
                      : value.address}
                  </h2>
                  <p className="text-sm">{value.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xxl:grid-cols-6 gap-x-4 gap-y-6">
                  {value.nft.map((item, itemKey) => {
                    return <CardCollectionDetail data={item} />;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
};

export default CollectionDetail;
