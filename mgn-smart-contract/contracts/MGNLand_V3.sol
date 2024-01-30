// SPDX-License-Identifier: Multiverse Expert
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


interface IToken {
    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}

contract MgnLand is
    ERC721,
    ERC721URIStorage,
    Pausable,
    ERC721Burnable,
    ERC721Enumerable,
    AccessControl
{

    using Counters for Counters.Counter;
    bytes32 public constant LOCKER_ROLE = keccak256("LOCKER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant MARKET_ROLE = keccak256("MARKET_ROLE");

    struct SLand {
        address owner;
        uint256 tokenId;
        uint32 zone;
        bool isLocked;
        bool isOwned;
    }

    struct SZone {
        bool open;
        uint256 startSalesTime;
        uint256 endSalesTime;
        uint256 zoneTokenId;
        uint256 zoneMaxId;
        uint256 endHoldingTime;
    }

    event Bought(
        uint256 zone,
        address owner,
        uint256[] tokenId,
        bool isLocked
    );


    string public baseUrl =
        "https://gateway.pinata.cloud/ipfs/QmdiAbZkbBBm8fpzykbPmzPxjHEeViRdiyG3mGef2amcfy";
    address public _globalWallet = 0x6B60BEfe688834AB5CA33b43FA5130B960117C43;
    address public _swapWallet;
    uint256 public landPrice = 300 ether;



    IToken public token;
    mapping(uint256 => uint256[]) private ownedLandbyZone;
    mapping(uint32 => SZone) public zones;
    mapping(uint256 => SLand) private allLands;
    
    
    uint32[] private openedZones;

    constructor(
        address _busd,
        address _swap
    ) ERC721("MGNLAND", "Land") {
        token = IToken(_busd);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(LOCKER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
        _grantRole(MARKET_ROLE, msg.sender);
        _swapWallet = _swap;
    }

    
    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function getLandPrice() public view returns (uint256){
        return landPrice;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, amount);

        require(!paused(), "Token transfer while paused");
    }

    function safeBurn(uint256 _tokenId) external onlyRole(BURNER_ROLE) {
        _burn(_tokenId);
    }

    function _burn(uint256 _tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(_tokenId);
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(_tokenId);
    }

    function getProjectEndDate(uint32 _zone) public view returns (uint256) {
        return zones[_zone].endSalesTime;
    }

    function openZone(
        uint32 _zone,
        uint256 endSaleTime,
        uint256 _id, //10000 & 20000
        uint256 endProjectTime
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(zones[_zone].open != true, "the zone is already exist");
        zones[_zone] = SZone(
            true,
            block.timestamp,
            endSaleTime,
            _id,
            1000,
            endProjectTime
        );
        openedZones.push(_zone);
    }

    function getOpenZone() public view returns (uint32[] memory) {
        return openedZones;
    }

    function getEndProjectTime(uint32 _zone) public view returns (uint256) {
        return zones[_zone].endHoldingTime;
    }

    function safeMint(
        address to,
        string memory _uri,
        uint256 _tokenId
    ) private returns (uint256) {
        _safeMint(to, _tokenId);
        _setTokenURI(_tokenId, _uri);
        return _tokenId;
    }

    function landHasOwner(
        uint256 _tokenId
    ) public view returns (bool) {
        return allLands[_tokenId].isOwned;
    }

    function setBaseUrl(string memory _url) public onlyRole(MINTER_ROLE) {
        require(bytes(_url).length > 0, "Length must be greater than zero");

        baseUrl = _url;
    }

    function _setToken(uint32 _zone) public view returns (uint256){
        uint256 tokenId;
        uint256 max = zones[_zone].zoneTokenId + zones[_zone].zoneMaxId;

        require(zones[_zone].zoneTokenId <= max, "Id has reached maximum number" );
        
        if (_zone == 1) {
            tokenId = zones[_zone].zoneTokenId + 1;
        } else if ( _zone == 2) {
            tokenId = zones[_zone].zoneTokenId + 1;
        }
        return tokenId;
    }


    function buyLands(
        uint32 _zone,
        uint256 amount
    ) public whenNotPaused {
        require(zones[_zone].open == true, "This zone is closed");
        require(
            token.balanceOf(msg.sender) >= (landPrice * amount), 
            "your balance is not enough"
        );
        require(
            token.allowance(msg.sender, address(this)) >=
               (landPrice * amount),
            "Allowance balance is not enough"
        );
        require(block.timestamp <= zones[_zone].endSalesTime, "Sales period has ended");

        uint256 _tokenId = _setToken(_zone);

        
        uint256[] memory tokenList = new uint256[](amount);
        for (uint256 i = 0; i < amount; i++) {
            require(
                landHasOwner(_zone) != true,
                "Ownership: this land has owner"
            );    

            tokenList[i] = safeMint(msg.sender, baseUrl, _tokenId);
            allLands[tokenList[i]] = SLand({
                owner: msg.sender,
                tokenId: _tokenId,
                zone: _zone,
                isLocked: false,
                isOwned: true
            });
            ownedLandbyZone[_zone].push(tokenList[i]);
        }

        token.transferFrom(
            msg.sender,
            _globalWallet,
            ( landPrice * amount )
        );
        
        emit Bought(_zone, msg.sender, tokenList, false);
    }


    function updateOwner(address _newOwner, uint256 _tokenId) public onlyRole(DEFAULT_ADMIN_ROLE) {
        allLands[_tokenId].owner = _newOwner;
    }


    function getLandsByTokenId(uint256 _tokenId)
        public
        view
        returns (SLand memory)
    {
        return allLands[_tokenId];
    }


    function getZoneOfToken(uint256 _tokenId)
        public
        view
        returns (uint32)
    {
        return allLands[_tokenId].zone;
    }



    function _lockLand(uint256 _tokenId, address _sender)
        external
        onlyRole(LOCKER_ROLE)
    {
        require(
            allLands[_tokenId].isLocked == false,
            "The land mustn't be locked"
        );
        require(
            allLands[_tokenId].owner == _sender,
            "The land must be owned by sender"
        );

        allLands[_tokenId].isLocked = true;
    }



    function _unlockLand(uint256 _tokenId, address _sender)
        external
        onlyRole(LOCKER_ROLE)
    {
        require(
            allLands[_tokenId].isLocked == true,
            "The land mustn't be locked"
        );
        require(
            allLands[_tokenId].owner == _sender,
            "The land must be owned by sender"
        );

        allLands[_tokenId].isLocked = false;
    }


}
