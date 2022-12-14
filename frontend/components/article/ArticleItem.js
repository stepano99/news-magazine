import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { Button } from 'primereact/button';
import {useRouter} from 'next/router'

function ArticleItem({article, linkCategory}) {
  const router = useRouter()

  let color = ''
  switch(article.category) {
    case 'politics':
      color = 'text-white bg-amber-500';
      break;
    case 'sport':
      color = 'bg-emerald-500';
      break;
    case 'news':
      color = 'bg-cyan-500';
      break;
    default:
      color = 'bg-violet-500';
  }


  let link = ''
  switch(linkCategory) {
    case 'home':
      link = `/home/${article._id}`;
      break;
    case 'my-articles':
      link = `/my-articles/${article._id}`;
      break;
    default:
      link = '';
  }


  return (
    <div className="mt-6 mb-4 w-2/6"
      onClick={() => router.push(link)}
    >
      <Card >
      <CardActionArea>
        <CardMedia
          component="img"
          src={`http://localhost:3000/api/feed/image/${article.image}`}
          alt="article-image"
        />
        <CardContent>
          <div className="flex flex-wrap">
            <div className="flex-none break-all max-w-xs">
              <Typography gutterBottom variant="h4" component="div" >
                {article.title}
              </Typography>
            </div>
            <span className={`absolute  right-[20px] text-sm font-semibold inline-block py-1 px-2  
                rounded-full text-white ${color} uppercase last:mr-0 mr-1`}>
               {article.category}
            </span>
            {/* <Button 
              label={article.category.toUpperCase()} 
              className={`absolute  right-[20px] p-button-rounded p-button-${color}`}
            /> */}
          </div>
          
          {/* <Typography variant="body2" color="text.secondary"> */}
    
            <div className="flex items-center mt-6">
              <img 
                className="object-cover object-center w-10 h-10 rounded-full" 
                src={ (article.author.profileImage !== '') ? `http://localhost:3000/api/auth/user-details/image/${article.author.profileImage}`:
                "https://images.unsplash.com/photo-1531590878845-12627191e687?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80" 
                }
                alt="Profile Image">
              </img>

              <div className="mx-4">
                  <h1 className="text-sm text-gray-900 dark:text-gray-600">{article.author.email}</h1>
                  <p className="text-sm text-gray-900 dark:text-gray-400">
                    {article.author.roles === 'admin' ? 'admin' : 'publisher'}
                  </p>
              </div>
            </div>
          {/* </Typography> */}
        </CardContent>
      </CardActionArea>
    </Card>
    </div>
    
  );
}

export default ArticleItem