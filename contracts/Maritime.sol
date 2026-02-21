// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MARITIME (MRT)
 * @notice Fixed-supply ERC-20 token deployed on Polygon PoS.
 * @dev Mint occurs only once in the constructor. No owner/admin privileges.
 */
contract Maritime is ERC20 {
    uint256 private constant INITIAL_SUPPLY = 100_000_000 * 10 ** 18;

    constructor() ERC20("MARITIME", "MRT") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
