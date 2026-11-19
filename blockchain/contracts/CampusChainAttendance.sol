
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CampusChainAttendance {
    address public owner;

    mapping(address => bool) public authorizedFaculty;

    struct AttendanceRecord {
        bytes32 studentIdHash;
        bytes32 sessionIdHash;
        uint256 timestamp;
        address approvedBy;
        bool exists;
    }

    mapping(bytes32 => AttendanceRecord) private attendanceRecords;

    event FacultyAuthorizationUpdated(
        address indexed faculty,
        bool authorized
    );

    event AttendanceRecorded(
        bytes32 indexed recordId,
        bytes32 indexed studentIdHash,
        bytes32 indexed sessionIdHash,
        address approvedBy,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Admin can perform this action");
        _;
    }

    modifier onlyFaculty() {
        require(
            authorizedFaculty[msg.sender],
            "Faculty wallet is not authorized"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function authorizeFaculty(
        address faculty,
        bool authorized
    ) external onlyOwner {
        require(faculty != address(0), "Invalid faculty address");

        authorizedFaculty[faculty] = authorized;

        emit FacultyAuthorizationUpdated(faculty, authorized);
    }

    function recordAttendance(
        bytes32 studentIdHash,
        bytes32 sessionIdHash
    ) external onlyFaculty {
        require(studentIdHash != bytes32(0), "Invalid student ID");
        require(sessionIdHash != bytes32(0), "Invalid session ID");

        bytes32 recordId = keccak256(
            abi.encode(studentIdHash, sessionIdHash)
        );

        require(
            !attendanceRecords[recordId].exists,
            "Attendance already recorded"
        );

        attendanceRecords[recordId] = AttendanceRecord({
            studentIdHash: studentIdHash,
            sessionIdHash: sessionIdHash,
            timestamp: block.timestamp,
            approvedBy: msg.sender,
            exists: true
        });

        emit AttendanceRecorded(
            recordId,
            studentIdHash,
            sessionIdHash,
            msg.sender,
            block.timestamp
        );
    }

    function verifyAttendance(
        bytes32 studentIdHash,
        bytes32 sessionIdHash
    ) external view returns (
        bool recorded,
        uint256 timestamp,
        address approvedBy
    ) {
        bytes32 recordId = keccak256(
            abi.encode(studentIdHash, sessionIdHash)
        );

        AttendanceRecord memory record = attendanceRecords[recordId];

        return (
            record.exists,
            record.timestamp,
            record.approvedBy
        );
    }
}
