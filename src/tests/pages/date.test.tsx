/**
 * @jest-environment jsdom
 */

import { cleanup, render } from "@testing-library/react";
import Date from "../../components/date";
import { afterEach, describe, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

describe("Date", () => {
  test("renders correctly", () => {
    const { container } = render(<Date dateString="2020-09-19" />);
    expect(container).toMatchSnapshot();
  });

  test("Displays correct date", () => {
    const { getByTestId } = render(<Date dateString="2020-09-19" />);

    const date: HTMLElement = getByTestId("date");

    expect(date).toHaveTextContent("September 19, 2020");
  });
});
