import Link from "next/link";
import React from "react";

export const ToastDisplay = (props) => {
  const btnStyle =
    props.type === "process"
      ? "text-gray-600"
      : props.type === "success"
      ? "text-green-600"
      : "text-red-600";

  return (
    <>
      <div className="md:flex md:items-center md:justify-between md:space-x-5">
        <div className="flex items-start space-x-5">
          <div className="pt-1.5">
            <h1 className={`text-md font-bold ${btnStyle}`}>{props.title}</h1>
            <p className="text-sm font-medium text-gray-500">
              {props.description}
            </p>
            {props.href && (
              <Link href={props.href}>
                <a
                  target="_blank"
                  className={`text-bold text-sm ${
                    props.type === "success"
                      ? "text-green-300"
                      : "text-gray-300"
                  } `}
                >
                  View on EtherScan
                </a>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
