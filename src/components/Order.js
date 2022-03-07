import React from "react";
import AddedProduct from "./AddedProduct";

const Order = (props) => {
  const {
    addedProducts,
    createLastTransactionObject,
    lastTransactionIsSet,
    addTransaction,
    removeAddedProduct,
    selectedClient,
  } = props;

  const renderAddedProducts = addedProducts.map((product, index) => {
    return (
      <AddedProduct
        key={product.id}
        index={index}
        product={product}
        removeAddedProduct={removeAddedProduct}
      />
    );
  });

  return (
    <div>
      {renderAddedProducts}
      <button
        disabled={
          selectedClient.id === null ||
          selectedClient.id === undefined ||
          lastTransactionIsSet
        }
        onClick={createLastTransactionObject}
      >
        Done
      </button>
      <button disabled={!lastTransactionIsSet} onClick={addTransaction}>
        Confirm transaction
      </button>
      <div style={{ color: "crimson", marginTop: 5, marginBottom: 5 }}>
        {selectedClient.id === null || selectedClient.id === undefined
          ? "Select a Client to complete transaction"
          : null}
      </div>
    </div>
  );
};

export default Order;
