import React, { useEffect, useState, useCallback } from 'react'
import Navbar from './Navbar'
import Web3 from 'web3'
import './App.scss'
import Main from './Main'
import SocialNetwork from '../abis/SocialNetwork.json'
const App = () => {
  const [account, setAccount] = useState('')
  const [socialNetwork, setSocialNetworks] = useState(null)
  const [postCount, setPostCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState('Loading...')
  const [posts, setPosts] = useState([])
  const [message, setMessage] = useState('')
  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      alert(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      )
    }
  }

  const loadPosts = async (sn = socialNetwork) => {
    console.log('+++++++++')
    const postArr = []
    const postCounter = await sn.methods.postCount().call()
    const countToNum = window.web3.utils.hexToNumber(postCounter)
    setPostCount(countToNum)
    for (let i = 1; i <= countToNum; i++) {
      const post = await sn.methods.posts(i).call()
      postArr.push(post)
      setPosts(postArr)
    }
  }

  const connectContract = async () => {
    const networkId = await window.web3.eth.net.getId()
    const networkData = SocialNetwork.networks[networkId]
    if (networkData) {
      const socialNetworkContract = window.web3.eth.Contract(
        SocialNetwork.abi,
        networkData.address
      )
      setSocialNetworks(socialNetworkContract)
      return socialNetworkContract
    }
  }

  const loadBlockchainData = async () => {
    //load accounts
    const accounts = await window.web3.eth.getAccounts()
    if (accounts.length > 0) {
      setAccount(accounts[0])
      //address
      const sn = await connectContract()
      //Load post
      await loadPosts(sn)
      setIsLoading(false)
    } else {
      alert('SocialNetwork contract not deployed to detected network!')
    }
  }

  useEffect(() => {
    loadWeb3()
    loadBlockchainData()
  }, [])

  const sendTip = (id) => {
    const ETH_01 = window.web3.utils.toWei('1', 'Ether')
    socialNetwork.methods
      .tipPost(id)
      .send({ from: account, value: ETH_01 })
      .on('confirmation', async () => {
        // await loadPosts()
        setIsLoading(false)
        setMessage('tip sent!')
      })
      .on('error', (e) => {
        setMessage(e.message)
        setIsLoading(false)
      })
  }

  const createPost = (content) => {
    setIsLoading(true)
    setLoadingMessage('Creating Post!')
    socialNetwork.methods
      .createPost(content)
      .send({ from: account })
      .on('confirmation', async () => {
        await loadPosts()
        setIsLoading(false)
        setMessage('Post created!')
      })
      .on('error', (e) => {
        setMessage(e.message)
        setIsLoading(false)
      })
  }
  const _renderMain = useCallback(() => {
    return (
      <Main
        postCount={postCount}
        sendTip={sendTip}
        posts={posts}
        createPost={createPost}
        message={message}
      />
    )
  }, [postCount, posts])

  return (
    <div className='main__wrapper'>
      <Navbar account={account} />
      {isLoading ? <>{loadingMessage}</> : _renderMain()}
    </div>
  )
}

export default App
