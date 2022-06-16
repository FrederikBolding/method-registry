//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct MethodEntry {
    string method;
    uint256 blockNumber;
}

contract MethodRegistry {
    mapping(bytes4 => MethodEntry[]) public entries;

    constructor(string[] memory seedMethods) {
        for (uint256 i = 0; i < seedMethods.length; i++) {
            _register(seedMethods[i]);
        }
    }

    function register(string calldata _method) public {
        _register(_method);
    }

    function _register(string memory _method) internal {
        bytes4 signature = bytes4(keccak256(abi.encodePacked(_method)));
        MethodEntry[] storage signatureEntries = entries[signature];
        signatureEntries.push(MethodEntry(_method, block.number));
    }

    function getEntries(bytes4 signature)
        public
        view
        returns (MethodEntry[] memory)
    {
        return entries[signature];
    }
}
