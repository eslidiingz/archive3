// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Generate is ERC721, ERC721URIStorage, ERC721Burnable, Ownable, AccessControl, Pausable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
     bytes32 public constant LOCKER_ROLE = keccak256("LOCKER_ROLE");
    constructor() ERC721("Velaverse Gen NFT 721", "VEGU") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(LOCKER_ROLE, msg.sender);
    }
    mapping(uint256 => bool) public tokenLocked;
    function mint(string memory uri) public whenNotPaused {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        
    }
    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }
    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual whenNotPaused  override {
        require(tokenLocked[tokenId],"Item is locked");
        super._transfer(from, to, tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC721Received.selector;
    }
    function lockToken(uint256 _tokenId, bool _isLocked) public onlyRole(LOCKER_ROLE) {
        tokenLocked[_tokenId] = _isLocked;
    }
}
