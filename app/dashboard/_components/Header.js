import React from 'react'
import { UserButton } from '@clerk/nextjs'
const Header = () => {
    return (
        <div className=' flex justify-end p-5 shadow-lg '>
            <UserButton />
        </div>
    )
}

export default Header