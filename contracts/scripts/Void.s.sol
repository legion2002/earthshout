// SPDX-License-Identifier: MIT
pragma solidity >=0.8.29;

import "forge-std/Script.sol";
import "../src/Void.sol";

contract VoidScript is Script {
    function run() public {
        vm.startBroadcast();
        Void voidContract = new Void();
        console.log("Void contract deployed at", address(voidContract));
        
        vm.stopBroadcast();
    }
}
// Command to run
// forge script Void.s.sol:VoidScript --rpc-url sepolia --broadcast --verify -vvvv --sender 0x0000000000000000000000000000000000000000