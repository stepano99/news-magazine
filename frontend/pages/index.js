import Head from 'next/head'
import Button from '@mui/material/Button';
import  Navbar from '../components/Navbar'
import ArticleList from '../components/article/ArticleList.js';
import requests from '../utils/requests';


export default function Home() {
  
  return (
    <div >
    <Head>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
    </Head>
      <div className="flex flex-row space-y-2 py-16 md:space-y-4 lg:h-[65vh] lg:justify-center lg:pb-12">
        <h4 className="absolute top-200 text-4xl font-bold ">Welcome to <span className="text-5xl font-mono">7CodeNews</span></h4>
      </div>     
      
    </div>
  )
}
