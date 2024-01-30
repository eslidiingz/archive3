import { useCallback, useEffect, useState } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Tabs = (props) => {
  let [data, setData] = useState(props.tabs);

  useEffect(() => {
    setData(props.tabs);
  }, [props.tabs]);

  return (
    <>
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            name="tabs"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            defaultValue={data.find((tab) => tab.current).name}
          >
            {data.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>

        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {data.map((tab, index) => (
                <a
                  key={tab.name}
                  className={classNames(
                    tab.current ? "active" : "",
                    "tab-item whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm cursor-pointer"
                  )}
                  aria-current={tab.current ? "page" : undefined}
                  onClick={(e) => props.tabActive(index)}
                >
                  {tab.name}
                  {tab.count ? (
                    <span
                      className={classNames(
                        tab.current ? "active" : "",
                        "badge hidden ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block"
                      )}
                    >
                      {tab.count}
                    </span>
                  ) : null}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Tabs Content Slot */}
        {props.children}
      </div>
    </>
  );
};

export default Tabs;
