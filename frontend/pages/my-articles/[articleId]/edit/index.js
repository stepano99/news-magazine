import React, {useState, useEffect, useRef} from 'react';

import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';

import {useRouter} from 'next/router'
import { parseCookies } from "../../../../utils/index"
import requests from '../../../../utils/requests';

function EditArticle({inArticle, cookie}) {


    const [title, setTitle] = useState(`${inArticle.title}`);
    const [description, setDescription] = useState(`${inArticle.description}`);
    const [selectedCategory, setSelectedCategory] = useState({name: inArticle.category});
    // const [file, setFile] = useState(inArticle.image)
    const [file, setFile] = useState(null)
    const fileUploadRef = useRef(null);
    const toast = useRef(null);
    const [message, setMessage] = useState('');
    const router = useRouter()

    const authorization = `Bearer   ${cookie.Bearer}`

    const categories = [
        { name: 'politics' },
        { name: 'sport' },
        { name: 'events' },
        { name: 'news' },
    ];

    // useEffect(() => {
    //     setCount(count+1);
    // },[description])

    const onCityChange = (e) => {
        setSelectedCategory(e.value);
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


        formData.append("file", file);
        formData.append("title", title);
        formData.append("description", description);
        // formData.set("category", selectedCategory.name.toLowerCase());
        // for(var item of formData){
        //     console.log(item)
        // }

        const apiRespone = await fetch(`http://localhost:3000/api/feed/edit-article/${inArticle._id}`,{
            body: formData,
            method: 'PATCH',
            headers: {
                "Authorization": authorization
            }
        })
        const resp = await apiRespone.json();
        if(resp.statusCode === 403){
          setMessage(`${resp.message}`)
        }

        console.log('Response => ', resp);

            // router.push(`/home/${resp._id}`)
            toast.current.show({severity: 'info', summary: 'Success', detail: `Article with id=${resp._id} was been successfully updated`});
            setTimeout(() => {
            router.push(`/my-articles/${resp._id}`)
            // router.push(`/my-articles`)
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
            Edit the article
            </div>
                <span className="p-float-label">
                    <Dropdown  value={selectedCategory} options={categories} onChange={onCityChange} optionLabel="name" placeholder="Select Category" />
                    <label htmlFor="username">Category</label>
                </span>
                <span className="p-float-label">
                    <InputText id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <label htmlFor="title">Title</label>
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
                </div>
                

                <span className="p-float-label">
                    <InputTextarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} cols={60} />
                    <label htmlFor="description">Description * >= 500, your count = {`${description.length}`} </label>
                </span>
                
                

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

EditArticle.getInitialProps = async  (context) => {
  const articleId = context.query.articleId
//   console.log(articleId);  
  const cookie = parseCookies(context.req)
    // console.log(context)

    if (context.res) {
        if (Object.keys(cookie).length === 0 && cookie.constructor === Object) {
          res.writeHead(301, { Location: "/" })
          res.end()
        }
    }
    
  const response = await fetch(requests.fetchOneArticle + articleId)
  const inArticle = await response.json()
  // console.log(inArticle);
    
      return {
        // data,
        inArticle,
        cookie,
      }
    
}

export default EditArticle