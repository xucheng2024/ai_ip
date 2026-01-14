// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Anchor Contract
 * @notice Simple contract for anchoring Merkle roots to Polygon
 * @dev Emits events for easy verification and auditing
 */
contract Anchor {
    event Anchored(
        bytes32 indexed root,
        uint256 indexed timestamp,
        string batchId
    );

    /**
     * @notice Anchor a Merkle root
     * @param root The Merkle root to anchor (32 bytes)
     * @param batchId Optional batch identifier for tracking
     */
    function anchor(bytes32 root, string calldata batchId) external {
        emit Anchored(root, block.timestamp, batchId);
    }

    /**
     * @notice Anchor multiple Merkle roots in one transaction
     * @param roots Array of Merkle roots to anchor
     * @param batchIds Array of batch identifiers
     */
    function anchorBatch(
        bytes32[] calldata roots,
        string[] calldata batchIds
    ) external {
        require(roots.length == batchIds.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < roots.length; i++) {
            emit Anchored(roots[i], block.timestamp, batchIds[i]);
        }
    }
}
