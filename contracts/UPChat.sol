pragma solidity ^0.8.7;

contract UPChat {
    event Request(address indexed sender, address indexed recipient);
    event RevokeRequest(address indexed executor, address indexed recipient);
    event Friend(address indexed executor, address indexed friend);
    event Message(address indexed sender, address indexed recipient, string message);
    event Unfriend(address indexed executor, address indexed friend);

    mapping(address => mapping(address => bool)) isFriendRequested;
    mapping(address => mapping(address => bool)) isFriend;

    function sendRequest(address recipient) public { 
        (address _addressA, address _addressB) = canonicalizeAddress(msg.sender, recipient);

        require(!isFriend[_addressA][_addressB]);
        require(!isFriendRequested[msg.sender][recipient]);

        if (isFriendRequested[recipient][msg.sender]) {            
            isFriend[_addressA][_addressB] = true;

            isFriendRequested[msg.sender][recipient] = false;
            isFriendRequested[recipient][msg.sender] = false;

            emit Friend(_addressA, _addressB);
        } else {
            isFriendRequested[msg.sender][recipient] = true;

            emit Request(msg.sender, recipient);
        }
    }

    function revokeRequest(address recipient) public {
        require(isFriendRequested[msg.sender][recipient]);

        isFriendRequested[msg.sender][recipient] = false;

        emit RevokeRequest(msg.sender, recipient);
    }
    
    function sendMessage(address recipient, string calldata message) public {
        (address _addressA, address _addressB) = canonicalizeAddress(msg.sender, recipient);

        require(isFriend[_addressA][_addressB]);

        emit Message(msg.sender, recipient, message);
    }

    function unFriend(address friend) public {
        (address _addressA, address _addressB) = canonicalizeAddress(msg.sender, friend);
        
        require(isFriend[_addressA][_addressB]);

        isFriend[_addressA][_addressB] = false;

        emit Unfriend(msg.sender, friend);
    }

    function canonicalizeAddress(address _addressA, address _addressB) private pure returns (address, address) {
        require(_addressA != _addressB);

        if (_addressA < _addressB) {
            return (_addressA, _addressB);
        } else {
            return (_addressB, _addressA);
        }
    }
}
