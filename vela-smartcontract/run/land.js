// const Token = await ethers.getContractFactory("Token")
// const token = await Token.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3")
const hre = require("hardhat");
const address = "0x094F43ab5027aA586fb37b5BD34b6F3b620219c1";
const sponser = require("../assets/sponser.json");
async function main() {
	const contract = await hre.ethers.getContractFactory("Land");
	const deploy = await contract.attach(address);

	const length = sponser.length;
	const perRound = 10;
	const round = Math.round(length / 10);
	console.log(round);
	for (let i = 0; i < round; i++) {
		const arr = {
			x: [],
			y: [],
		};
		for (
			let loop = i * perRound;
			loop < (round == i - 1 ? length % perRound : 10);
			loop++
		) {
			console.log("index", i * perRound + loop);
			arr.x.push(sponser[i * perRound + loop].x);
			arr.y.push(sponser[i * perRound + loop].y);
		}
		console.log("arr", arr);
		// await deploy.addRestrictedArea(arr.x, arr.y);
	}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
