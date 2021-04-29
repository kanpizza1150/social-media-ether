pragma solidity ^0.5.0;

contract SocialNetwork {
    string public name; //state variable -> store in blockchain itself
    uint public postCount = 0;
    mapping(uint => Post) public posts;

    struct Post {
       uint id;
       string content;
       uint tipAmount;
       address payable author; //payable special data type
   }

   event PostCreated(
       uint id,
       string content,
       uint tipAmount,
       address payable author
   );
   event PostTipped(
       uint id,
       string content,
       uint tipAmount,
       address payable author
   );

   constructor() public{
       name = "Dapp Kanpizza Social Network";
   } 

   function createPost(string memory _content) public{
       //Require valid content
       require(bytes(_content).length>0);
       //Increasement post count 
        postCount++;
        //Creaet post 
        posts[postCount]=Post(postCount,_content,0,msg.sender); //msg.sender ==> who calls this fucntion;
        //Trigger eventÍÍÍ
        emit PostCreated(postCount,_content,0,msg.sender);
    }  

    function tipPost(uint _id) public payable{
    //Require valid content
    require(_id > 0 && _id <= postCount);

     //Fetch the post
     Post memory _post= posts[_id];
     //Fetch the owner of the post
     address payable _author = _post.author;
     //Pay the author by sending them Ether
     address(_author).transfer(msg.value);
     //Incresement the tip amount 
     //1 Ether = 1000000000000000000 Wei
     _post.tipAmount =_post.tipAmount+msg.value;
     //Update the post 
      posts[_id] = _post;
     //Trigger an evnet
    emit PostTipped(postCount,_post.content,_post.tipAmount,_author);

    }
}

