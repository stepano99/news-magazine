import {useRouter} from 'next/router';

function Footer() {
  return (
    <>
        {/* <div className="fixed w-full bottom-0 left-0 bg-gray-500"> */}
        <div className=" bottom-0 left-0 w-full   bg-gray-500">
            <div className="max-w-2xl mx-auto text-white py-10">
                <div className="text-center">
                    <h3 className="text-3xl mb-3"> Stay up to date. All day, every day! </h3>
                    <div className="flex justify-center my-7">
                        <div className="flex items-center border w-auto rounded-lg px-4 py-2 mx-2">
                            <img src="https://7code.ro/playground_assets/logo7code%201.svg" className="md:w-8"/>
                            <div className="text-left ml-3 pl-3">
                                <p className="text-sm md:text-base">
                                    <a href="https://7code.ro/">AboutUs</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
               
            </div>
        </div>
    </>
  )
}

export default Footer