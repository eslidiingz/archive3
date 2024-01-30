export default function InputLogin(props) {

  return (
    <>
      <div className="grid gap-1 font-DBAiry">
          <label className="text-[#3B726A] font-bold text-left Font-16-24">{props.title}</label>
          <div className="text-left">
            <div className="input-unset w-full bg-[#384753] rounded-md">
              <input className="text-white font-semibold w-full Font-16-24" type={props.type} placeholder={props.placeholder} />   
            </div>
            <small className="text-[#C84850]  Font-14-16">{props.texterror}</small>
          </div>
      </div>
    </>
  )
}
