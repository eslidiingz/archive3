import { forwardRef } from "react";
import DatePicker from "react-datepicker";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { format } from "date-fns";

const ButtonInput = forwardRef(({ value, onClick }, ref) => (
  <>
    <button onClick={onClick} ref={ref} type="button" className="form-control-mgn">
      {format(new Date(value), "dd MMMM yyyy")}
    </button>
  </>
));

const CustomDatePicker = ({ onFunction, date, disabled = false }) => {
  return (
    <>
      <DatePicker
        selected={date}
        onChange={onFunction}
        disabled={disabled}
        selectsStart
        minDate={new Date().setDate(new Date().getDate() + 1)}
        nextMonthButtonLabel=">"
        previousMonthButtonLabel="<"
        popperClassName="datepicker-style"
        customInput={<ButtonInput />}
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="flex items-center justify-between px-2 py-2">
            <span className="text-lg text-gray-700">
              {format(date, "MMMM yyyy")}
            </span>

            <div className="space-x-2">
              <button
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                type="button"
                className={`${
                  prevMonthButtonDisabled && "cursor-not-allowed opacity-50"
                } inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500`}
              >
                <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
              </button>

              <button
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                type="button"
                className={`${
                  nextMonthButtonDisabled && "cursor-not-allowed opacity-50"
                } inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500`}
              >
                <ChevronRightIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      />
    </>
  );
};

export default CustomDatePicker;
