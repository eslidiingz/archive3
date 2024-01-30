import Link from "next/link";

const Lab = (props) => {
    return (
  
      <>
        <div className="lab flex flex-row px-4 py-4 xl:px-6 xl:py-6 grid grid-cols-4 gap-3 md:gap-6 lg:gap-4 rounded-xl lg:rounded-3xl my-3 lg:my-6 ">
            <div className="mx-auto">
                <img alt="lab1" className="img-lab" src={props.src} />
            </div>
            <div className="flex flex-col col-span-2 my-auto text-center md:text-left">
                <div className="f-lap-title color-dark">
                    {props.title}
                </div>
                <h5 className="f-space2 color-dark hidden md:block">
                    {props.detail}
                </h5>
            </div>
            <div className="my-auto ml-auto pr-10 hidden lg:block">
                <Link href={props.href}>
                    <button type="button" className=" px-6 md:px-3 py-2 xl:px-4 text-base font-medium text-white bg-btn-dark2 ">
                        Go to Lab
                    </button>
                </Link>
            </div>
            <div className="my-auto ml-auto lg:hidden">
                <Link href={props.href}>
                    <img className="next" alt="next" src={"/assets/image/icon/next.svg"} />
                </Link>
            </div>
        </div>
      </>
    );
  };
  
  export default Lab;
  