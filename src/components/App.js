import React, { useEffect,useState } from 'react';
import Navbar from './Navbar';
import Web3 from 'web3'
import './App.scss';
import Main from './Main'
import SocialNetwork  from '../abis/SocialNetwork.json'
const App =()=>{
 const [account, setAccount] = useState('')
 const [socialNetwork, setSocialNetworks] = useState(null)
 const [postCount, setPostCount] = useState(0)
 const [isLoading, setIsLoading] = useState(true)
 const [posts, setPosts] = useState([])
 const [message,setMessage]=useState('')
  const loadWeb3 = async()=>{
      if (window.ethereum) {
         window.web3 = new Web3(window.ethereum)
         await window.ethereum.enable()
      }
      else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
      }
      else {
        alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
  }

  const loadPosts =async (socialNetwork,count)=>{
    for(let i = 1;i<=count;i++){
      const post = await socialNetwork.methods.posts(i).call()
      setPosts([...posts,post])
    }
  } 
  const loadBlockchainData  = async () =>{
    const web3 = window.web3
    //load accounts
    const accounts =await web3.eth.getAccounts()
    setAccount(accounts[0])
    //address
    const networkId = await web3.eth.net.getId()
    const networkData =SocialNetwork.networks[networkId]
    if(networkData){
      const socialNetwork = web3.eth.Contract(SocialNetwork.abi,networkData.address)
      setSocialNetworks(socialNetwork)
      const postCounter= await socialNetwork.methods.postCount().call()
      setPostCount(web3.utils.hexToNumber(postCounter))

      //Load post
      await loadPosts(socialNetwork,postCounter)
      setIsLoading(false)
    }else{
      alert('SocialNetwork contract not deployed to detected network!');
    }
    //abi
  }

  useEffect(() => {
    loadWeb3()
    loadBlockchainData()
  },[])

  const sendTip =()=>{
    console.log(`sent`)
  } 

  const createPost =(content)=>{
    setIsLoading(true)
    socialNetwork.methods.createPost(content).send({from:account},(e,hash)=>{
      setIsLoading(false)
      if(e){
        setMessage(e.message)
      }else{
        setMessage('Post created!')
      }
     })
  }
 
    return (
      <div className='main__wrapper'>
        <Navbar account={account}/>
        { isLoading
        ? <>Loading...</>
        : <Main postCount={postCount} sendTip={sendTip} posts={posts} createPost={createPost} message={message} />}
      </div>
    )
}

export default App;
