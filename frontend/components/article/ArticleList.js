import React from 'react'
import ArticleItem from '../article/ArticleItem'
import { useRouter } from 'next/router';


function ArticleList({ articles, linkCategory}) {

  const router = useRouter();


  return (
    <div className="container flex-col space-x-2 px-10 mx-auto   md:flex md:items-center lg:-mx-6 lg:flex lg:items-center">
      {articles && articles.map((article) => (
        <ArticleItem 
          key={article._id} 
          article={article} 
          linkCategory={linkCategory}
          className="mt-5"
        />        
      ))}
    </div>
  )
}

export default ArticleList