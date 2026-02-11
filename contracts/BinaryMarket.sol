// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BinaryMarket is Ownable {
    string public question;
    uint256 public endTime;
    bool public resolved;
    bool public outcome; // true = YES, false = NO
    
    uint256 public yesPool;
    uint256 public noPool;
    IERC20 public collateral;
    
    mapping(address => uint256) public yesShares;
    mapping(address => uint256) public noShares;
    
    event MarketCreated(string question, uint256 endTime);
    event SharesBought(address indexed buyer, bool side, uint256 amount, uint256 shares);
    event MarketResolved(bool outcome);
    event Claimed(address indexed claimant, uint256 amount);
    
    constructor(
        string memory _question,
        uint256 _duration,
        address _collateral,
        address _owner
    ) Ownable(_owner) {
        question = _question;
        endTime = block.timestamp + _duration;
        collateral = IERC20(_collateral);
        
        // Initialize pools with small amounts to avoid division by zero
        yesPool = 1 ether;
        noPool = 1 ether;
        
        emit MarketCreated(_question, endTime);
    }
    
    /**
     * @dev Buy YES shares using constant-product AMM
     * @param amount Amount of collateral to spend
     */
    function buyYes(uint256 amount) external {
        require(block.timestamp < endTime, "Market ended");
        require(!resolved, "Market resolved");
        require(amount > 0, "Amount must be > 0");
        
        collateral.transferFrom(msg.sender, address(this), amount);
        
        // Constant product: yesPool * noPool = k
        // After adding amount to yesPool: (yesPool + amount) * newNoPool = k
        // newNoPool = k / (yesPool + amount)
        // Shares received = noPool - newNoPool
        
        uint256 k = yesPool * noPool;
        uint256 newYesPool = yesPool + amount;
        uint256 newNoPool = k / newYesPool;
        uint256 sharesReceived = noPool - newNoPool;
        
        require(sharesReceived > 0, "Insufficient shares");
        
        yesPool = newYesPool;
        noPool = newNoPool;
        yesShares[msg.sender] += sharesReceived;
        
        emit SharesBought(msg.sender, true, amount, sharesReceived);
    }
    
    /**
     * @dev Buy NO shares using constant-product AMM
     * @param amount Amount of collateral to spend
     */
    function buyNo(uint256 amount) external {
        require(block.timestamp < endTime, "Market ended");
        require(!resolved, "Market resolved");
        require(amount > 0, "Amount must be > 0");
        
        collateral.transferFrom(msg.sender, address(this), amount);
        
        // Constant product: yesPool * noPool = k
        // After adding amount to noPool: newYesPool * (noPool + amount) = k
        // newYesPool = k / (noPool + amount)
        // Shares received = yesPool - newYesPool
        
        uint256 k = yesPool * noPool;
        uint256 newNoPool = noPool + amount;
        uint256 newYesPool = k / newNoPool;
        uint256 sharesReceived = yesPool - newYesPool;
        
        require(sharesReceived > 0, "Insufficient shares");
        
        yesPool = newYesPool;
        noPool = newNoPool;
        noShares[msg.sender] += sharesReceived;
        
        emit SharesBought(msg.sender, false, amount, sharesReceived);
    }
    
    /**
     * @dev Resolve the market (only owner)
     * @param _outcome true for YES, false for NO
     */
    function resolve(bool _outcome) external onlyOwner {
        require(block.timestamp >= endTime, "Market not ended");
        require(!resolved, "Already resolved");
        
        resolved = true;
        outcome = _outcome;
        
        emit MarketResolved(_outcome);
    }
    
    /**
     * @dev Claim winnings after resolution
     */
    function claim() external {
        require(resolved, "Market not resolved");
        
        uint256 payout = 0;
        
        if (outcome) {
            // YES won - payout proportional to yesShares
            uint256 totalYesShares = yesShares[msg.sender];
            if (totalYesShares > 0) {
                uint256 totalPool = yesPool + noPool;
                payout = (totalPool * totalYesShares) / yesPool;
                yesShares[msg.sender] = 0;
            }
        } else {
            // NO won - payout proportional to noShares
            uint256 totalNoShares = noShares[msg.sender];
            if (totalNoShares > 0) {
                uint256 totalPool = yesPool + noPool;
                payout = (totalPool * totalNoShares) / noPool;
                noShares[msg.sender] = 0;
            }
        }
        
        require(payout > 0, "No payout available");
        
        collateral.transfer(msg.sender, payout);
        emit Claimed(msg.sender, payout);
    }
    
    /**
     * @dev Get implied probability of YES (in basis points, 0-10000)
     */
    function getImpliedProbability() external view returns (uint256) {
        uint256 totalPool = yesPool + noPool;
        if (totalPool == 0) return 5000; // 50% if no liquidity
        return (yesPool * 10000) / totalPool;
    }
    
    /**
     * @dev Get total pool size
     */
    function getTotalPool() external view returns (uint256) {
        return yesPool + noPool;
    }
}
