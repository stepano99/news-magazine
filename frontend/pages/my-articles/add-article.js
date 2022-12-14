import {useState, useEffect, useRef} from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import {useRouter} from 'next/router'
import { parseCookies } from "../../utils/index"

function AddArticle({data}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [file, setFile] = useState(null)
    const fileUploadRef = useRef(null);
    const toast = useRef(null);
    const [message, setMessage] = useState('');
    const router = useRouter()

    const authorization = `Bearer   ${data.Bearer}`

    const categories = [
        { name: 'Politics' },
        { name: 'Sport' },
        { name: 'Events' },
        { name: 'News' },
    ];

    const onCityChange = (e) => {
        setSelectedCategory(e.value);
    }

    const myUploader = (event) => {
        toast.current.show({severity: 'success', summary: 'Success', detail: `File has been uploaded`});
        setFile(event.files[0]);
    }

    const chooseOptions = {icon: 'pi pi-fw pi-cloud-upload', iconOnly: false, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined'}
    const uploadOptions = {label: '', icon: 'pi pi-upload', className: 'p-button-success'};
    const chooseOptions2 = {icon: 'pi pi-fw pi-images', iconOnly: false, className: 'custom-choose-btn p-button-rounded p-button-outlined'};

    const submitForm = async () => {

        const formData = new FormData()
        formData.set("file", file);
        formData.set("title", title);
        formData.set("description", description);
        formData.set("category", selectedCategory.name.toLowerCase());

        const apiRespone = await fetch('http://localhost:3000/api/feed',{
            body: formData,
            method: 'POST',
            headers: {
                "Authorization": authorization
            }
        })
        const resp = await apiRespone.json();
        console.log('Response => ', resp);

        setTimeout(() => {
            // router.push(`/home/${resp._id}`)
            router.push(`/home`)
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
            )}
            <h1 className="mt-10  text-center font-monospace pt-10 pb-10">Show your best self!</h1>
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
                            maxFileSize={1000000} 
                            customUpload 
                            uploadHandler={myUploader} 
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

AddArticle.getInitialProps = async  (context) => {
    const data = parseCookies(context.req)

    if (context.res) {
        if (Object.keys(data).length === 0 && data.constructor === Object) {
          res.writeHead(301, { Location: "/" })
          res.end()
        }
    }
    
      return {
        // data,
        data: data && data,
      }
    
}

export default AddArticle