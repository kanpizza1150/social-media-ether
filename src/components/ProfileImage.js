import React from 'react'
import './App.scss'
import Identicon from 'identicon.js'

const ProfileImage = ({account},...props) => {
    return (
        <img  
            className='profile_img' 
            src={`data:image/png;base64,${new Identicon(account, 30).toString()}`} 
            width={30} 
            height={30}
            alt=''
        {...props}
    />
    )
}
export default ProfileImage