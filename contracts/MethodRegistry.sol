//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct MethodEntry {
    string method;
    uint256 blockNumber;
}

contract MethodRegistry {
    mapping(bytes4 => MethodEntry[]) public entries;

    constructor() {
    }

    function register(string calldata _method) public {
        bytes4 signature = bytes4(keccak256(abi.encodePacked(_method)));
        MethodEntry[] storage signatureEntries = entries[signature];
        signatureEntries.push(MethodEntry(_method, block.number));
    }

    function getEntries(bytes4 signature) public view returns (MethodEntry[] memory) {
        return entries[signature];
    }
}
