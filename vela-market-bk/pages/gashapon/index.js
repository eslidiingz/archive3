import Link from "next/link";

const gashapon = () => {
  return (
    <>
      <div className="content">
        <h1 className="title">Gashapon</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 space-x-2">
        <Link href="/gashapon/avatar" className="cursor-pointer">
          <div className="bg-orange-400 h-48 flex justify-center items-center uppercase rounded shadow">
            <div className="flex text-center">
              avatar <br /> box
            </div>
          </div>
        </Link>

        <Link href="/gashapon/item">
          <div className="bg-green-400 h-48 flex justify-center items-center uppercase rounded shadow">
            <div className="flex text-center">
              item <br /> box
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default gashapon;
