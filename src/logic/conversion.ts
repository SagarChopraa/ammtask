import BigNumber from 'bignumber.js'

export const weiToEth = (amount: string, decimals: number) => {
  return new BigNumber(amount).dividedBy(10 ** decimals).toFixed()
}

export const ethToWei = (amount: string, decimals: number) => {
  return new BigNumber(amount).times(10 ** decimals).toFixed()
}

export const convertToMin = (number: any) => {
    const convert = ((parseFloat(number) * 0.5) / 100).toFixed(5);
    const convertToWei = ethToWei(convert, 18);
    return convertToWei;
};

export const convertToMax = (number: any) => {
    const convert = ((parseFloat(number) * 0.5) * 100).toFixed(5);
    const convertToWei = ethToWei(convert, 18);
    return convertToWei;
};