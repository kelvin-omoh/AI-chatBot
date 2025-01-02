import React from 'react'
import Sidebar from './_components/Sidebar'
import Header from './_components/Header'
const layout = ({ children }) => {

    return (
        <div className='flex'>
            <div className='md:w-64 h-screen fixed'>
                <Sidebar />
            </div>
            <div className='ml-64 flex-1'>
                <Header />
                <div className='h-screen  overflow-y-scroll' style={{ background: 'linear-gradient(to bottom, #f8f9fa, white)' }}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default layout