import React from 'react'
import './App.scss'
import Identicon from 'identicon.js'

const ProfileImage = ({ account }) => {
  return (
    <img
      className='profile_img'
      src={`data:image/png;base64,${new Identicon(account, 30).toString()}`}
      width={30}
      height={30}
      alt=''
    />
  )
}
export default ProfileImage
