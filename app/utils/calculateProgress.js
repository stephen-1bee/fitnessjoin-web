const calculateProgress = (numerator, denominator) => {
  const PERCENTATE = 100
  const calculation = (numerator / denominator) * PERCENTATE
  const syntesized = Math.round(parseFloat(calculation))
  const finalResult = syntesized

  // finalResult < 0 || finalResult > 100 ? return 0 :

  if (finalResult < 0 || finalResult > 100) {
    return "Out of range"
  } else {
    return finalResult
  }
}

export default calculateProgress
