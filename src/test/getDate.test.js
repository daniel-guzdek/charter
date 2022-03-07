import { getDate } from "../functions/getDate";

const date =
  "Mon Mar 07 2022 18:44:06 GMT+0100 (Central European Standard Time) {}";

test("Input data is converted to: 2022/03/07", () => {
  expect(getDate(date, false)).toBe("2022/03/07");
});
