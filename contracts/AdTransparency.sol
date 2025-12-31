// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AdTransparency 1000X
 * @dev Immutable ledger for marketing and ad verification.
 * Eliminates fraud by logging impressions and conversions on-chain.
 */
contract AdTransparency {
    struct AdEvent {
        address advertiser;
        string campaignId;
        string eventType; // "impression", "click", "conversion"
        uint256 timestamp;
        bytes32 dataHash; // Integrity of the off-chain data (IPFS/S3)
    }

    mapping(bytes32 => AdEvent) public events;
    uint256 public totalEvents;

    event EventLogged(bytes32 indexed eventId, address indexed advertiser, string campaignId);

    /**
     * @dev Logs an ad event with a unique ID and data hash for verification.
     */
    function logEvent(
        string memory _campaignId,
        string memory _eventType,
        bytes32 _dataHash
    ) public returns (bytes32) {
        bytes32 eventId = keccak256(abi.encodePacked(msg.sender, _campaignId, block.timestamp, totalEvents));
        
        events[eventId] = AdEvent({
            advertiser: msg.sender,
            campaignId: _campaignId,
            eventType: _eventType,
            timestamp: block.timestamp,
            dataHash: _dataHash
        });

        totalEvents++;
        emit EventLogged(eventId, msg.sender, _campaignId);
        return eventId;
    }

    function verifyEvent(bytes32 _eventId, bytes32 _expectedHash) public view returns (bool) {
        return events[_eventId].dataHash == _expectedHash;
    }
}
