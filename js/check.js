// Variables
let FPMMs;
let FPMMGQLQuery = "{ fixedProductMarketMakers(first: 1000) { id creator collateralToken liquidityParameter scaledLiquidityParameter title arbitrator answerFinalizedTimestamp } }";
let FPMMGQLData = {
	"query": FPMMGQLQuery,
	"variables": {}
};
let ETHPriceGQLQuery = '{ bundle(id: "1" ) { ethPrice } }';
let ETHPriceGQLData = {
	"query": ETHPriceGQLQuery,
	"variables": {}
};
let TokenGQLQuery = '';
let TokenGQLData;

let omenURL = "https://api.thegraph.com/subgraphs/name/gnosis/omen";
let uniswapURL = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2";
let pnkContractAddress = "0x93ed3fbe21207ec2e8f2d3c3de6e058cb73bc04d";

let ETHPrice;
let uniqueTokenArray = new Set();
let tokenToETHValue = {};
let tokenDecimal = {};
let totalPoolLiquidity = 0;
let individualTotalPoolTokeninUSDValue;
let monthlyPNKReward = 300000;
let sortedFPMM;

let marketList = '';

// Functions
function addFPMMList(Title, FPMM, PNKAmount, PNKUSDAmount, USDAmount){
	let head = 
	'<table class="table table-striped" id="market-table">'+
	'<thead class="thead-dark" id="market-table-head"><tr>'+
	'<th scope="col">Title</th>'+
	'<th scope="col">Pool Liquidity</th>'+
	'<th scope="col">Monthly PNK</th>'+
	'<th scope="col">Monthly PNK ($)</th>'+
	'</tr></thead>'+
	'<tbody>';
	let bottom = '</tbody></table>';
	marketList +=
	'<tr>'+
	'<th scope="row"><a href="https://omen.eth.link/#/'+FPMM+'" target="_blank">'+Title+'</a></th>'+
	'<td>$'+USDAmount+'</td>'+
	'<td class="PNKAmount">'+PNKAmount+'</td>'+
	'<td class="PNKUSDAmount">$'+PNKUSDAmount+'</td>'+
	'</tr>';

	document.getElementById('market-list').innerHTML = head + marketList + bottom;
}

// Taking individual FixedProductMarketMakers and their corresponding details.
fetch(omenURL, {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify(FPMMGQLData),
})
.then(response => response.json())
.then(data => {
	FPMMs = data.data.fixedProductMarketMakers;
	console.log('Successfully queried the FPMM Data');
})
.catch((error) => {
	console.error('Error:', error);
})
.then(async function (){
// Getting only unique tokens to get the token data.
	document.getElementById('status').innerHTML = "Finding only unique tokens to query it's price...";
	FPMMs.forEach(FPMM => {
		uniqueTokenArray.add(FPMM.collateralToken.toLowerCase());
	});
	// Adding PNK Token Also for Reward Calculation
	uniqueTokenArray.add(pnkContractAddress);

	document.getElementById('status').innerHTML = "Finding the price of ETH at the moment...";

	await fetch(uniswapURL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(ETHPriceGQLData),
	})
	.then(response => response.json())
	.then(data => {
		ETHPrice = data.data.bundle.ethPrice;
		console.log('Successfully queried the ETH Price');
	})
	.catch((error) => {
		console.error('Error:', error);
	});

})
.then(async function (){
	document.getElementById('status').innerHTML = "Finding the price of all the tokens in the liquidity pool...";
	let tokenLength = uniqueTokenArray.size;
	let index = 1;
	// Creating query for GraphQL
	for (let Token of uniqueTokenArray) {
		TokenGQLQuery += 'Token'+index+': token(id: "'+Token+'"){ id name decimals derivedETH } ';
		index += 1;
	}
	TokenGQLQuery = '{ ' + TokenGQLQuery + '}';
	TokenGQLData = {
		"query": TokenGQLQuery,
		"variables": {}
	};
	await fetch(uniswapURL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(TokenGQLData),
	})
	.then(response => response.json())
	.then(data => {
		for (let index = 1; index <= tokenLength; index++) {
			let token = 'Token'+index;
			tokenToETHValue[data.data[token].id] = data.data[token].derivedETH;
			tokenDecimal[data.data[token].id] = data.data[token].decimals;
		}
		console.log('Successfully queried the Token Price');
	})
	.catch((error) => {
		console.error('Error:', error);
	});
})
.then(function() {
    document.getElementById('status').innerHTML = "Finding the pool liquidity of all the markets...";
	// Finally this calculates the entire amount in USD from Pool Markets.
	FPMMs.forEach(FPMM => {
		if(FPMM.arbitrator == "0xd47f72a2d1d0e91b0ec5e5f5d02b2dc26d00a14d"
		&& FPMM.answerFinalizedTimestamp == null
		&& FPMM.scaledLiquidityParameter != 0
		&& FPMM.creator != "0xacbc967d956f491cadb6288878de103b4a0eb38c"
		&& FPMM.creator != "0x32981c1eeef4f5af3470069836bf95a0f8ac0508"){
			individualTotalPoolTokeninUSDValue = FPMM.scaledLiquidityParameter * tokenToETHValue[FPMM.collateralToken] * ETHPrice;
			totalPoolLiquidity += individualTotalPoolTokeninUSDValue;
		}
		totalPoolLiquidity = Math.ceil(totalPoolLiquidity);
		document.getElementById("omen-market-usd").innerHTML = totalPoolLiquidity;
	});
})
.then(function() {
	document.getElementById('status').innerHTML = "Creating the table list...";
	sortedFPMM = FPMMs.sort((a, b) => (a.scaledLiquidityParameter * tokenToETHValue[a.collateralToken] < b.scaledLiquidityParameter * tokenToETHValue[b.collateralToken]) ? 1 : -1);
	// This makes the table entries
	sortedFPMM.forEach(FPMM => {
		if(FPMM.arbitrator == "0xd47f72a2d1d0e91b0ec5e5f5d02b2dc26d00a14d"
		&& FPMM.answerFinalizedTimestamp == null
		&& FPMM.scaledLiquidityParameter != 0
		&& FPMM.creator != "0xacbc967d956f491cadb6288878de103b4a0eb38c"
		&& FPMM.creator != "0x32981c1eeef4f5af3470069836bf95a0f8ac0508"){
			individualTotalPoolTokeninUSDValue = Math.ceil(FPMM.scaledLiquidityParameter * tokenToETHValue[FPMM.collateralToken] * ETHPrice);
			let pnkAmount = Math.ceil(monthlyPNKReward * individualTotalPoolTokeninUSDValue / totalPoolLiquidity);
			let PNKUSDAmount = Math.ceil(monthlyPNKReward * tokenToETHValue[pnkContractAddress] * ETHPrice * individualTotalPoolTokeninUSDValue / totalPoolLiquidity);

			// Here we are adding the FPMM List with their respective USD Value
			addFPMMList(FPMM.title, FPMM.id, pnkAmount, PNKUSDAmount, individualTotalPoolTokeninUSDValue);
		}
		document.getElementById("omen-market-usd").innerHTML = Math.ceil(totalPoolLiquidity);
	});
})
.then(function() {
    document.getElementById('status').innerHTML = "Done!";
    document.getElementById('status').innerHTML = "";
    document.getElementById("calculate-amount").value = 100;
    calculate();
});