function calculate() {
    let currentTotal = totalPoolLiquidity;
    let monthlyPNKReward = 300000;
    let pnkUSDValue = tokenToETHValue[pnkContractAddress] * ETHPrice;
    let monthlyPNKRewardInUSD = monthlyPNKReward * pnkUSDValue;
    let amountToInvest = Number(document.getElementById("calculate-amount").value);
    let pnkAmount = (monthlyPNKReward * amountToInvest)/(currentTotal+amountToInvest);
    document.getElementById("pnk").innerHTML = pnkAmount;
    document.getElementById("dollar").innerHTML = pnkAmount * pnkUSDValue;
    document.getElementById("apr").innerHTML = (((1+monthlyPNKRewardInUSD/(currentTotal+amountToInvest)) ** 12) - 1) * 100;
}