// SPDX-License-Identifier: https://multiverseexpert.io/
pragma solidity ^0.8.2;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract VelaverseAsset is
    ERC721,
    ERC721URIStorage,
    ERC721Burnable,
    ERC721Enumerable,
    Pausable,
    AccessControl
{
    using Counters for Counters.Counter;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant LOCKER_ROLE = keccak256("LOCKER_ROLE");
    Counters.Counter private _tokenIdCounter;

    event EventMinted(uint256 _tokenId, string _metadata, address _owner);

    mapping(uint256 => bool) public tokenLock;

    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function mint(address _to, string memory _uri)
        public
        onlyRole(MINTER_ROLE)
    {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, _uri);

        tokenLock[tokenId] = false;

        emit EventMinted(tokenId, _uri, _to);
    }

    function lockToken(uint256 _tokenId, bool _isLocked)
        public
        onlyRole(LOCKER_ROLE)
    {
        tokenLock[_tokenId] = _isLocked;
    }

    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override whenNotPaused {
        require(tokenLock[tokenId] == false, "Item: Token locked");
        super._transfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        require(ownerOf(tokenId) == msg.sender, "You're not owner");
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function getTokensByOwner(address owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokenId = new uint256[](balance);
        for (uint256 index = 0; index < balance; index++) {
            tokenId[index] = uint256(tokenOfOwnerByIndex(owner, index));
        }

        return tokenId;
    }
}
