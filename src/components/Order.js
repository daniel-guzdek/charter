import React from "react";
import AddedProduct from "./AddedProduct";
import AlertInfo from "./AlertInfo";

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
      <div
        style={{
          marginTop: 30,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          disabled={
            selectedClient.id === null ||
            selectedClient.id === undefined ||
            lastTransactionIsSet
          }
          onClick={createLastTransactionObject}
          style={{ width: 80, height: 50, borderRadius: 4, margin: 5 }}
        >
          Done
        </button>
        <button
          disabled={!lastTransactionIsSet}
          onClick={addTransaction}
          style={{ width: 120, height: 50, borderRadius: 4, margin: 5 }}
        >
          Confirm transaction
        </button>
      </div>
      {selectedClient.id === null || selectedClient.id === undefined ? (
        <AlertInfo
          message={"Select a Client to complete transaction"}
          severity={"error"}
        />
      ) : null}
    </div>
  );
};

export default Order;
