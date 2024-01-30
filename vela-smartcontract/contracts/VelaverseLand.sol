// SPDX-License-Identifier: https://multiverseexpert.io/
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
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

interface ILandSetting {
    function getPricePerLand() external view returns (uint256);

    function getGlobalWallet() external view returns (address);

    function restrictedArea(uint256 x, uint256 y) external returns (bool);
}

interface IPrevLand {
    function totalSupply() external view returns (uint256);
}

contract VelaverseLand is
    ERC721,
    ERC721URIStorage,
    AccessControl,
    Pausable,
    ERC721Enumerable
{
    using Counters for Counters.Counter;
    uint256 public migrateCounter = 0;

    Counters.Counter private tokenIdCounter;
    IToken iToken;
    ILandSetting iSetting;
    IPrevLand iPrevLand;

    struct sLand {
        uint256 x;
        uint256 y;
        uint256 tokenId;
        bool isLocked;
    }

    sLand[] private aLands;

    struct sLandOwner {
        uint256 x;
        uint256 y;
        uint256 tokenId;
        bool isLocked;
        bool isOwner;
    }

    mapping(uint256 => uint256) private mLand;
    mapping(uint256 => bool) private mLandhasOwner;
    mapping(address => sLandOwner[]) private mLandIdbyOwner;

    string public baseUrl;

    bytes32 public constant LOCKER_ROLE = keccak256("LOCKER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    event landTransfered(
        uint256[] x,
        uint256[] y,
        address wallet,
        uint256[] tokenId,
        string actionType
    );

    constructor(
        string memory _name,
        string memory _symbol,
        address _tokenAddress,
        address _settingAddress,
        address _prevLandAddress,
        string memory _baseURL
    ) ERC721(_name, _symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(LOCKER_ROLE, msg.sender);

        iToken = IToken(_tokenAddress);
        iSetting = ILandSetting(_settingAddress);
        iPrevLand = IPrevLand(_prevLandAddress);
        baseUrl = _baseURL;
    }

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
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

    function safeMint(address to, string memory uri) private returns (uint256) {
        uint256 tokenId = tokenIdCounter.current();
        tokenIdCounter.increment();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        return tokenId;
    }

    function getIndexLand(uint256 _x, uint256 _y)
        public
        pure
        returns (uint256)
    {
        return ((_x + 1) * 1 ether) + (_y + 1);
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
            iToken.balanceOf(msg.sender) >=
                iSetting.getPricePerLand() * 1 ether * _x.length,
            "Balance is not enough"
        );

        iToken.transferFrom(
            msg.sender,
            iSetting.getGlobalWallet(),
            iSetting.getPricePerLand() * 1 ether * _x.length
        );

        uint256[] memory tokenIdMinted = new uint256[](uint256(_x.length));

        for (uint256 i = 0; i < _x.length; i++) {
            require(!hasOwner(_x[i], _y[i]), "Land is owned");
            require(
                !iSetting.restrictedArea(_x[i], _y[i]),
                "Land is restrect area"
            );

            tokenIdMinted[i] = safeMint(msg.sender, baseUrl);

            mLand[tokenIdMinted[i]] = aLands.length;

            aLands.push(
                sLand({
                    x: _x[i],
                    y: _y[i],
                    tokenId: tokenIdMinted[i],
                    isLocked: false
                })
            );

            mLandhasOwner[getIndexLand(_x[i], _y[i])] = true;
        }

        emit landTransfered(_x, _y, msg.sender, tokenIdMinted, "buy lands");
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
        require(migrateCounter < iPrevLand.totalSupply(), "Maximum migrate");

        uint256[] memory tokenIdMinted = new uint256[](uint256(_x.length));

        for (uint256 i = 0; i < _x.length; i++) {
            require(!hasOwner(_x[i], _y[i]), "Land is owned");
            require(
                !iSetting.restrictedArea(_x[i], _y[i]),
                "Land is restrect area"
            );

            tokenIdMinted[i] = safeMint(_to, baseUrl);

            mLand[tokenIdMinted[i]] = aLands.length;

            aLands.push(
                sLand({
                    x: _x[i],
                    y: _y[i],
                    tokenId: tokenIdMinted[i],
                    isLocked: false
                })
            );

            mLandhasOwner[getIndexLand(_x[i], _y[i])] = true;
        }

        emit landTransfered(_x, _y, _to, tokenIdMinted, "migrate lands");
    }

    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override whenNotPaused {
        require(!aLands[mLand[tokenId]].isLocked, "This land is locked.");
        super._transfer(from, to, tokenId);
    }

    function getLandsByToken(uint256 _tokenId)
        public
        view
        returns (sLand memory)
    {
        return aLands[mLand[_tokenId]];
    }

    function lockToken(uint256 _tokenId, bool _isLocked)
        public
        onlyRole(LOCKER_ROLE)
    {
        aLands[mLand[_tokenId]].isLocked = _isLocked;
    }

    function getTokensByOwner(address owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokenId = new uint256[](balance);

        for (uint256 index = 0; index < balance; index++)
            tokenId[index] = uint256(tokenOfOwnerByIndex(owner, index));

        return tokenId;
    }
}
