import Link from "next/link";

const gashapon = () => {
  return (
    <>
      <div className="content">
        <h1 className="title">Gashapon</h1>
      </div>

      <div className="grid grid-cols-2 space-x-2">
        <Link href="/gashapon/avatar" className="cursor-pointer">
          <div className="gasha-avatar">
          </div>
        </Link>

        <Link href="/gashapon/item" className="cursor-pointer">
          <div className="gasha-itembox bg-black">
            item box
          </div>
        </Link>
      </div>
    </>
  );
};

export default gashapon;
