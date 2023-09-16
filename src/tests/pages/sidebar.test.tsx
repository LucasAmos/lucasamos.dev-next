/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import Sidebar from "../../pages/sidebar";
import "@testing-library/jest-dom";
import React from "react";

describe("Sidebar", () => {
  it("Renders correct title", () => {
    render(<Sidebar />);

    const heading = screen.getByTestId("heading4");

    expect(heading).toHaveTextContent("Cloud Software Engineer");
  });
});
