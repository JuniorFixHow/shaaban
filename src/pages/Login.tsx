import { Dispatch, SetStateAction, useState } from "react"

const Login = ({setHasLoggedIn}:{setHasLoggedIn:Dispatch<SetStateAction<boolean>>}) => {
    const [pwd, setPwd] = useState<string>('');
    const [error, setError] = useState<string>('');
    const handleLogin = ()=>{
        const pass = import.meta.env.VITE_PWD;
        if(pwd.trim()===''){
            setError('Enter passkey!')
        }else if(pwd !== pass){
            setError('Incorrect key')
        }else{
            setHasLoggedIn(true);
            setError('');
        }
    }
  return (
    <div className="w-full h-screen items-center justify-center flex flex-col gap-8" >
        <span className="text-3xl font-bold" >Welcome, Shaaban</span>
        <div className="flex bg-white rounded-lg shadow-xl flex-col gap-4 p-8 w-[20rem] h-[20rem]">
            <span className="text-2xl font-bold" >Security key</span>
            <input onChange={(e)=>setPwd(e.target.value)} className="border border-slate-400 outline-none px-2 py-1 rounded-md" required type="text" placeholder="enter security key" />
            {
                error &&
                <small className="text-red-600" >{error}</small>
            }
            <button onClick={handleLogin} type='button' className="bg-blue-600 hover:bg-blue-500 py-2 rounded-md text-white" >Proceed</button>
        </div>
    </div>
  )
}

export default Login