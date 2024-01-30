// SPDX-License-Identifier: https://multiverseexpert.io
pragma solidity ^0.8.4;
// 0xd44Bae266dd5D9733bfE7De5565AD0959851Da8F CA
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract VelaverseFactory is
  ERC721,
  ERC721Enumerable,
  ERC721URIStorage,
  Pausable,
  AccessControl,
  ERC721Burnable
{ 
  using Counters for Counters.Counter;

  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  Counters.Counter private _tokenIdCounter;

  uint256 constant YEAR = 60 * 60 * 24 * 365;
  uint256 constant DAY = 60 * 60 * 24;
  uint256 constant HOUR = 60 * 60;
  uint256 constant MINUTE = 60;

  string public baseUrl;

  struct sFactory {
    string name;
    string deed;
    uint256 size; // sqm
    bool isRental;
  }

  sFactory[] public Factories;

  struct sFactoryRantal {
    address rentor;
    sFactory factory;
    uint8 duration; // year
    uint256 startedAt;
    uint256 endedAt;
  }

  sFactoryRantal[] public FactoriesRental;

  mapping(address => sFactoryRantal[]) public myRental;

  event AddedFactory(string indexed name, string indexed deed, uint256 indexed size);
  event CreatedFactoryContract(address indexed rentor, sFactory facotryRantal, uint8 indexed duration, uint256 indexed startedAt, uint256 endedAt);

  constructor(string memory _name, string memory _symbol, string memory _baseURL) ERC721(_name, _symbol) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(PAUSER_ROLE, msg.sender);
    _grantRole(MINTER_ROLE, msg.sender);
    baseUrl = _baseURL;
    init();
  }

  function init() private onlyRole(DEFAULT_ADMIN_ROLE) {
    addFactory("amata", "amt1", 100);
    addFactory("rojana", "rjn", 200);
    addFactory("cm", "cm1", 111);

    // 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
    createContractFactory(msg.sender, 0, 10, block.timestamp + 1000);
    createContractFactory(msg.sender, 1, 10, block.timestamp + 1000);
    // 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
    createContractFactory(address(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2), 2, 10, block.timestamp+ 1000);
  }

  function addFactory(string memory _name, string memory _deed, uint256 _size) public onlyRole(DEFAULT_ADMIN_ROLE) {
    require(
      bytes(_name).length > 0 && 
      bytes(_deed).length > 0 &&
      _size > 0,
      "Please, fill in name & deed minimum 1 letter and size (number) more than zero."
    );
    
    Factories.push(
      sFactory({
        name: _name,
        deed: _deed,
        size: _size,
        isRental: false
      })
    );

    emit AddedFactory(_name, _deed, _size);
  }

  function createContractFactory(address _rentor, uint8 _factory, uint8 _duration, uint256 _startedAt) public onlyRole(DEFAULT_ADMIN_ROLE) {
    require(_rentor != address(0), "Rentor isn't zero address.");
    require(_factory < Factories.length, "Factory is invalid.");
    require(_duration > 0, "Duration is must be more than zero.");
    require(_startedAt > block.timestamp, "Contract start is must be more than current time.");
    
    safeMint(_rentor, baseUrl);

    uint256 _endedAt = _startedAt + (_duration * MINUTE);
    
    FactoriesRental.push(
      sFactoryRantal({
        rentor: _rentor,
        factory: Factories[_factory],
        duration: _duration,
        startedAt: _startedAt,
        endedAt: _endedAt
      })
    );

    myRental[_rentor].push(FactoriesRental[_factory]);

    emit CreatedFactoryContract(_rentor, Factories[_factory], _duration, _startedAt, _endedAt);
  }

  function getFactoriesRentalByAddress(address _rentor) public view returns (sFactoryRantal[] memory) {
    return myRental[_rentor];
  }

  function pause() public onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  function safeMint(address to, string memory uri)
    private
    onlyRole(MINTER_ROLE)
  {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  // The following functions are overrides required by Solidity.

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
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
    override(ERC721, ERC721Enumerable, AccessControl)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
