// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract Celogram is Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _photosLength;

    address internal cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Photo {
        address payable owner;
        string image;
        string description;
        uint256 likes;
        uint256 rewards;
    }

    mapping(uint256 => Photo) private photos;

    mapping(uint256 => bool) private exists;
    mapping(uint256 => mapping(address => bool)) private liked;

    modifier exist(uint256 _index) {
        require(exists[_index], "Invalid index");
        _;
    }

    // adding a new photo to celogram
    function addPhoto(string memory _image, string memory _description) public {
        require(bytes(_image).length > 0, "Invalid image url");
        require(bytes(_description).length > 0, "Invalid description");
        uint256 _likes = 0;
        uint256 _rewards = 0;
        uint256 id = _photosLength.current();
        _photosLength.increment();
        photos[id] = Photo(
            payable(msg.sender),
            _image,
            _description,
            _likes,
            _rewards
        );
        exists[id] = true;
    }

    // deleting photo, callable by either the photo owner or the contract owner(to remove malicious photos)
    function deletePhoto(uint256 _index) external exist(_index) {
        require(
            msg.sender == photos[_index].owner || owner() == msg.sender,
            "Unauthorized caller"
        );
        photos[_index] = photos[_photosLength.current() - 1];
        delete photos[_photosLength.current() - 1];
        _photosLength.decrement();
        exists[_index] = false;
    }

    // liking a photo
    function like(uint256 _index) external exist(_index) {
        require(msg.sender != photos[_index].owner, "Owner cannot like photo");
        require(!liked[_index][msg.sender], "photo can only be liked once");
        liked[_index][msg.sender] = true;
        photos[_index].likes++;
    }

    // unlikes a photo
    function unlike(uint256 _index) external exist(_index) {
        require(msg.sender != photos[_index].owner, "Owner cannot like photo");
        require(liked[_index][msg.sender], "You haven't liked the photo");
        liked[_index][msg.sender] = false;
        photos[_index].likes--;
    }

    // editing the description of the photo
    function editDescription(uint256 _index, string memory _newDescription)
        external
        exist(_index)
    {
        require(msg.sender == photos[_index].owner, "Not Owner");
        require(bytes(_newDescription).length > 0, "Invalid description");
        photos[_index].description = _newDescription;
    }

    // get photo from mapping
    function getPhoto(uint256 _index)
        public
        view
        returns (
            address payable,
            string memory,
            string memory,
            uint256,
            uint256
        )
    {
        return (
            photos[_index].owner,
            photos[_index].image,
            photos[_index].description,
            photos[_index].likes,
            photos[_index].rewards
        );
    }

    //tipping a photo (likes must be upto 1 to activate rewarding
    function rewardPhoto(uint256 _index, uint256 _amount)
        public
        payable
        exist(_index)
    {
        require(_amount >= 1 ether, "Amount has to be at least one CUSD");
        require(
            photos[_index].likes >= 1,
            "Photo has to be liked at least once for enabling tipping"
        );
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                photos[_index].owner,
                _amount
            ),
            "Transfer failed."
        );
        photos[_index].rewards++;
    }

    // to get the length of photos in the mapping
    function getPhotosLength() public view returns (uint256) {
        return (_photosLength.current());
    }
}
