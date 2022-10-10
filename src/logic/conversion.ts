import BigNumber from 'bignumber.js'

export const weiToEth = (amount: string, decimals: number = 18) => {
  return new BigNumber(amount).dividedBy(10 ** decimals).toFixed()
}

export const ethToWei = (amount: string, decimals: number = 18) => {
  return new BigNumber(amount).times(10 ** decimals).toFixed()
}

export const convertToMin = (number: any, slippage: any = 0.5) => {
    const convert = ((parseFloat(number) * slippage) / 100).toFixed(5);
    const convertToWei = ethToWei(convert, 18);
    return convertToWei;
};

export const convertToMax = (number: any, slippage: any = 0.5) => {
    const convert = ((parseFloat(number) * slippage) * 100).toFixed(5);
    const convertToWei = ethToWei(convert, 18);
    return convertToWei;
};

export const isValid = (str: any) => {
  return !/[~`!@#$%\^&*()+=\-\_\[\]\\';,/{}|\\":<>\A-Za-z\? ]/g.test(str)
}

export const validateAndTrim = (val: any, afterDecimal: any = 18) => {
  let t = val.target.value
  if (isValid(t)) {
      val.target.value =
          t.indexOf(".") >= 0
              ? t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), afterDecimal)
              : t
      return val.target.value
  }
  return 0
}