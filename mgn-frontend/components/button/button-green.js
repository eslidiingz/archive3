const ButtonWhiteOutline = (props) => {
  return (

    <>
      <button
        type="button"
        className="flex  md:justify-center px-2 py-2 xl:px-4 text-base font-medium text-white text-center bg-btn-w-outline"
      >
          {props.text}
      </button>
    </>
  );
};

export default ButtonWhiteOutline;

