import React from "react";
import Paper from "@mui/material/Paper";

const Transaction = (props) => {
  const { index, transaction } = props;

  const renderProducts = transaction.products.map((product) => {
    return (
      <li key={product.id}>
        <strong>{product.orderQuantity}x</strong>
        <em>{product.name}</em>
        <strong>Price:</strong>
        <em>
          {product.price} {product.currency}
        </em>
        <strong>Total:</strong>
        <em>
          {(product.orderQuantity * product.price).toFixed(2)}{" "}
          {product.currency}
        </em>
      </li>
    );
  });

  return (
    <Paper style={{ margin: 10, padding: 10 }}>
      <div key={transaction.id}>
        {transaction !== {} && (
          <div>
            <strong>{index + 1}.</strong>
            <strong>Date:</strong>
            <em>{transaction.date}</em>
            <strong>Total value:</strong>
            <em>
              {transaction.totalValue.toFixed(2)} {transaction.currency}
            </em>
            <strong>Client:</strong>
            <em>
              {transaction.client === undefined ||
              transaction.client.name === undefined
                ? ""
                : transaction.client.name}
            </em>
            <strong>Points:</strong>
            <em>{transaction.totalPoints}</em>
            <div style={{ marginTop: 10, marginLeft: 30 }}>
              <strong>Products:</strong>
              <ul>
                {transaction.products === undefined
                  ? "There are no products"
                  : renderProducts}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Paper>
  );
};

export default Transaction;
