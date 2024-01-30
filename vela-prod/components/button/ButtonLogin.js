export default function ButtonLogin(props) {

  return (
    <>
      <button className="p-2 lg:p-0  w-full btn-login rounded-lg mt-4" type={props.type}>
        <h4 className="uppercase text-black font-bold font-DBAiry text-center Font-20-36">{props.text}</h4>
      </button>
    </>
  )
}
