import React from "react";

const AddedProduct = (props) => {
  const { name, orderQuantity, price, currency } = props.product;
  const { index, removeAddedProduct, product } = props;

  return (
    <div className="product">
      <span className="product__detail product__number">{index + 1}.</span>
      <span className="product__detail product__quantity">
        {orderQuantity} x
      </span>
      <span className="product__detail product__name">{name}</span>
      <span className="product__detail">
        Price:
        <strong className="product__detail">
          {price} {currency}
        </strong>
      </span>
      <span className="product__detail">
        Total:
        <strong className="product__detail">
          {orderQuantity === 0
            ? orderQuantity
            : orderQuantity * price + currency}
        </strong>
      </span>
      <button onClick={() => removeAddedProduct(product)}>Remove</button>
    </div>
  );
};

export default AddedProduct;
