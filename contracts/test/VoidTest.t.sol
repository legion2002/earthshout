// SPDX-License-Identifier: MIT
pragma solidity >=0.8.29;

import "forge-std/Test.sol";
import "../src/Void.sol";

contract VoidTest is Test {
    Void public voidContract;
    address public user = address(0x1);

    event Yeet(
        address indexed token,
        uint256 indexed amount,
        address indexed from,
        uint256 yeetId
    );
    event Gift(
        address indexed token,
        uint256 indexed amount,
        address indexed to,
        address from,
        uint256 yeetId
    );

    function setUp() public {
        voidContract = new Void();
        vm.deal(user, 10 ether);
    }

    function testSendEthWithMessage() public {
        vm.startPrank(user);

        string memory message = "Hello, Void!";
        uint256 sendAmount = 0.1 ether;

        // Check balance before sending
        uint256 initialContractBalance = address(voidContract).balance;
        uint256 initialUserBalance = user.balance;

        vm.expectEmit(true, true, true, true, address(voidContract));
        emit Yeet(address(0), sendAmount, address(user), 0);
        // Use the abi.encodePacked to create the data payload with our message
        (bool success, ) = address(voidContract).call{value: sendAmount}(
            bytes(message)
        );

        console.logBytes(bytes(message));

        assertTrue(success, "ETH transfer failed");

        // Verify balances changed correctly
        assertEq(
            address(voidContract).balance,
            initialContractBalance + sendAmount,
            "Contract balance should increase"
        );
        assertEq(
            user.balance,
            initialUserBalance - sendAmount,
            "User balance should decrease"
        );

        vm.stopPrank();
    }

    // function testSendEthWithRandomMessage() public {
    //     vm.startPrank(user);

    //     // Generate a random message
    //     string memory randomMessage = generateRandomMessage();
    //     uint256 sendAmount = 0.05 ether;

    //     // Send ETH with the random message
    //     (bool success, ) = address(voidContract).call{value: sendAmount}(
    //         bytes(randomMessage)
    //     );

    //     assertTrue(success, "ETH transfer with random message failed");

    //     vm.stopPrank();
    // }

    // // Helper function to generate a random message
    // function generateRandomMessage() internal returns (string memory) {
    //     string[5] memory words = [
    //         "blockchain",
    //         "ethereum",
    //         "foundry",
    //         "solidity",
    //         "testing"
    //     ];

    //     uint256 randomSeed = uint256(
    //         keccak256(abi.encodePacked(block.timestamp, block.prevrandao))
    //     );

    //     string memory result = words[randomSeed % 5];
    //     result = string(
    //         abi.encodePacked(result, " ", words[(randomSeed / 5) % 5])
    //     );
    //     result = string(
    //         abi.encodePacked(result, " ", words[(randomSeed / 25) % 5])
    //     );

    //     return result;
    // }
}
