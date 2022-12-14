import * as React from 'react';
import ArticleDetails from '../../../components/article/ArticleDetails'
import {useRouter} from 'next/router'
import requests from '../../../utils/requests'
import { parseCookies } from "../../../utils/index";

function Article({article, jwtToken}) {

  return (
     <ArticleDetails article={article} jwtToken={jwtToken}/>        
  );
}


export async function getServerSideProps(context){
  const articleId = context.query.articleId
  const response = await fetch(requests.fetchOneArticle + articleId)
  const article = await response.json()

  const {req, res} = context
    const cookie = parseCookies(req)

    if (res) {
        if (Object.keys(cookie).length === 0 && cookie.constructor === Object) {
          res.writeHead(301, { Location: "/" })
          res.end()
        }
    }

    const jwtToken = cookie.Bearer;

  return {
    props: {
      article,
      jwtToken
    }
  }
}


export default Article