/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import renderer from "react-test-renderer";
import Date from "../../components/date";
import "@testing-library/jest-dom";
import React from "react";

it("renders correctly", () => {
  const tree = renderer.create(<Date dateString="2020-09-19" />).toJSON();
  expect(tree).toMatchSnapshot();
});

describe("Date", () => {
  it("renders correct date", () => {
    render(<Date dateString="2020-09-19" />);

    const date: HTMLElement = screen.getByTestId("date");

    expect(date).toHaveTextContent("September 19, 2020");
  });
});
