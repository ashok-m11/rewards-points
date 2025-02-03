import { render, screen } from "@testing-library/react";
import App from "../App";

// Mock the TransactionsPage component
jest.mock("../pages/TransactionsPage", () => () => (
  <div>Transactions Page</div>
));

describe("App component", () => {
  it("renders the TransactionsPage component", () => {
    render(<App />);
    // Check if TransactionsPage component content is displayed
    const transactionsPage = screen.getByText(/Transactions Page/i);
    expect(transactionsPage).toBeInTheDocument();
  });
});
