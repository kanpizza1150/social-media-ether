import React,{useState} from 'react'
import './App.scss'
import ProfileImage from './ProfileImage'

const Main = ({posts,postCount,sendTip,createPost,message}) => {
    const [content, setContent] = useState('')
    const onContentChange= (e)=>{
        setContent(e.target.value)
    }
    const onCreatePost = ()=>{
        createPost(content)
        setContent('')
    }
    const renderForm =()=>{
        return(        
            <div key='form' className='post'>
                <div className='form'>
                    <h4>Content:</h4>
                    <textarea name='content' onChange={onContentChange} value={content}/>
                    <button className='button' onClick={onCreatePost}>Post</button>
                    {message!==''&& <div>{message}</div>}
                </div>
            </div>
        )
    }
    const renderPost =  () => { 
        const web3 = window.web3
        return posts.map(post => (
        <div key={post.id} className='post'>
          <div className='author'>
            <ProfileImage account={post.author}/>
            {post.author}
          </div>
          <div className='content'>
            {post.content}
          </div> 
          <div className='footer'>
            Tip:{web3.utils.toWei(post.tipAmount.toString(),'Ether')} ETH
           <button className='button' onClick={sendTip}>Tip 0.1 ETH</button>
          </div>
        </div>
        ))
      }
    return (
        <div className='landing__wrapper'>
            <h1>Total posts: {postCount}</h1>
            <div className='post__wrapper'>
            {renderForm()}
            {renderPost()}
            </div>
        </div>

    )
}
export default Main