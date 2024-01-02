const ethers = require("ethers");
require('dotenv').config();
const contractAddress = process.env.contract_Address;
const DELAY_MS = 1000;
const provider = new ethers.providers.JsonRpcProvider(
	`https://mainnet.infura.io/v3/${process.env.Infura_API_Key}`
);
// Smart Contract ABI and Address
const contractABI = require("./abi.json");
const RefreshMetaData = async () => {

	// initialize contract to get total supply if supply is fixed then no need to call this function
	// Create a contract instance
	const contract = new ethers.Contract(contractAddress, contractABI, provider);
	const result = await contract.totalSupply();
	const TotalSupply = parseInt(result._hex, 16);
	console.log("TotalSupply:=", TotalSupply);

	// os api call to refresh metadata
	const sdk = require("api")("@opensea/v2.0#acj27lqhfpwaj");
	sdk.auth(process.env.OS_API_KEY);
	sdk.server("https://api.opensea.io");
	for (let i = 0; i < TotalSupply; i++) {
		await refreshMetadata(sdk, i)

		// Delay to avoid rate limiting
		await delay(DELAY_MS);
	}
};

// Delay function to avoid rate limiting
function delay(ms) {
	console.log(`Waiting for ${ms / 1000} seconds...`);
	return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to refresh metadata for an NFT
async function refreshMetadata(sdk, id) {
	try {
		const response = await sdk.refresh_nft({
			chain: 'ethereum',
			address: contractAddress,
			identifier: id.toString(),
		});
		console.log(`Metadata refreshed for ID: ${id}`);
	} catch (err) {
		console.error(`Error refreshing metadata for ID: ${id}`, err);
		// Additional handling for specific rate limit errors can be added here
	}
}
module.exports = { RefreshMetaData };