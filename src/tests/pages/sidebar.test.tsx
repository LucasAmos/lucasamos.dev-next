import { render } from "@testing-library/react";
import Sidebar from "../../components/sidebar";
import { vi } from "vitest";
import { expect } from "vitest";

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // Render a simple img element for testing
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt="test" />;
  }
}));

describe("Sidebar", () => {
  it("Renders correct title", () => {
    const { getByTestId } = render(<Sidebar />);

    const heading = getByTestId("heading4");

    expect(heading).toHaveTextContent("AWS Application Architect");
  });
});
