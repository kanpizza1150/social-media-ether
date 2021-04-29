import React from 'react'
import './App.scss'
import ProfileImage from './ProfileImage'
const Navbar = ({account}) => {
    return (
        <div className='nav'>
        <h4>My first Dapp!</h4>
        <div>
            {account}
          {account!==''&&  <ProfileImage account={account}/>}
            </div>
      </div>
    )
}
export default Navbar