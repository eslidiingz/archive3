// SPDX-License-Identifier: https://multiverseexpert.io/
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

interface IToken {
    function balanceOf(address account) external view returns (uint256);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}

contract Land is
    ERC721,
    ERC721URIStorage,
    ERC721Burnable,
    AccessControl,
    Pausable,
    ERC721Enumerable
{
    using Counters for Counters.Counter;

    uint256 public prevSupply = 1540;
    uint256 public migrateCounter = 0;
    event bought(uint256[] x, uint256[] y, address wallet, uint256[] tokenId);

    struct sLand {
        uint256 x;
        uint256 y;
        address wallet;
        uint256 tokenId;
        bool isLocked;
    }
    struct sLandOwner {
        uint256 x;
        uint256 y;
        uint256 tokenId;
        bool isLocked;
        bool isOwner;
    }

    struct Coord {
        uint256 xStart;
        uint256 xEnd;
        uint256 yStart;
        uint256 yEnd;
    }

    mapping(uint256 => uint256) private mLand; // tokenId => index allLands
    mapping(uint256 => uint256) private mLandOwner; // tokenId => index mLandIdbyOwner
    mapping(address => sLandOwner[]) private mLandIdbyOwner; // address => landDetail
    mapping(uint256 => bool) private mLandhasOwner; // calc => tokenId
    Coord[] public restricted;
    sLand[] private allLands;

    uint256 public pricePerLand = 100;
    string public baseUrl =
        "https://gateway.pinata.cloud/ipfs/QmdiAbZkbBBm8fpzykbPmzPxjHEeViRdiyG3mGef2amcfy";
    address _globalWallet = 0x6B60BEfe688834AB5CA33b43FA5130B960117C43;
    IToken token;

    bytes32 public constant LOCKER_ROLE = keccak256("LOCKER_ROLE");
    Counters.Counter private _tokenIdCounter;

    constructor(address _token) ERC721("Velaverse LAND", "VELALAND") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(LOCKER_ROLE, msg.sender);

        token = IToken(_token);
    }

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function safeMint(address to, string memory uri) private returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
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

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function hasOwner(uint256 _x, uint256 _y) public view returns (bool) {
        return mLandhasOwner[getIndexLand(_x, _y)];
    }

    function buyLands(uint256[] memory _x, uint256[] memory _y)
        public
        whenNotPaused
    {
        require(
            _x.length > 0 && _x.length == _y.length,
            "Invalid array length"
        );

        require(
            token.balanceOf(msg.sender) >= pricePerLand * 1 ether * _x.length,
            "Balance is not enough"
        );

        token.transferFrom(
            msg.sender,
            _globalWallet,
            pricePerLand * 1 ether * _x.length
        );

        uint256[] memory tokenIdMint = new uint256[](uint256(_x.length));

        for (uint256 i = 0; i < _x.length; i++) {
            require(!hasOwner(_x[i], _y[i]), "Land is owned");
            require(!hasRestrictedArea(_x[i], _y[i]), "Land is not available");

            tokenIdMint[i] = safeMint(msg.sender, baseUrl);

            mLand[tokenIdMint[i]] = allLands.length;
            mLandOwner[tokenIdMint[i]] = mLandIdbyOwner[msg.sender].length;
            mLandIdbyOwner[msg.sender].push(
                sLandOwner({
                    x: _x[i],
                    y: _y[i],
                    tokenId: tokenIdMint[i],
                    isLocked: false,
                    isOwner: true
                })
            );

            allLands.push(
                sLand({
                    x: _x[i],
                    y: _y[i],
                    wallet: msg.sender,
                    tokenId: tokenIdMint[i],
                    isLocked: false
                })
            );
            mLandhasOwner[getIndexLand(_x[i], _y[i])] = true;
        }
        emit bought(_x, _y, msg.sender, tokenIdMint);
    }

    function setPricePerLand(uint256 _price)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        pricePerLand = _price;
    }

    function setBaseUrl(string memory _url)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        baseUrl = _url;
    }

    function hasRestrictedArea(uint256 x, uint256 y)
        private
        view
        returns (bool)
    {
        for (uint256 i = 0; i < restricted.length; i++)
            if (
                (x >= restricted[i].xStart && x <= restricted[i].xEnd) &&
                (y >= restricted[i].yStart && y <= restricted[i].yEnd)
            ) return true;
        return false;
    }

    function addRestrictedArea(
        uint256[] memory xStart,
        uint256[] memory xEnd,
        uint256[] memory yStart,
        uint256[] memory yEnd
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            (xStart.length == xEnd.length) &&
                (yStart.length == yEnd.length) &&
                (xStart.length == yStart.length),
            "Invalid array length"
        );
        for (uint256 i = 0; i < xStart.length; i++) {
            restricted.push(
                Coord({
                    xStart: xStart[i],
                    xEnd: xEnd[i],
                    yStart: yStart[i],
                    yEnd: yEnd[i]
                })
            );
        }
    }

    function removeRestrictedArea(
        uint256 xStart,
        uint256 xEnd,
        uint256 yStart,
        uint256 yEnd
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        for (uint256 i = 0; i < restricted.length; i++) {
            if (
                restricted[i].xStart == xStart &&
                restricted[i].xEnd == xEnd &&
                restricted[i].yStart == yStart &&
                restricted[i].yEnd == yEnd
            ) {
                restricted[i].xStart = type(uint256).max;
                restricted[i].xEnd = type(uint256).max;
                restricted[i].yStart = type(uint256).max;
                restricted[i].yEnd = type(uint256).max;
            }
        }
    }

    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override whenNotPaused {
        require(!allLands[mLand[tokenId]].isLocked, "Item is lock");
        super._transfer(from, to, tokenId);
        changeOwner(tokenId, to, from);
    }

    function changeOwner(
        uint256 _tokenId,
        address _to,
        address _from
    ) private {
        mLandIdbyOwner[_from][mLandOwner[_tokenId]].isOwner = false;
        allLands[mLand[_tokenId]].wallet = _to;

        mLandOwner[_tokenId] = mLandIdbyOwner[msg.sender].length;
        mLandIdbyOwner[_to].push(
            sLandOwner({
                x: allLands[mLand[_tokenId]].x,
                y: allLands[mLand[_tokenId]].y,
                tokenId: allLands[mLand[_tokenId]].tokenId,
                isLocked: allLands[mLand[_tokenId]].isLocked,
                isOwner: true
            })
        );
    }

    function getLands() public view returns (sLand[] memory) {
        return allLands;
    }

    function getLandsByOwner(address _address)
        public
        view
        returns (sLandOwner[] memory)
    {
        return mLandIdbyOwner[_address];
    }

    function getLandsByToken(uint256 _tokenId)
        public
        view
        returns (sLand memory)
    {
        return allLands[mLand[_tokenId]];
    }

    function getIndexLand(uint256 _x, uint256 _y)
        public
        pure
        returns (uint256)
    {
        return ((_x + 1) * 1 ether) + (_y + 1);
    }

    function lockToken(uint256 _tokenId, bool _isLocked)
        public
        onlyRole(LOCKER_ROLE)
    {
        allLands[mLand[_tokenId]].isLocked = _isLocked;
        mLandIdbyOwner[address(ownerOf(_tokenId))][mLandOwner[_tokenId]]
            .isLocked = _isLocked;
    }

    function migrateLands(
        address _to,
        uint256[] memory _x,
        uint256[] memory _y
    ) public whenNotPaused onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            _x.length > 0 && _x.length == _y.length,
            "Invalid array length"
        );

        require(migrateCounter < prevSupply, "Maximum migrate");

        uint256[] memory tokenIdMint = new uint256[](uint256(_x.length));

        for (uint256 i = 0; i < _x.length; i++) {
            require(!hasOwner(_x[i], _y[i]), "Land is owned");
            require(!hasRestrictedArea(_x[i], _y[i]), "Land is not available");

            tokenIdMint[i] = safeMint(_to, baseUrl);

            mLand[tokenIdMint[i]] = allLands.length;
            mLandOwner[tokenIdMint[i]] = mLandIdbyOwner[_to].length;
            mLandIdbyOwner[_to].push(
                sLandOwner({
                    x: _x[i],
                    y: _y[i],
                    tokenId: tokenIdMint[i],
                    isLocked: false,
                    isOwner: true
                })
            );

            allLands.push(
                sLand({
                    x: _x[i],
                    y: _y[i],
                    wallet: _to,
                    tokenId: tokenIdMint[i],
                    isLocked: false
                })
            );
            mLandhasOwner[getIndexLand(_x[i], _y[i])] = true;
            migrateCounter = migrateCounter + 1;
        }
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
