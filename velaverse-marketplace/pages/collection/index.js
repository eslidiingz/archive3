import { useState, useEffect } from "react";
import Link from "next/link";
import CardCollection from "../../components/collections/card-collection";

const Profile = () => {
  const allList = [
    "0x0000001",
    "0x0000002",
    "0x0000003",
    "0x0000004",
    "0x0000005",
  ];
  return (
    <>
      <main className="content">
        <div className="relative z-10 flex items-baseline justify-between pt-12 pb-6 border-b border-gray-200 mb-4">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Collection List
          </h1>
        </div>

        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-6">
            {allList.map((item, index) => {
              return (
                <Link href={`collection/${item}`}>
                  <div
                    key={index}
                    className="card flex flex-col justify-between"
                  >
                    <div className="card-body p-2">
                      <CardCollection meta={item} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
};

export default Profile;
