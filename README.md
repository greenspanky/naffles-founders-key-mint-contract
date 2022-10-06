# Naffles Founders Key Mint Bounty
This repository contain the smart contract for the Founders key mint.

## Tests
Tests can be run using `npx hardhat test`

A few convenient methods are provided such as contract and allowlist creation 

## Contract description
Mint will consist of 2 phases

- Omnipotent Key mint
- Founders Key mint

The phases will consist of 1 allowlist sale, 1 waitlist sale and 1 public sale.

Allowlist and waitlist will use the same omnipotentAllowlistMint method.

You can create allowlists with the createAllowlist method. The allowlist accepts 1 of the 2 phases. This allows us to create as many allowlists/waitlists merkle trees as necessary each with their own start and end time and allocation. 

We could for example have 3 different discord roles each with different allocations for the allowlist mint.

We will automatically mint x amount of omnipotent mints when we upload the contract
There is an AdminMint available for phase 2.

We will need to have on chain data for the type of each pass so that we can request on chain if a user has a specific pass.
token id 1-MAX_OMNIPOTENT_SUPPLY wil always be the omnipotent card (type 1). But the other passes will be randomly generated off chain, and posted on chain afterward.

## Bounty
The goal of this bounty hunt is to write a test that will break the contract:

- Mint more than you're allowed.
- Mint for less money than you're supposed to.
- Get access to funds you're not supposed to access.
- Exploit the contract in any other breaking way.


Create a seperate branch and create pull pequest with your changes and your discord ID in the description. 
