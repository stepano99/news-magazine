import {useState, useRef} from 'react'
import {useRouter} from 'next/router';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

function ArticleDetails({article, jwtToken}) {
  const router = useRouter()
  const [isDeleted, setIsDeleted] = useState(false)
  const toast = useRef(null);
  const [message, setMessage] = useState('')

  if(!jwtToken){
    jwtToken = 'here is no token'
  }
  const handleDelete = async () => {
    const res = await fetch(`http://localhost:3000/api/feed/${article._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + jwtToken,
      }, body: null
    })
    const data = await res.json()
    toast.current.show({severity: 'success', summary: 'Success', detail: `Article with id=${data._id} was been successfully deleted`});
    
    setTimeout(() => {
      router.push('/my-articles')
    }, 2000)

    setIsDeleted(!isDeleted)
    console.log(data)

  }

  let color = ''
  switch(article.category) {
    case 'politics':
      color = 'text-white bg-amber-500';
      break;
    case 'sport':
      color = 'bg-emerald-500';
      break;
    case 'news':
      color = 'bg-sky-500';
      break;
    default:
      color = 'bg-rose-500';
  }


  const getActiveLink = (link) =>{
    return router.asPath.includes(link)
  }

  const redirect = (category) => {
    setTimeout(() => {
      router.push('/feed/category/' + category + '/page/1')
    }, "1000")
  }

  return (
      <section className="bg-white">
      <Toast ref={toast}></Toast>
        <div className="container px-10 py-10">
          {!isDeleted ? (
            <div className="mt-8 md:-mx-3 md:flex md:items-center lg:-mx-6 lg:flex lg:items-center">
              <img className="object-cover w-3/4 h-100 lg:mx-6 lg:w-1/2 rounded-xl  lg:h-96" 
                src={`http://localhost:3000/api/feed/image/${article.image}`}
                alt="">
              </img>

              <div className=" mt-6 md:w-1/2 md:mt-0 md:mx-4 lg:w-1/2 lg:mt-0 lg:mx-6 ">
                  <a href={`/feed/category/${article.category}/page/1`}>
                    <span className={`absolute  right-[220px] text-sm font-semibold inline-block py-3 px-3  
                      rounded-full text-white ${color} uppercase last:mr-0 mr-1`}>
                      {article.category}
                    </span>
                  </a>
                  <h1 className="py-2 break-all max-w-sm text-3xl font-semibold text-gray-800 capitalize md:text-3xl lg:text-4xl dark:text-black">
                    {article.title}
                  </h1>

                <h1 className="text-sm text-gray-900 dark:text-gray-600">views: <span className="text-cyan-700">{article.views}</span></h1>

                  <div className="flex h-2/4 w-3/4 text-center">
                    <div className="break-all text-center text-sm  mx-30 mt-8 ">
                        {article.description}
                    </div>
                  </div>
                  <div className="flex items-center mt-6">
                      <img className="object-cover object-center w-10 h-10 rounded-full"
                           src={ (article.author.profileImage !== '') ? `http://localhost:3000/api/auth/user-details/image/${article.author.profileImage}`:
                               "https://images.unsplash.com/photo-1531590878845-12627191e687?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80"
                           }
                            alt="">
                      </img>

                      <div className="mx-4">
                          <h1 className="text-sm text-gray-900 dark:text-gray-600">{article?.author?.email}</h1>
                          <p className="text-sm text-gray-900 dark:text-gray-400">{article?.author?.roles}</p>
                      </div>
                      {getActiveLink('my-articles') && (
                        <div className="mx-4">
                          <Button icon="pi pi-pencil" className="px-4 p-button-rounded p-button-info p-button-text" aria-label="Edit" 
                            onClick={ () =>  router.push(`/my-articles/${article._id}/edit`)}
                          />
                          <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" aria-label="Delete" 
                            onClick={handleDelete}
                          />
                        </div>
                      )}
                  </div>
              </div>
          </div>
          ) : (

            <h1 className="w-1/2 mt-10 mb-5  text-center font-monospace">{message}</h1>
          )}
          
        </div>
      </section>
  );
}

export default ArticleDetails
