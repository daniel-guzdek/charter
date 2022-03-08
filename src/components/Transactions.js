import React from "react";
import Transaction from "./Transaction";
import { Typography } from "@mui/material";

const Transactions = (props) => {
  const { transactions } = props;

  return (
    <>
      <Typography variant="h6" component={"h6"} style={{ marginLeft: 12 }}>
        Transactions: <span>{transactions.length}</span>
      </Typography>

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
    </>
  );
};

export default Transactions;
