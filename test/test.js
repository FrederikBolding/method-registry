const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MethodRegistry", function () {
  it("Can register and return method signature", async function () {
    const MethodRegistry = await ethers.getContractFactory("MethodRegistry");
    const contract = await MethodRegistry.deploy([]);
    await contract.deployed();

    const method = "setApprovalForAll(address,bool)";

    const registerTx = await contract.register(method);

    // wait until the transaction is mined
    await registerTx.wait();

    const entries = await contract.getEntries("0xa22cb465");

    expect(entries.length).to.equal(1);
    const entry = entries[0];
    expect(entry.method).to.equal(method);
  });

  it("Can register and return multiple method signatures", async function () {
    const MethodRegistry = await ethers.getContractFactory("MethodRegistry");
    const contract = await MethodRegistry.deploy([]);
    await contract.deployed();

    const methods = [
      "setApprovalForAll(address,bool)",
      "niceFunctionHerePlzClick943230089(address,bool)",
    ];

    for (const method of methods) {
      const registerTx = await contract.register(method);
      await registerTx.wait();
    }

    const entries = await contract.getEntries("0xa22cb465");

    expect(entries.length).to.equal(2);
    expect(entries[0].method).to.equal(methods[0]);
    expect(entries[0].blockNumber).to.equal(4);
    expect(entries[1].method).to.equal(methods[1]);
    expect(entries[1].blockNumber).to.equal(5);
  });

  it("Can register and return multiple different method signatures", async function () {
    const MethodRegistry = await ethers.getContractFactory("MethodRegistry");
    const contract = await MethodRegistry.deploy([]);
    await contract.deployed();

    const methods = [
      "setApprovalForAll(address,bool)",
      "transfer(address,uint256)",
    ];

    for (const method of methods) {
      const registerTx = await contract.register(method);
      await registerTx.wait();
    }

    let entries = await contract.getEntries("0xa22cb465");

    expect(entries.length).to.equal(1);
    expect(entries[0].method).to.equal(methods[0]);
    expect(entries[0].blockNumber).to.equal(7);

    entries = await contract.getEntries("0xa9059cbb");

    expect(entries.length).to.equal(1);
    expect(entries[0].method).to.equal(methods[1]);
    expect(entries[0].blockNumber).to.equal(8);
  });

  it("Can seed registry via constructor", async function () {
    const methods = [
      "setApprovalForAll(address,bool)",
      "transfer(address,uint256)",
    ];
    const MethodRegistry = await ethers.getContractFactory("MethodRegistry");
    const contract = await MethodRegistry.deploy(methods);
    await contract.deployed();


    let entries = await contract.getEntries("0xa22cb465");

    expect(entries.length).to.equal(1);
    expect(entries[0].method).to.equal(methods[0]);
    expect(entries[0].blockNumber).to.equal(9);

    entries = await contract.getEntries("0xa9059cbb");

    expect(entries.length).to.equal(1);
    expect(entries[0].method).to.equal(methods[1]);
    expect(entries[0].blockNumber).to.equal(9);
  });
});
