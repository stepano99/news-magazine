import * as React from 'react';
import ArticleDetails from '../../components/article/ArticleDetails'
import {useRouter} from 'next/router'
import requests from '../../utils/requests'

function Article({article}) {

    const router = useRouter();
    const articleId = router.query.articleId

  return (
     <ArticleDetails article={article} category={article.category} linkCategory='home'/>        
  );
}
export async function getServerSideProps(pageContext){

  const articleId = pageContext.query.articleId
  // console.log(articleId)

  const response = await fetch(requests.fetchOneArticle + articleId)
  const article = await response.json()

  // console.log(article)
  

  return {
    props: {
      article,
    }
  }
}


export default Article