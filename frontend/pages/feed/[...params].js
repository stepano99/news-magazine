import {useRouter} from 'next/router'
import {useState,  useEffect} from "react";
import ArticleList from '../../components/article/ArticleList'
import styles from "../../styles/Paginator.module.css"

function Feed({articles, category, pageNumber}) {
  // const [articles, setArticles] = useState(null)
  // const [isLoading, setLoading] = useState(false)
  const router = useRouter();
  //
  // useEffect(() => {
  //   setLoading(true)
  //   fetch(`http://localhost:3000/api/feed/category/${category}/page/${pageNumber}}`)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setData(data)
  //         setLoading(false)
  //       })
  // }, [pageNumber])

  return (
    <div>
      <div className="mt-10">
        
        {(articles)? (
          <>
            <h1 className="mt-10 mb-5  text-center font-monospace ">{category} articles</h1>
           
            <ArticleList
              articles={articles} 
              // linkCategory={`/feed/category/${category}/page/${pageNumber}`}
              linkCategory={`home`}
            />
            <div className={styles.paginator}>
              <div
                  className={pageNumber === 1 ? styles.disabled : styles.active}
                  onClick={() => {
                      if (pageNumber > 1) {
                          router.push(`/feed/category/${category}/page/${pageNumber - 1}`)
                      }
                  }}
              >
                  Previous Page
              </div>
              <div>#{pageNumber}</div>
              <div
                  className={( articles.length < (pageNumber)*10 ) ? styles.disabled : styles.active}
                  onClick={() => {
                    router.push(`/feed/category/${category}/page/${pageNumber + 1}`)
                  }}
              >
                  Next Page
              </div>
          </div>
          </>
          ) : (
            <h1 className="py-5 mt-161  text-center font-monospace ">Here are no {category} articles YET.</h1>
          ) }
        {/* <ArticleList title="Latest Articles" articles={articles}/> */}
      </div> 
      
    </div>
  )
}

export async function getServerSideProps(context){

  const {params = []} = context.query

  const category = params[1]
  const pageNumber = params[3]

  // console.log(params)
  const res = await fetch(`http://localhost:3000/api/feed/category/${category}/page/${pageNumber}`)

  const articles = await res.json();

  return {
    props: {
      articles,
      category,
      pageNumber: Number.parseInt(pageNumber)
    }
  }
}


export default Feed