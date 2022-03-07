import React from "react";
import Transaction from "./Transaction";

const Transactions = (props) => {
  const { transactions } = props;

  return (
    <div>
      <strong>Transactions: </strong>
      <span>{transactions.length}</span>
      <div style={{ marginTop: 10 }}>
        {transactions.length &&
          transactions.map((transaction, index) => {
            return (
              <Transaction
                key={transaction.id}
                index={index}
                transaction={transaction}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Transactions;
