const {assert}=require('chai')

const SocialNetwork = artifacts.require('../src/contracts/SocialNetwork.sol')
require('chai').use(require('chai-as-promised')).should()


contract('SocialNetwork',([deployer, author, tipper])=>{
    let socialNetwork

    before(async()=>{            
        socialNetwork = await SocialNetwork.deployed()
    })
    describe('deployment',()=>{
        it('should deploys successfully',async ()=>{
            const address = await socialNetwork.address
            assert.notEqual(address,0x0);
            assert.notEqual(address,'');
            assert.notEqual(address,null);
            assert.notEqual(address,undefined);
        })

        it('has a name',async()=>{
            const name = await socialNetwork.name()
            assert.equal(name,'Dapp Kanpizza Social Network')
        })
    })
    describe('post',async ()=>{
        let result,postCount

        before(async()=>{
             //from = msg.sender in solidity side
            result = await socialNetwork.createPost('This is my first post',{from:author})
            postCount = await socialNetwork.postCount()
        })
        it('creates posts',async()=>{
            //SUCCESS 
            assert.equal(postCount,1)
            const event =result.logs[0].args
            assert.equal(event.id.toNumber(),postCount.toNumber(),'id is correct')
            assert.equal(event.content,'This is my first post','content is correct')
            assert.equal(event.tipAmount,'0','Tip amount is correct')
            assert.equal(event.author,author,'Author amount is correct')
       
            //FAILURE post must has content
           await socialNetwork.createPost('',{from:author}).should.be.rejected

        })
        it('lists posts',async()=>{
            const post = await socialNetwork.posts(postCount)
            assert.equal(post.id.toNumber(),postCount.toNumber(),'id is correct')
            assert.equal(post.content,'This is my first post','content is correct')
            assert.equal(post.tipAmount,'0','Tip amount is correct')
            assert.equal(post.author,author,'Author amount is correct')
        })

        it('allow user to tip post',async()=>{

            //Track the author balance before purchase
            let oldAuthorBalance  
            oldAuthorBalance = await web3.eth.getBalance(author) //check balance of someone's wallet
            oldAuthorBalance = new web3.utils.BN(oldAuthorBalance) 
             //1 Ether = 1000000000000000000 Wei
            result = await socialNetwork.tipPost(postCount, {from:tipper, value:web3.utils.toWei('1','Ether')});

            //SUCCESS
            const event =result.logs[0].args
            assert.equal(event.id.toNumber(),postCount.toNumber(),'id is correct')
            assert.equal(event.content,'This is my first post','content is correct')
            assert.equal(event.tipAmount,'1000000000000000000','Tip amount is correct')
            assert.equal(event.author,author,'Author amount is correct')

            //Check that author received the funds
            let newAuthorBalance  
            newAuthorBalance = await web3.eth.getBalance(author) //check balance of someone's wallet
            newAuthorBalance = new web3.utils.BN(newAuthorBalance) 

            let tipAmount
            tipAmount = web3.utils.toWei('1','Ether')
            tipAmount = new web3.utils.BN(tipAmount)


            const expectedBalance = oldAuthorBalance.add(tipAmount)
            assert.equal(expectedBalance.toString(),newAuthorBalance.toString())

            //FAILURE: tried to tip a post that dose not exit

            await socialNetwork.tipPost(99, {from:tipper, value:web3.utils.toWei('1','Ether')}).should.be.rejected;

        })

    })
})