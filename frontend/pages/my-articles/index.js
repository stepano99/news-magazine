import { useRouter } from 'next/router';
import { parseCookies } from "../../utils/index";
import { sortByCategory } from "../../utils/sortig-by-category";
import ArticleList from '../../components/article/ArticleList';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import {useEffect, useState} from 'react';

export default function MyArticles({articles}){
    const router = useRouter();
    const redirect = () => {
        router.push('/home')
    }

    const countCategory =  sortByCategory(articles)
    const {politics, sport, news, events, total} = countCategory

    const [chartData] = useState({
        labels: ['Politics', 'Sport', 'News', 'Events'],
        datasets: [
            {
                data: [politics, sport, news, events],
                backgroundColor: [
                    "#F59E0B",
                    "#10B981",
                    "#06B6D4",
                    '#8B5CFF',
                    
                ],
                hoverBackgroundColor: [
                    "#F59E0B",
                    "#10B981",
                    "#06B6D4",
                    '#8B5CFF',
                ]
            }]
    });
    const [lightOptions] = useState({
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        }
    });
    return (
        <div className="flex">
            <div className="fixed top-20  left-20  card mr-0 w-1/5 text-center">
                <h1 className="mt-10  text-center font-monospace ">My Articles </h1>
                <p className=" mb-4 text-2xl">Total: <span className=" text-3xl text-cyan-700">{total}</span></p>

                {(total > 0) && (
                    <Chart type="doughnut" data={chartData} options={lightOptions} style={{ position: 'relative', width: '100%' }} />
                )}
            </div>

            <div className="h-full mt-10 z-0 hover:z-0 w-full">
                <div className="mt-10 mb-5  text-center font-monospace ">
                    <Button
                        abel="Submit"
                        className={(total<1) ? "mt-52": ''}

                        icon="pi pi-plus-circle"
                        label="Create One!"
                        onClick={() => router.push('/my-articles/add-article')}
                    />
                </div>
                <ArticleList title="" articles={articles} linkCategory={'my-articles'}/>
            </div>     
        </div>
    )
}
// MyArticles.getInitialProps = async (context) => {
// export const getServerSideProps = async (context) => {
MyArticles.getInitialProps = async (context) => {
    const {req, res} = context
    const cookie = parseCookies(req)

    if (res) {
        if (Object.keys(cookie).length === 0 && cookie.constructor === Object) {
            res.writeHead(301, { Location: "/" })
            res.end()
        }
    }
    const authorization = `Bearer ${cookie.Bearer}`

    const resp = await fetch('http://localhost:3000/api/feed/user', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": authorization
        }
    })

    const articles = await resp.json()
    // console.log('my-articles' , articles);

    return {
        // props: {
            articles,
            cookie
        // }
    }
}

