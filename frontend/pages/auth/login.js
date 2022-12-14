import {useState, useEffect} from 'react';
import jwt from 'jsonwebtoken';
import {useRouter} from 'next/router';
import { Button } from 'primereact/button';
import { useCookies } from "react-cookie"

function Login() {
    const [cookie, setCookie] = useCookies(["Bearer"])
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('You are not Logged in');
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const router = useRouter()


    const submitForm = async () => {
        event.preventDefault();
        
        const res = await fetch(`http://localhost:3000/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password})
        }).then(response => response.json())
        
        const token = res.access_token

        if(token){
            const jwtUser = await  jwt.decode(token)

            setCookie('Bearer', token, {path: '/', maxAge: 360000, sameSite: true});
         
            
            setTimeout(() => {
                setMessage(`Welcome, ${jwtUser.email}!`);
            }, "1000")

            setTimeout(() => {
                router.push('/home')
            }, "3000")

            
            setIsLoggedIn(!isLoggedIn);//only for template
        } else  if(res.statusCode === 400 && Array.isArray(res.message) ){
            setMessage(res.message.map((e,index) => (<li key={index}>{e}!</li>)))
        } else {
            setMessage((<li>{res.message}!</li>))
        }
    }

  return (
    <>
        <main className="mx-auto flex min-h-screen w-full  justify-center bg-gray-900 text-white">
        <section className="flex w-[30rem] flex-col mt-20 space-y-10">
            {(!Array.isArray(message) && message.charAt(0) ==="W")? (
                <div className="text-center text-3xl font-medium text-white-500 mt-20">
                    <div className="mt-10 mb-5  text-center font-monospace ">
                    </div>
                </div>
            ): (
                <>
                    <div className="text-center text-10x font-medium text-red-400">
                        <ul>{message}</ul>
                    </div>
                    <div className="text-center text-4xl font-medium">
                        Log In
                    </div>
                        <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
                        <input
                            type="text"
                            placeholder="Email"
                            className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
                            name="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        </div>

                        <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500" >
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
                                name="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            className="transform rounded-sm bg-indigo-600 py-2 font-bold duration-300 hover:bg-indigo-400"
                            onClick={submitForm}
                            >LOG IN
                        </button>

                        <a
                            href="#"
                            className="transform text-center font-semibold text-gray-500 duration-300 hover:text-gray-300"
                            >FORGOT PASSWORD?
                        </a>

                        <div className="text-center text-lg">
                            No account?
                            <a
                                href="/auth/register"
                                className="font-medium text-indigo-500 underline-offset-4 hover:underline"
                                >Create One
                            </a>
                        </div>
                </>
            )}
        </section>
        </main>
    </>
  )
}


export default Login