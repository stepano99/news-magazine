import {useState, useEffect, useRef} from 'react';
import jwt from 'jsonwebtoken';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import {useRouter} from 'next/router'
import { parseCookies } from "../../../utils/index"

function EditUser({inUser, token}) {


    const [email, setEmail] = useState(`${inUser.email}`);
    const [selectedRoles, setSelectedRoles] = useState({name: inUser.roles});
    const [file, setFile] = useState(null)
    const fileUploadRef = useRef(null);
    const toast = useRef(null);
    const [message, setMessage] = useState('');
    const router = useRouter()

    const roles = [
        { name: 'admin' },
        { name: 'user' },
    ];
    const onCityChange = (e) => {
        setSelectedRoles(e.value);
    }

    const myUploader = (event) => {
        toast.current.show({severity: 'success', summary: 'Success', detail: `File has been uploaded`, life: 3000});
        setFile(event.files[0]);
    }

    const chooseOptions = {icon: 'pi pi-fw pi-cloud-upload', iconOnly: false, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined'}
    const chooseOptions2 = {icon: 'pi pi-fw pi-images', iconOnly: false, className: 'custom-choose-btn p-button-rounded p-button-outlined'};
    const uploadOptions = {label: 'aaa', icon: 'pi pi-upload',iconOnly: false, className: 'p-button-success'};

    const submitForm = async () => {
        const formData = new FormData()
        console.log(token);
        
        formData.append("file", file);
        // formData.append("email", email);
        // formData.append("roles", selectedRoles.name.toLowerCase());
        // for (var value of formData) {
        //     console.log(value); 
        //  }

        const apiResponse = await fetch(`http://localhost:3000/api/auth/user-details`,{
            method: 'PATCH',    
            body: formData,
            headers: {
                "Authorization": token
            }
        }).then(response => response.json())

        if(apiResponse.statusCode === 400){
          setMessage(`${apiResponse.message}`)
        }

        console.log('Update Response => ', apiResponse);

        toast.current.show({severity: 'info', summary: 'Success', detail: `Your Profile, id=${apiResponse._id} was been successfully updated`});
        setTimeout(() => {
            router.push(`/account`)
        }, 2000)
            
      

        
    }

  return (
    <div>
    <Toast ref={toast}></Toast>
    <main className="mx-auto flex min-h-screen w-full  justify-center bg-gray-300 text-gray-800">
        <section className="flex w-[30rem] flex-col space-y-6">
            {(message.length !== 0) && (
                <div className="text-center text-xl font-medium text-red-400">
                    {message}
                </div>
                )
            }
            <div className="text-center text-4xl font-medium pt-20 pb-10 ">
            Edit your details
            </div>
                <span className="p-float-label">
                    <Dropdown id="role" value={selectedRoles} options={roles} onChange={onCityChange} optionLabel="name" placeholder="Select Role" />
                    <label htmlFor="role">Role</label>
                </span>
                <span className="p-float-label">
                    <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="email">email</label>
                </span>
                <div>
                    <span className="p-float-label">
                        {!file ? (
                            <FileUpload
                                mode="basic"
                                name="file"
                                url="."
                                chooseOptions={chooseOptions}
                                uploadOptions={uploadOptions}
                                accept="image/*"
                                maxFileSize={100000000}
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
                    {/*<span className="p-float-label">*/}
                    {/*    <FileUpload */}
                    {/*    mode="basic" */}
                    {/*    name="file" */}
                    {/*    url="." */}
                    {/*    chooseOptions={chooseOptions}*/}
                    {/*    uploadOptions={uploadOptions}*/}
                    {/*    accept="image/*" */}
                    {/*    maxFileSize={1000000} */}
                    {/*    customUpload */}
                    {/*    uploadHandler={myUploader} */}
                    {/*    auto */}
                    {/*    chooseLabel="Select an Image"   */}
                    {/*    />*/}
                    {/*</span>*/}
                </div>
                <div className="text-center">
                    <button
                        className=" w-1/4 text-center transform rounded-md  text-white bg-yellow-500 py-2 font-bold duration-300 hover:bg-yellow-400"
                        onClick={submitForm}
                        >Submit
                    </button>

                </div>    
                
        </section>
        </main>
        
    </div>
  )
}

export const getServerSideProps = async (context) => {
    const {req, res} = context
    const cookie = parseCookies(context.req)

    if (context.res) {
        if (Object.keys(cookie).length === 0 && cookie.constructor === Object) {
          res.writeHead(301, { Location: "/" })
          res.end()
        }
    }
    
    const response = await fetch("http://localhost:3000/api/auth/user-details", {
        method: 'GET',
        headers: { 
            'Authorization': "Bearer " + cookie.Bearer,
        }
    })
        .catch((error) => {
            console.error('Error:', error);
        });

    const inUser = await response.json()

    console.log('inUser', inUser)

    return {
        props:{ 
        inUser,
        token: "Bearer " + cookie.Bearer,
    }
    }

}

export default EditUser