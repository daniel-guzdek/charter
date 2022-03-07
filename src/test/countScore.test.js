import { countScore } from "../functions/countScore";

const orderData = [
  {
    id: 1,
    price: 72,
    orderQuantity: 1,
  },
  {
    id: 2,
    price: 45.9,
    orderQuantity: 6,
  },
  {
    id: 3,
    price: 12.6,
    orderQuantity: 3,
  },
];

test("The number of points resulting from the order data is equal to 905.6", () => {
  expect(countScore(orderData, false)).toBe("905.6");
});
