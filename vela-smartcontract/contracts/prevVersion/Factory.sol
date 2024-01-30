//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/AccessControl.sol";

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

interface ILand {
    function safeMint(address to, string memory uri)
        external
        returns (uint256 tokenId);
}

contract Factory is AccessControl {
    event bought(
        uint256[] zone,
        uint256[] x,
        uint256[] y,
        address wallet,
        uint256[] tokenId
    );

    struct sLand {
        uint256 zone;
        uint256 x;
        uint256 y;
        address wallet;
        uint256 tokenId;
    }

    struct Coord {
        uint256 x;
        uint256 y;
    }

    sLand[] allLands;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 public pricePerLand = 1000;
    string public baseUrl =
        "https://gateway.pinata.cloud/ipfs/QmQQpHbeVJKxeSnVw6P6EB3f6718w8bN8APSde3YWFsJMj";
    address _globalWallet = 0xE40845297c6693863Ab3E10560C97AACb32cbc6C;
    IToken token;
    ILand land;

    Coord[] restricted;

    constructor(address _token, address _land) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        token = IToken(_token);
        land = ILand(_land);
    }

    function hasOwner(
        uint256 _zone,
        uint256 _x,
        uint256 _y
    ) private view returns (bool) {
        for (uint256 i = 0; i < allLands.length; i++)
            if (
                allLands[i].x == _x &&
                allLands[i].y == _y &&
                allLands[i].zone == _zone &&
                allLands[i].wallet != address(0)
            ) return true;
        return false;
    }

    function buyLands(
        uint256[] memory _zone,
        uint256[] memory _x,
        uint256[] memory _y
    ) public {
        require(
            _zone.length == _x.length && _zone.length == _y.length,
            "Invalid array length"
        );
        require(
            token.allowance(msg.sender, address(this)) >=
                pricePerLand * 1 ether * _zone.length,
            "Allowance balance is not enough"
        );
        require(
            token.balanceOf(msg.sender) >=
                pricePerLand * 1 ether * _zone.length,
            "Balance is not enough"
        );

        uint256[] memory tokenIdMint = new uint256[](uint256(_zone.length));
        for (uint256 i = 0; i < _zone.length; i++) {
            require(!hasOwner(_zone[i], _x[i], _y[i]), "Land is owned");
            require(!hasRestrictedArea(_x[i], _y[i]), "Land is not available");

            tokenIdMint[i] = land.safeMint(msg.sender, baseUrl);
            require(tokenIdMint[i] >= 0, "Token ID is invalid");

            allLands.push(
                sLand({
                    zone: _zone[i],
                    x: _x[i],
                    y: _y[i],
                    tokenId: tokenIdMint[i],
                    wallet: payable(msg.sender)
                })
            );
        }
        token.transferFrom(
            msg.sender,
            _globalWallet,
            pricePerLand * 1 ether * _zone.length
        );

        emit bought(_zone, _x, _y, msg.sender, tokenIdMint);
    }

    function getLands() public view returns (sLand[] memory) {
        return allLands;
    }

    function getLandWithOwner(address _address)
        public
        view
        returns (sLand[] memory)
    {
        uint256 ownedLength = 0;
        for (uint256 i = 0; i < allLands.length; i++)
            if (allLands[i].wallet == _address) ownedLength++;

        sLand[] memory _owned = new sLand[](ownedLength);

        uint256 index = 0;
        for (uint256 i = 0; i < allLands.length; i++) {
            if (allLands[i].wallet == _address) {
                _owned[i] = allLands[i];
                index++;
            }
        }
        return _owned;
    }

    function getLandWithTokenId(uint256 _tokenId)
        public
        view
        returns (sLand memory)
    {
        for (uint256 i = 0; i < allLands.length; i++)
            if (allLands[i].tokenId == _tokenId) return allLands[i];
        return sLand({zone: 0, x: 0, y: 0, tokenId: 0, wallet: address(0)});
    }

    function setPricePerLand(uint256 _price) public onlyRole(MINTER_ROLE) {
        require(_price > 0, "Price amount is not valid");
        pricePerLand = _price;
    }

    function setBaseUrl(string memory _url) public onlyRole(MINTER_ROLE) {
        require(bytes(_url).length > 0, "URL length must be greater than zero");

        baseUrl = _url;
    }

    function setGlobalWallet(address _address)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(_address != address(0), "Invalid address");

        _globalWallet = _address;
    }

    function hasRestrictedArea(uint256 x, uint256 y)
        private
        view
        returns (bool)
    {
        for (uint256 i = 0; i < restricted.length; i++)
            if (restricted[i].x == x && restricted[i].y == y) return true;
        return false;
    }

    function addRestrictedArea(uint256[] memory x, uint256[] memory y)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(x.length == y.length, "Invalid array length");
        for (uint256 i = 0; i < x.length; i++) {
            require(
                !hasRestrictedArea(x[i], y[i]),
                "This coordinate already exists"
            );
            restricted.push(Coord({x: x[i], y: y[i]}));
        }
    }

    function removeRestrictedArea(uint256[] memory x, uint256[] memory y)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(x.length == y.length, "Invalid array length");

        uint256 deletedData = 0;
        for (uint256 i = 0; i < x.length; i++)
            if (hasRestrictedArea(x[i], y[i])) deletedData++;

        uint256 newCount = restricted.length - deletedData;
        Coord[] memory newCoord = new Coord[](newCount);

        uint256 index = 0;
        for (uint256 i = 0; i < restricted.length; i++) {
            bool found = false;
            for (uint256 j = 0; j < x.length; j++) {
                if (x[j] == restricted[i].x && y[j] == restricted[i].y) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                newCoord[index] = restricted[i];
                index++;
            }
        }

        delete restricted;

        for (uint256 i = 0; i < newCoord.length; i++)
            restricted[i] = newCoord[i];
    }
}
