import {expect} from "chai";
import hre, {ethers} from "hardhat";
import {FoundersNFT} from "../typechain-types";
import {MerkleTree} from "merkletreejs";
import keccak256 from "keccak256";

const MAX_SUPPLY = 6000;
const RESERVED_TOKENS = 50;
const MAX_OMNIPOTENT_SUPPLY = 350;

function getTimeSinceEpoch(): number {
    return Math.round(new Date().getTime() / 1000)
}

async function getContractAndUsers(
    reservedTokens: number = RESERVED_TOKENS,
    maxOmnipotentSupply: number = MAX_OMNIPOTENT_SUPPLY,
    publicSaleStartTime: number = getTimeSinceEpoch(),
) {
    const contract = await deployContract(
        reservedTokens,
        maxOmnipotentSupply,
        publicSaleStartTime
    );
    const [owner, user, alternative_user] = await ethers.getSigners();
    return {contract, owner, user, alternative_user};
}

async function deployContract(
    reservedTokens: number = RESERVED_TOKENS,
    maxOmnipotentSupply: number = MAX_OMNIPOTENT_SUPPLY,
    publicSaleStartTime: number = getTimeSinceEpoch(),
): Promise<FoundersNFT> {
    const contract_factory = await hre.ethers.getContractFactory("FoundersNFT");
    const [owner, _] = await ethers.getSigners();
    const price = ethers.utils.parseEther("0.1")
    return await contract_factory.deploy(
        maxOmnipotentSupply,
        MAX_SUPPLY,
        reservedTokens,
        price,
        owner.address,
        publicSaleStartTime,
        publicSaleStartTime
    );
}

async function createAllowlist(
    id: number,
    allowance: number,
    mintPhase: number,
    startTime: number,
    endTime: number,
    allowlisted_addresses: [string],
    contract: FoundersNFT
): Promise<MerkleTree> {
    const tree = createTree(allowlisted_addresses);
    await contract.createAllowlist(tree.getHexRoot(), id, allowance, mintPhase, startTime, endTime);
    return tree
}

function createTree(allowlisted_address: [string]): MerkleTree {
    let leaves: any[] = [];
    if (allowlisted_address) {
        leaves = allowlisted_address.map(x => keccak256(x));
    }
    return new MerkleTree(leaves, keccak256, {sortPairs: true});
}

describe("Omnipotent Constructor", function () {
    it("Should setup roles on deploy", async function () {
        const {contract, owner} = await getContractAndUsers();
        const has_role = await contract.hasRole(await contract.DEFAULT_ADMIN_ROLE(), owner.address)
        const has_withdraw_role = await contract.hasRole(await contract.WITHDRAW_ROLE(), owner.address)
        expect(has_role).to.equal(true)
        expect(has_withdraw_role).to.equal(true)
    });

    it("Should setup constructor values on deploy", async function () {
        const publicSaleStartTime = getTimeSinceEpoch();
        const [owner] = await ethers.getSigners();
        const contract = await deployContract(
            RESERVED_TOKENS,
            MAX_OMNIPOTENT_SUPPLY,
            publicSaleStartTime);

        expect(await contract.maxTotalSupply()).to.equal(MAX_SUPPLY);
        expect(await contract.getNumberMinted(owner.address)).to.equal(RESERVED_TOKENS);
        expect(await contract.foundersPublicMintStartTime()).to.equal(publicSaleStartTime);
        expect(await contract.omnipotentPublicMintStartTime()).to.equal(publicSaleStartTime);
        expect(await contract.mintPrice()).to.equal(ethers.utils.parseEther("0.1"));
    });

    it("Should mint reserved tokens", async function () {
        const {contract, owner} = await getContractAndUsers();
        expect(await contract.totalSupply()).to.equal(RESERVED_TOKENS);
        expect(await contract.balanceOf(owner.address)).to.equal(RESERVED_TOKENS);
    });
});