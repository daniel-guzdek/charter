export const countScore = (addedProducts, scoreIsCounted) => {
  const transactionTotalValue = addedProducts.reduce(
    (totalValue, product) => totalValue + product.orderQuantity * product.price,
    0
  );

  if (addedProducts.length && transactionTotalValue > 100) {
    scoreIsCounted = true;
    return (
      (transactionTotalValue - 100) * 2 +
      (transactionTotalValue - 50)
    ).toFixed(1);
  } else if (
    addedProducts.length &&
    transactionTotalValue > 50 &&
    transactionTotalValue <= 100
  ) {
    scoreIsCounted = true;
    return ((transactionTotalValue - 50) * 1).toFixed(1);
  } else if (addedProducts.length && transactionTotalValue <= 50) {
    scoreIsCounted = true;
    return 0;
  }
};
