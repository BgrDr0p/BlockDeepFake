pragma solidity ^0.5.0;

contract Video {
  string videoHash;

  function set(string memory _vHash) public {
    videoHash = _vHash;
  }

  function get() public view returns (string memory) {
    return videoHash;
  }
}