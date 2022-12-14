import Head from 'next/head'
import ArticleList from '../../components/article/ArticleList.js';
import requests from '../../utils/requests';


export default function Home({latest}) {
  
  return (
    <div >
      {/* <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head> */}
        <div className="mt-10">
          <h1 className="mt-10 mb-5  text-center font-monospace ">Latest 10 articles</h1>
          <ArticleList title="Latest Articles" articles={latest} linkCategory={'home'}/>
        </div>     
    </div>
  )
}

export async function getServerSideProps(){
  const response = await fetch(requests.fetchLatest)
  const latest = await response.json()

  // console.log('Latest=> ', latest)
  

  return {
    props: {
      latest,
    }
  }
}
