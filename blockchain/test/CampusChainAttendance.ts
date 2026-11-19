
import { expect } from "chai";
import { network } from "hardhat";

describe("CampusChainAttendance", function () {

  async function deployContract() {
    const { ethers } = await network.connect();

    const [admin, faculty, student] = await ethers.getSigners();

    const contract = await ethers.deployContract(
      "CampusChainAttendance"
    );

    await contract.waitForDeployment();

    return {
      contract,
      admin,
      faculty,
      student,
      ethers
    };
  }

  // Test 1: Admin ownership
  it("should assign the deployer as Admin", async function () {
    const { contract, admin } = await deployContract();

    expect(await contract.owner()).to.equal(admin.address);
  });

  // Test 2: Admin can authorize faculty
  it("should allow Admin to authorize faculty", async function () {
    const { contract, faculty } = await deployContract();

    await contract.authorizeFaculty(faculty.address, true);

    expect(
      await contract.authorizedFaculty(faculty.address)
    ).to.equal(true);
  });

  // Test 3: Unauthorized users cannot authorize faculty
  it("should prevent unauthorized users from authorizing faculty", async function () {
    const { contract, faculty, student } = await deployContract();

    await expect(
      contract.connect(student).authorizeFaculty(faculty.address, true)
    ).to.be.revertedWith("Only Admin can perform this action");
  });

  // Test 4: Unauthorized users cannot record attendance
  it("should prevent unauthorized wallets from recording attendance", async function () {
    const { contract, student, ethers } = await deployContract();

    const studentHash = ethers.id("STUDENT001");
    const sessionHash = ethers.id("SESSION001");

    await expect(
      contract.connect(student).recordAttendance(studentHash, sessionHash)
    ).to.be.revertedWith("Faculty wallet is not authorized");
  });

  // Test 5: Authorized faculty can record attendance
  it("should allow authorized faculty to record attendance", async function () {
    const { contract, faculty, ethers } = await deployContract();

    const studentHash = ethers.id("STUDENT001");
    const sessionHash = ethers.id("SESSION001");

    await contract.authorizeFaculty(faculty.address, true);

    await expect(
      contract.connect(faculty).recordAttendance(studentHash, sessionHash)
    ).to.emit(contract, "AttendanceRecorded");
  });

  // Test 6: Duplicate attendance is prevented
  it("should prevent duplicate attendance", async function () {
    const { contract, faculty, ethers } = await deployContract();

    const studentHash = ethers.id("STUDENT001");
    const sessionHash = ethers.id("SESSION001");

    await contract.authorizeFaculty(faculty.address, true);

    await contract.connect(faculty).recordAttendance(
      studentHash,
      sessionHash
    );

    await expect(
      contract.connect(faculty).recordAttendance(
        studentHash,
        sessionHash
      )
    ).to.be.revertedWith("Attendance already recorded");
  });

  // Test 7: Attendance can be verified
  it("should verify recorded attendance", async function () {
    const { contract, faculty, ethers } = await deployContract();

    const studentHash = ethers.id("STUDENT001");
    const sessionHash = ethers.id("SESSION001");

    await contract.authorizeFaculty(faculty.address, true);

    await contract.connect(faculty).recordAttendance(
      studentHash,
      sessionHash
    );

    const result = await contract.verifyAttendance(
      studentHash,
      sessionHash
    );

    expect(result[0]).to.equal(true);
    expect(result[2]).to.equal(faculty.address);
  });

});
