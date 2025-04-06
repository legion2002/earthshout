// SPDX-License-Identifier: MIT
pragma solidity >=0.8.29;

import "forge-std/Test.sol";
import "../src/Void.sol";
import "./mocks/MockERC20.sol";

contract VoidTest is Test {
    Void public voidContract;
    MockERC20 public mockToken;

    address public user = address(0x1);
    address public recipient = address(0x2);

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

    event Boost(
        uint256 indexed yeetId,
        address indexed token,
        uint256 indexed amount
    );

    function setUp() public {
        voidContract = new Void();
        mockToken = new MockERC20(1000000 * 10 ** 18);

        vm.deal(user, 10 ether);
        mockToken.transfer(user, 100000 * 10 ** 18);
        mockToken.transfer(recipient, 10000 * 10 ** 18);
    }

    // ===== ETH Fallback Tests =====

    function testSendEthWithMessage() public {
        vm.startPrank(user);

        string memory message = "Hello, Void!";
        uint256 sendAmount = 0.1 ether;

        // Check balance before sending
        uint256 initialContractBalance = address(voidContract).balance;
        uint256 initialUserBalance = user.balance;

        // Expect Yeet event to be emitted with correct parameters
        vm.expectEmit(true, true, true, true, address(voidContract));
        emit Yeet(address(0), sendAmount, user, 0); // yeetId should be 0 for the first message

        // Send ETH with message
        (bool success, ) = address(voidContract).call{value: sendAmount}(
            bytes(message)
        );

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

        // Verify yeetId was incremented
        assertEq(voidContract.yeetId(), 1, "yeetId should increment to 1");

        vm.stopPrank();
    }

    function testMultipleEthMessages() public {
        vm.startPrank(user);

        // First message
        vm.expectEmit(true, true, true, true, address(voidContract));
        emit Yeet(address(0), 0.1 ether, user, 0);
        (bool success1, ) = address(voidContract).call{value: 0.1 ether}(
            "First message"
        );
        assertTrue(success1);

        // Second message should have yeetId = 1
        vm.expectEmit(true, true, true, true, address(voidContract));
        emit Yeet(address(0), 0.2 ether, user, 1);
        (bool success2, ) = address(voidContract).call{value: 0.2 ether}(
            "Second message"
        );
        assertTrue(success2);

        // Verify final yeetId
        assertEq(voidContract.yeetId(), 2);

        vm.stopPrank();
    }

    function testSendZeroEth() public {
        vm.startPrank(user);

        // Expect Yeet event with 0 ETH
        vm.expectEmit(true, true, true, true, address(voidContract));
        emit Yeet(address(0), 0, user, 0);

        (bool success, ) = address(voidContract).call("Zero ETH message");
        assertTrue(success);

        vm.stopPrank();
    }

    // ===== Shout Function Tests =====

    function testShout() public {
        vm.startPrank(user);

        uint256 burnAmount = 1000 * 10 ** 18;
        bytes memory message = bytes("Token shout message");

        // Approve tokens for the contract
        mockToken.approve(address(voidContract), burnAmount);

        // Expect Yeet event
        vm.expectEmit(true, true, true, true, address(voidContract));
        emit Yeet(address(mockToken), burnAmount, user, 0);

        // Call shout
        voidContract.shout(address(mockToken), burnAmount, message);

        // Verify token balances
        assertEq(
            mockToken.balanceOf(address(voidContract)),
            burnAmount,
            "Contract token balance should increase"
        );

        // Verify yeetId increment
        assertEq(voidContract.yeetId(), 1, "yeetId should be incremented");

        vm.stopPrank();
    }

    function testShoutWithoutApproval() public {
        vm.startPrank(user);

        uint256 burnAmount = 1000 * 10 ** 18;
        bytes memory message = bytes("Unapproved shout");

        // Try to shout without approval
        vm.expectRevert();
        voidContract.shout(address(mockToken), burnAmount, message);

        vm.stopPrank();
    }

    function testShoutWithInsufficientBalance() public {
        vm.startPrank(user);

        uint256 burnAmount = 1000000000 * 10 ** 18; // More than user has
        bytes memory message = bytes("Too large shout");

        // Approve tokens for the contract
        mockToken.approve(address(voidContract), burnAmount);

        // Try to shout with insufficient balance
        vm.expectRevert();
        voidContract.shout(address(mockToken), burnAmount, message);

        vm.stopPrank();
    }

    // ===== ShoutAt Function Tests =====

    function testShoutAt() public {
        vm.startPrank(user);

        uint256 burnAmount = 1000 * 10 ** 18;
        uint256 giftAmount = 500 * 10 ** 18;
        bytes memory message = bytes("Gift and shout message");

        // Approve tokens for the contract
        mockToken.approve(address(voidContract), burnAmount + giftAmount);

        // Get balances before
        uint256 recipientBalanceBefore = mockToken.balanceOf(recipient);

        // Expect Gift and Yeet events
        vm.expectEmit(true, true, true, true, address(voidContract));
        emit Gift(address(mockToken), burnAmount, recipient, user, 0);

        vm.expectEmit(true, true, true, true, address(voidContract));
        emit Yeet(address(mockToken), burnAmount, user, 0);

        // Call shoutAt
        voidContract.shoutAt(
            recipient,
            address(mockToken),
            burnAmount,
            giftAmount,
            message
        );

        // Verify token balances
        assertEq(
            mockToken.balanceOf(address(voidContract)),
            burnAmount,
            "Contract token balance should increase by burn amount"
        );

        assertEq(
            mockToken.balanceOf(recipient),
            recipientBalanceBefore + giftAmount,
            "Recipient should receive gift amount"
        );

        // Verify yeetId increment
        assertEq(voidContract.yeetId(), 1, "yeetId should be incremented");

        vm.stopPrank();
    }

    function testShoutAtWithoutApproval() public {
        vm.startPrank(user);

        uint256 burnAmount = 1000 * 10 ** 18;
        uint256 giftAmount = 500 * 10 ** 18;
        bytes memory message = bytes("Unapproved shoutAt");

        // Try without approval
        vm.expectRevert();
        voidContract.shoutAt(
            recipient,
            address(mockToken),
            burnAmount,
            giftAmount,
            message
        );

        vm.stopPrank();
    }

    function testShoutAtWithInsufficientBalance() public {
        vm.startPrank(user);

        uint256 burnAmount = 90000 * 10 ** 18; // Close to user's balance
        uint256 giftAmount = 20000 * 10 ** 18; // This will exceed balance when combined
        bytes memory message = bytes("Too large shoutAt");

        // Approve tokens for the contract
        mockToken.approve(address(voidContract), burnAmount + giftAmount);

        // Try with insufficient balance
        vm.expectRevert();
        voidContract.shoutAt(
            recipient,
            address(mockToken),
            burnAmount,
            giftAmount,
            message
        );

        vm.stopPrank();
    }

    // ===== ShoutFor Function Tests =====

    function testShoutFor() public {
        vm.startPrank(user);

        uint256 targetYeetId = 42; // Random yeetId to boost
        uint256 burnAmount = 1000 * 10 ** 18;
        bytes memory message = bytes("Boost message");

        // Approve tokens for the contract
        mockToken.approve(address(voidContract), burnAmount);

        // Expect Boost event
        vm.expectEmit(true, true, true, true, address(voidContract));
        emit Boost(targetYeetId, address(mockToken), burnAmount);

        // Call shoutFor
        voidContract.shoutFor(
            targetYeetId,
            address(mockToken),
            burnAmount,
            message
        );

        // Verify token balances
        assertEq(
            mockToken.balanceOf(address(voidContract)),
            burnAmount,
            "Contract token balance should increase"
        );

        // Verify yeetId remains unchanged (only incremented by shout and shoutAt)
        assertEq(voidContract.yeetId(), 0, "yeetId should not change");

        vm.stopPrank();
    }

    function testShoutForWithoutApproval() public {
        vm.startPrank(user);

        uint256 targetYeetId = 42;
        uint256 burnAmount = 1000 * 10 ** 18;
        bytes memory message = bytes("Unapproved shoutFor");

        // Try without approval
        vm.expectRevert();
        voidContract.shoutFor(
            targetYeetId,
            address(mockToken),
            burnAmount,
            message
        );

        vm.stopPrank();
    }

    function testShoutForWithInsufficientBalance() public {
        vm.startPrank(user);

        uint256 targetYeetId = 42;
        uint256 burnAmount = 1000000 * 10 ** 18; // More than user has
        bytes memory message = bytes("Too large shoutFor");

        // Approve tokens for the contract
        mockToken.approve(address(voidContract), burnAmount);

        // Try with insufficient balance
        vm.expectRevert();
        voidContract.shoutFor(
            targetYeetId,
            address(mockToken),
            burnAmount,
            message
        );

        vm.stopPrank();
    }

    // ===== Combined Functionality Tests =====

    function testMultipleFunctionsInSequence() public {
        vm.startPrank(user);

        // Approve tokens for all operations
        mockToken.approve(address(voidContract), 10000 * 10 ** 18);

        // 1. Send ETH message first
        vm.expectEmit(true, true, true, true, address(voidContract));
        emit Yeet(address(0), 0.1 ether, user, 0);
        (bool success, ) = address(voidContract).call{value: 0.1 ether}(
            "ETH message"
        );
        assertTrue(success);

        // 2. Use shout with token
        vm.expectEmit(true, true, true, true, address(voidContract));
        emit Yeet(address(mockToken), 1000 * 10 ** 18, user, 1);
        voidContract.shout(address(mockToken), 1000 * 10 ** 18, "Token shout");

        // 3. Use shoutAt
        vm.expectEmit(true, true, true, true, address(voidContract));
        emit Gift(address(mockToken), 2000 * 10 ** 18, recipient, user, 2);
        vm.expectEmit(true, true, true, true, address(voidContract));
        emit Yeet(address(mockToken), 2000 * 10 ** 18, user, 2);
        voidContract.shoutAt(
            recipient,
            address(mockToken),
            2000 * 10 ** 18,
            500 * 10 ** 18,
            "Gift shout"
        );

        // 4. Use shoutFor to boost a previous yeetId
        vm.expectEmit(true, true, true, true, address(voidContract));
        emit Boost(1, address(mockToken), 800 * 10 ** 18);
        voidContract.shoutFor(
            1,
            address(mockToken),
            800 * 10 ** 18,
            "Boost message"
        );

        // Final yeetId should be 3
        assertEq(voidContract.yeetId(), 3, "Final yeetId should be 3");

        vm.stopPrank();
    }
}
