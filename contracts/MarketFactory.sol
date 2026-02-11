// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BinaryMarket.sol";

contract MarketFactory {
    address[] public markets;
    address public immutable collateral;
    
    event MarketCreated(address indexed market, string question, uint256 endTime);
    
    constructor(address _collateral) {
        collateral = _collateral;
    }
    
    /**
     * @dev Create a new binary market
     * @param question The market question
     * @param duration Duration in seconds until market ends
     * @return marketAddress Address of the created market
     */
    function createMarket(
        string memory question,
        uint256 duration
    ) external returns (address marketAddress) {
        BinaryMarket market = new BinaryMarket(
            question,
            duration,
            collateral,
            msg.sender
        );
        
        marketAddress = address(market);
        markets.push(marketAddress);
        
        emit MarketCreated(marketAddress, question, block.timestamp + duration);
    }
    
    /**
     * @dev Get all market addresses
     */
    function getAllMarkets() external view returns (address[] memory) {
        return markets;
    }
    
    /**
     * @dev Get total number of markets
     */
    function getMarketCount() external view returns (uint256) {
        return markets.length;
    }
}
