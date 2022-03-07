import React from "react";

const Product = (props) => {
  const { index, increaseQuantity, decreaseQuantity, addItem, product } = props;
  const { name, price, currency, amount, orderQuantity } = props.product;

  return (
    <div className="product">
      <span className="product__detail product__number">{index + 1}.</span>
      <button
        disabled={orderQuantity <= 0 ? true : false}
        onClick={() => decreaseQuantity(product.id)}
      >
        -
      </button>
      <span className="product__detail product__name">{name}</span>
      <button
        disabled={amount <= 0 ? true : false}
        onClick={() => increaseQuantity(product.id)}
      >
        +
      </button>
      <span className="product__detail product__number">
        Items:
        <strong className="product__detail product__number">
          {orderQuantity}
        </strong>
      </span>
      <span className="product__detail product__number">
        Items left:
        <strong className="product__detail product__number">{amount}</strong>
      </span>
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
      <button
        disabled={orderQuantity === 0 ? true : false}
        onClick={() => addItem(product)}
      >
        Add
      </button>
    </div>
  );
};

export default Product;
