import React, { useEffect, useRef, useState } from 'react';
import { Messages } from 'primereact/messages';
import { Message } from 'primereact/message';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { useCookies } from "react-cookie"
import  {useRouter} from 'next/router'
import jwt from 'jsonwebtoken';


function Register() {
    const [cookie, setCookie] = useCookies(["Bearer"])

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [file, setFile] = useState(null)

    const fileUploadRef = useRef(null);
    const toast = useRef(null);

    const router = useRouter()

    const myUploader = (event) => {
        toast.current.show({severity: 'success', summary: 'Success', detail: `File has been uploaded`});
        setFile(event.files[0]);
    }
    const chooseOptions = {icon: 'pi pi-fw pi-cloud-upload', iconOnly: false, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined'};
    const uploadOptions = {label: '', icon: 'pi pi-upload', className: 'p-button-success'};
    const chooseOptions2 = {icon: 'pi pi-fw pi-images', iconOnly: false, className: 'custom-choose-btn p-button-rounded p-button-outlined'};

    const submitForm = async () => {
        event.preventDefault();
        
        const formData = new FormData()
        formData.set("file", file);
        formData.set("email", email);
        formData.set("password", password);
        console.log(formData);
        const res = await fetch(`http://localhost:3000/api/auth/register`, {
            method: 'POST',
            body: formData
        }).then(response => response.json())

        console.log('Register response',res)

        const token = res.access_token

        if(token){
            const json = await  jwt.decode(token)
            setMessage(`Welcome, ${json.email}, you account has been successfully created!`);
            setCookie('Bearer', token, {path: '/', maxAge: 3600, sameSite: true});
            setIsLoggedIn(!isLoggedIn);
        } else  if(res.statusCode === 400  ){
            if( Array.isArray(res.message)){
                setMessage(res.message.map((e,index) => (<li key={index}>*{e}!</li>)))
            } else {
                setMessage((<li>*{res.message}!</li>))
            }  
        } 
    }
    
  return (
    <>
        <main className="mx-auto flex min-h-screen w-full  justify-center bg-gray-900 text-white">
            <Toast ref={toast}></Toast>      
            <section className="flex w-[30rem] flex-col mt-20 space-y-10">        
                {(isLoggedIn) && (
                    <div className="text-center text-3xl font-medium text-white-500 mt-10">
                    <ul className="pt-20">{message}</ul>
                    <div className="mt-10 mb-5  text-center font-monospace ">
                        <Button label="Submit" className="p-button-success" icon="pi pi-plus" label="Create Your First Article!" 
                            onClick={() => router.push('/my-articles/add-article')}
                        />
                    </div>
                </div>
                )}
                {(!isLoggedIn) && (
                <>
                    <div className="text-center text-4xl font-medium"
                        >Register
                    </div>
                    <div className="text-center text-10x font-medium text-red-400">
                        <ul>{message}</ul>
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

                    <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
                            name="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="text-center ">
                        <span className=" w-full p-float-label">
                        {!file ? (
                            <FileUpload 
                            mode="basic" 
                            name="file" 
                            url="." 
                            chooseOptions={chooseOptions}
                            uploadOptions={uploadOptions}
                            accept="image/*" 
                            maxFileSize={1000000} 
                            customUpload 
                            uploadHandler={myUploader} 
                            // onUpload={}
                            auto 
                            chooseLabel="Select an Image"   
                            />
                        ) : (
                            <FileUpload 
                            mode="basic" 
                            name="file" 
                            url="." 
                            chooseOptions={chooseOptions2}
                            uploadOptions={chooseOptions2}
                            // accept="image/*" 
                            // maxFileSize={1000000} 
                            // customUpload 
                            // uploadHandler={myUploader} 
                            // // onUpload={}
                            // auto 
                            chooseLabel={file.filename}  
                            />
                        )}
                        
                    </span>
                    </div>

                    <button
                        className="transform rounded-sm bg-indigo-600 py-2 font-bold duration-300 hover:bg-indigo-400"
                        onClick={submitForm}
                        >Create Account
                    </button>
                </>
                )}
            </section>
        </main>
    </>
  )
}

export default Register