/**
 * @jest-environment jsdom
 */

import { render } from "@testing-library/react";
import Date from "../../components/date";
import "@testing-library/jest-dom";

it("renders correctly", () => {
  const { container } = render(<Date dateString="2020-09-19" />);
  expect(container).toMatchSnapshot();
});

describe("Date", () => {
  it("renders correct date", () => {
    const { getByTestId } = render(<Date dateString="2020-09-19" />);

    const date: HTMLElement = getByTestId("date");

    expect(date).toHaveTextContent("September 19, 2020");
  });
});
