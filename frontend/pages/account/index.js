import {useState, useEffect} from 'react'
import { Chart } from 'primereact/chart';
import { Knob } from 'primereact/knob';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';
import { parseCookies } from "../../utils/index"


const Account = ({inUser}) => {
    const [usersCount, setUsersCount] = useState(50);
    const router = useRouter()
    const [profileImage, setProfileImage] = useState('https://scontent-otp1-1.xx.fbcdn.net/v/t39.30808-6/311113919_1712147702497178_5745177373379204450_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=I-9I8xq-9_wAX-I3QP6&_nc_ht=scontent-otp1-1.xx&oh=00_AfDWvNO9PXqWR1ai1hZCpbGGDJ30Qv3P__kngLpwN9KZQA&oe=6398B312')

    const [chartData] = useState({
        labels: ['Politics', 'Sport', 'News', 'Events'],
        datasets: [
            {
                data: [200, 50, 100, 20],
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

    
    console.log(inUser.profileImage)
    

  return (
    <>
        <div className="ml-[-100%]  top-0 pb-3 px-6 w-full flex flex-col justify-between h-screen border-r bg-white transition duration-300 md:w-4/12 lg:ml-0 lg:w-[25%] xl:w-[20%] 2xl:w-[15%]">
            <div>
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
                        onClick={() => router.push('/account/edit')}
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
    </div>
    </>
    
    
  )
}
export default Account

Account.getInitialProps = async (context) => {
    const {req, res} = context
    const cookie = parseCookies(context.req)

    if (context.res) {
        if (Object.keys(cookie).length === 0 && cookie.constructor === Object) {
          res.writeHead(301, { Location: "/" })
          res.end()
        }
    }
    const response = await fetch("http://localhost:3000/api/auth/user-details", {
        method: 'GET',
        headers: { 
            'Authorization': "Bearer" + " " + cookie.Bearer,
        }
    })

    const inUser = await response.json()

    console.log('inUser', inUser)

    return {
        // props:{ 
        inUser,
        // token: "Bearer " + cookie.Bearer,
    // }
    }

}
