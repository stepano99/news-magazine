import {useState, useEffect} from 'react'
import {useRouter} from "next/router";
import { Chart } from 'primereact/chart';
import { Knob } from 'primereact/knob';
import { Button } from 'primereact/button';
import {sortByCategory} from "../../utils/sortig-by-category";
import {parseCookies} from "../../utils";
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';


const Admin = ({articles, cookie, inUser, users, usersWeekAgo}) => {
    const router = useRouter()
    const [usersCount, setUsersCount] = useState();

    const countCategory = sortByCategory(articles)
    const {politics, sport, news, events, total, views} = countCategory

    const [chartData] = useState({
        labels: ['Politics', 'Sport', 'News', 'Events'],
        datasets: [
            {
                // data: [200, 50, 100, 20],
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

    const representativeBodyTemplate = (user) => {
        console.log(user.profileImage)
        return (
            <>
                <img
                    // alt={user.email}
                    src={"http://localhost:3000/api/auth/user-details/image/" + user.profileImage}
                    // src={"http://localhost:3000/api/auth/user-details/image/" + inUser.profileImage}
                     onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'}
                     width="32"
                    className="rounded-full mr-1"
                     // style={{ verticalAlign: 'middle' }}
                />
                <span className="image-text">{user.email}</span>
            </>
        )
    }

    

  return (
    <>
        <aside className="ml-[-100%] fixed z-10 top-0 pb-3 px-6 w-full flex flex-col justify-between h-screen border-r bg-white transition duration-300 md:w-4/12 lg:ml-0 lg:w-[25%] xl:w-[20%] 2xl:w-[15%]">
            <div>
                <div className="-mx-6 px-6 py-4">
                    <a href="#" title="home">
                        <img src="https://tailus.io/sources/blocks/stats-cards/preview/images/logo.svg" className="w-32" alt="tailus logo"/>
                    </a>
                </div>

                <div className="mt-8 text-center">
                    <img
                        className="rounded-full"
                        src={"http://localhost:3000/api/auth/user-details/image/" + inUser.profileImage}
                        alt="profile"
                    />
                    <h5 className="hidden mt-4 text-xl font-semibold text-gray-600 lg:block">{inUser.email}</h5>
                    <span className="hidden text-gray-400 lg:block">{inUser.roles}</span>
                </div>

                <ul className="space-y-2 tracking-wide mt-8">
                    <li>
                        <Button
                            className="relative px-4 py-3 flex items-center space-x-4 rounded-xl text-white bg-gradient-to-r from-sky-600 to-cyan-400"
                            label="Edit Details" icon="pi pi-user-edit"
                            onClick={ () => setTimeout(() => {
                                router.push('/account/edit')
                            }, 1000)}
                        />
                    </li>
                </ul>
            </div>

            <div className="px-6 -mx-6 pt-4 flex justify-between items-center border-t">
                <button className="px-4 py-3 flex items-center space-x-4 rounded-md text-gray-600 group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="group-hover:text-gray-700">Logout</span>
                </button>
            </div>
        </aside>

        <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%]">
            <div className="h-screen px-6 pt-6 2xl:container">
                <div className="grid gap-2 grid-cols-6 ">
                    <div className="col-span-2 " >
                        <div className="h-full  py-8 px-6 space-y-6   rounded-xl border border-gray-200 bg-white">
                            <div className="card">
                                <Chart type="doughnut" data={chartData} options={lightOptions}
                                    className="w-3/4 mx-auto"
                                />
                                <h5 className="text-xl text-gray-600 text-center">Total Articles</h5>
                                <div className="mt-2 flex justify-center gap-4">
                                    <h3 className="text-3xl font-bold text-gray-700">{total}</h3>
                                </div>
                                <span className="block  text-center text-gray-500">Total views <b>{views}</b></span>
                                <span className="block  text-center text-gray-500">Rating Average: <b>4.7</b></span>
                                <span className="block text-xs pb-20 text-center text-red-600">*available in the next version...</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-4">
                        <div className="h-full pt-5  rounded-xl border border-gray-200 bg-white text-center">
                            <h5 className="text-xl text-gray-700 mb-4"><b>Users</b></h5>
                            <div className="flex justify-center">
                                <Knob className="" size={220} value={users.length} valueColor={"SlateGray"} rangeColor={"MediumTurquoise"} readOnly/>
                            </div>
                            <div className="mt-6">
                                <div className="mt-2 flex justify-center gap-4">
                                    <h3 className="text-3xl font-bold text-gray-700">{usersCount}</h3>
                                    <div className="flex items-end gap-1 text-green-500">
                                        <svg className="w-4" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6.00001 0L12 8H-3.05176e-05L6.00001 0Z" fill="currentColor"/>
                                        </svg>
                                        <span>{(users.length - usersWeekAgo)*  100 / users.length  }%</span>
                                    </div>
                                </div>
                                <span className="block text-center text-gray-500">Compared to last week {usersWeekAgo}</span>
                                <div className="card "
                                     style={{ height: 'calc(100vh - 450px)' }}

                                >
                                     <DataTable className="flex justify-end" size="small" showGridlines value={users} scrollable scrollHeight="flex">
                                         <Column field="profileImage" header="#user" body={representativeBodyTemplate}></Column>
                                         <Column field="" header="" ></Column>
                                         <Column
                                             className="text-center"
                                             field="articlesNumber"
                                             header="posts">
                                         </Column>
                                         <Column field="avgRating" header="rating *"></Column>
                                     </DataTable>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}
export default Admin


Admin.getInitialProps = async (context) => {
    const {req, res} = context
    const cookie = parseCookies(req)

    if (res) {
        if (Object.keys(cookie).length === 0 && cookie.constructor === Object) {
            res.writeHead(301, { Location: "/" })
            res.end()
        }
    }
    const authorization = `Bearer ${cookie.Bearer}`

    const resp = await fetch('http://localhost:3000/api/feed/articles/all', {
        method: 'GET',
        // headers: {
        //     "Content-Type": "application/json",
        //     "Authorization": authorization
        // }
    })
    const articles = await resp.json()
    // console.log('my-articles' , articles);


    const user = await fetch("http://localhost:3000/api/auth/user-details", {
        method: 'GET',
        headers: {
            'Authorization': "Bearer" + " " + cookie.Bearer,
        }
    })
    const inUser = await user.json()

    const usersResp = await fetch("http://localhost:3000/api/auth/all-users")
    const users = await usersResp.json()
    const usersRespWeek = await fetch("http://localhost:3000/api/auth/all-users-week")
    const usersWeekAgo = await usersRespWeek.json()

    const newUsers = users.map(u => ({...u, articlesNumber: 3, avgRating: 4.2}))

    for(let i = 0; i < newUsers.length - 1; i++){
        for(let k = 0; k < articles.length - 1; k++){
            if(articles[k].author == newUsers[i]._id){
                newUsers[i].articlesNumber++
                console.log(newUsers[i].articlesNumber)
            }
        }
    }

    return {
        articles,
        cookie,
        inUser,
        users: newUsers,
        usersWeekAgo: users.length - usersWeekAgo
    }
}

