// SPDX-License-Identifier: MIT
pragma solidity >=0.8.29;
// Import IERC20 interface from forge-std

import "forge-std/interfaces/IERC20.sol";

contract Void {
    uint256 public yeetId;

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

    function shout(
        address token,
        uint256 burn,
        // Enter your message here, offchain listeners will read it using the calldata
        bytes calldata /*message*/
    ) external {
        IERC20(token).transferFrom(msg.sender, address(this), burn);

        emit Yeet(token, burn, msg.sender, yeetId);

        yeetId++;
    }

    function shoutAt(
        address to,
        address token,
        uint256 burn,
        uint256 gift,
        // Enter your message here, offchain listeners will read it using the calldata
        bytes calldata /*message*/
    ) external {
        IERC20(token).transferFrom(msg.sender, address(this), burn);
        IERC20(token).transferFrom(msg.sender, to, gift);

        emit Gift(token, burn, to, msg.sender, yeetId);
        emit Yeet(token, burn, msg.sender, yeetId);

        yeetId++;
    }

    function shoutFor(
        uint256 _yeetId,
        address token,
        uint256 burn,
        // Enter your message here, offchain listeners will read it using the calldata
        bytes calldata /*message*/
    ) external {
        IERC20(token).transferFrom(msg.sender, address(this), burn);

        emit Boost(_yeetId, token, burn);
    }

    fallback() external payable {
        emit Yeet(address(0), msg.value, msg.sender, yeetId);
        yeetId++;
    }

    // TODO: Rewrite later in assembly for vibes
    // fallback() external payable {
    // event Yeet(address indexed token,uint256 indexed amount,address indexed from,uint256 yeetId); -> 0xea2ae8c9c66234e8d4c1b748a068d88cb87cd755abd3b60c1d820d5b32e48105
    // event Gift(address indexed token,uint256 indexed amount,address indexed to,address from,uint256 yeetId); -> 0x73b8c05d5cc6e7f742fe1f3261095d17b0bf9f7ba1fbbbd720cfc2fe9ac9871c
    // event Boost(uint256 indexed yeetId, uint256 indexed amount)
    //     assembly {
    //         switch shr(224, calldataload(0))
    //         // "shout(address token, uint256 burn, string message)
    //         case 0xbaa16d76 {

    //         }
    //         // "shoutAt(address token, uint256 burn, uint256 gift, string message) returns(uint256)"
    //         // "shoutFor(uint256 yeetId, address token, uint256 burn, string message)
    //         default {
    //             // Emit the yeetId as part of the data for the log
    //             mstore(0x00, sload(0x00))

    //             log4(
    //                 0x00,
    //                 0x20,
    //                 0xea2ae8c9c66234e8d4c1b748a068d88cb87cd755abd3b60c1d820d5b32e48105,
    //                 0x0000000000000000000000000000000000000000,
    //                 callvalue(),
    //                 caller()
    //             )

    //             sstore(0x00, add(1, mload(0x00)))
    //         }
    //     }
    // }
}
