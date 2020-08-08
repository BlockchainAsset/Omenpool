function calculate() {
    let currentTotal = totalPoolLiquidity;
    let pnkUSDValue = tokenToETHValue[pnkContractAddress] * ETHPrice;
    let monthlyPNKRewardInUSD = monthlyPNKReward * pnkUSDValue;
    let amountToInvest = Number(document.getElementById("calculate-amount").value);
    let pnkAmount = (monthlyPNKReward * amountToInvest)/(currentTotal+amountToInvest);
    document.getElementById("pnk").innerHTML = Math.ceil(pnkAmount);
    document.getElementById("dollar").innerHTML = Math.ceil(pnkAmount * pnkUSDValue);
    document.getElementById("apr").innerHTML = Math.ceil((((1+monthlyPNKRewardInUSD/(currentTotal+amountToInvest)) ** 12) - 1) * 100 * 100)/100;
}