/**
 * @jest-environment jsdom
 */

import { render } from "@testing-library/react";
import Sidebar from "../../components/sidebar";
import "@testing-library/jest-dom";

describe("Sidebar", () => {
  it("Renders correct title", () => {
    const { getByTestId } = render(<Sidebar />);

    const heading = getByTestId("heading4");

    expect(heading).toHaveTextContent("Cloud Software Engineer");
  });
});
