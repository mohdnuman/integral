const Web3 = require("web3");

const Abi = require("./abi.json");
const tokenAbi = require("./abi2.json");

let web3;

const provider = new Web3.providers.HttpProvider(
  "https://mainnet.infura.io/v3/287af69fca9142f3b1681a93ce4c3afa"
);
web3 = new Web3(provider);

async function getBalance(userAddress, contractAddress) {
  const contractInstance = new web3.eth.Contract(Abi, contractAddress);

  const LPtokenReceived = await contractInstance.methods
    .balanceOf(userAddress)
    .call();
  const LPtotalSupply = await contractInstance.methods.totalSupply().call();
  const reserves = await contractInstance.methods.getReserves().call();
  const token0 = await contractInstance.methods.token0().call();
  const token1 = await contractInstance.methods.token1().call();

  const token0reserve = reserves[0];
  const token1reserve = reserves[1];

  const token0instance = new web3.eth.Contract(tokenAbi, token0);
  const token1instance = new web3.eth.Contract(tokenAbi, token1);
  const decimals0 = await token0instance.methods.decimals().call();
  const decimals1 = await token1instance.methods.decimals().call();
  const symbol0 = await token0instance.methods.symbol().call();
  const symbol1 = await token1instance.methods.symbol().call();

  let token0amount = (
    ((LPtokenReceived / LPtotalSupply) * token0reserve) /
    10 ** decimals0
  ).toFixed(2);
  let token1amount = (
    ((LPtokenReceived / LPtotalSupply) * token1reserve) /
    10 ** decimals1
  ).toFixed(2);

  if (token0amount != 0 && token1amount != 0)
    console.log(symbol0, "+", symbol1, token0amount, "+", token1amount);
}

let address = "0x72135380e83edee278911f8dbdee50c63b3860a1";
let contracts = [
  "0x5dFAe56E344B18bC7cd3B8350721FfdD12Ff2b3C",
  "0x8b0Bb0d0D8B3D83EBb7c1B49d79D74dF396634c6",
  "0x3eD27247A8abF40d3D85171536ea98e5eEd94F40",
  "0x5FB51deDd29b8C065cA3Ac4545b6c58b635616C5",
  "0x4370CFD2c62b6E2900D04af97c4D9552484C0e48",
  "0x01d9984489bD4c5f372a6e6Eca1F22c27A77e355",
  "0xcddD3B9EACce44DDf9d5748C8e8b5F8d630f17EB",
  "0x3fFecc12a6B46C3Aa32aEA38ac34EfbB6C9B6052",
];
for(let i=0;i<contracts.length;i++)
getBalance(address, contracts[i]);
