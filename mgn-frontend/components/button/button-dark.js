const ButtonDark = (props) => {
  return (

    <>
      <button
        type="button"
        className="flex md:justify-start md:justify-center px-6 md:px-3 py-2 xl:px-4 border border-transparent shadow-sm text-base font-medium text-white bg-btn-dark w-full xl:w-40"
      >
        <div>
          <img className={props.classIcon} src={props.src} />
        </div>
        <div>
          {props.text}
        </div>
      </button>
    </>
  );
};

export default ButtonDark;

