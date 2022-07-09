// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);
  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Celogram {
    uint internal photosLength = 0;
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Photo{
        address payable owner;
        string image;
        string description;
        uint likes;
        uint rewards;
    }

    mapping (uint => Photo) internal photos;


// adding a new photo to celogram
    function addPhoto(
        string memory _image,
        string memory _description
    ) public {
        uint _likes = 0;
         uint _rewards = 0;
        photos[photosLength] = Photo(
            payable(msg.sender),
            _image,
            _description,
            _likes,
            _rewards
        );
        photosLength++;
    }

      // deleting photo 
        function deletePhoto(uint _index) external {
	        require(msg.sender == photos[_index].owner, "can't delete photo not the owner");         
            photos[_index] = photos[photosLength - 1];
            delete photos[photosLength - 1];
            photosLength--; 
	 }


// liking a photo
    function like(uint _index) external{
        require(msg.sender != photos[_index].owner, "Owner cannot like photo");
        photos[_index].likes++;
    }

// editing the description of the photo
    function editDescription(uint _index, string memory _newDescription) external{
        require(msg.sender == photos[_index].owner, "Not Owner");
        photos[_index].description = _newDescription;
    }


// get photo from mapping
    function getPhoto(uint _index) public view returns (
        address payable, 
        string memory, 
        string memory,       
        uint,
        uint
    ) {
        return (
            photos[_index].owner,
            photos[_index].image,
            photos[_index].description,
            photos[_index].likes,
            photos[_index].rewards

          
        );
    }


    //tipping a photo (likes must be upto 1 to activate rewarding
    function rewardPhoto(uint _index, uint _ammount) public payable  {
        require(photos[_index].likes >= 1, "likes must be upto 5 to enable tipping");
        require(
          IERC20Token(cUsdTokenAddress).transferFrom(
            msg.sender,
            photos[_index].owner,
            _ammount
          ),
          "Transfer failed."
        );
        photos[_index].rewards++;
    }

    
    // to get the length of photos in the mapping
    function getPhotosLength() public view returns (uint) {
        return (photosLength);
    }
}