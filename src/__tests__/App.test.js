import { render, screen } from "@testing-library/react";
import App from "../App";
import TransactionsPage from "../pages/TransactionsPage";

// // Mock the TransactionsPage component
// jest.mock("../pages/TransactionsPage", () => () => (
//   <div>Transactions Page</div>
// ));

describe("App component", () => {
  //beforeEach(() => {
  render(<TransactionsPage />);
  //});
  it("renders the TransactionsPage component", () => {
    render(<App />);

    // Check if TransactionsPage component content is displayed
    const transactionsPage = screen.getByText(/Transaction/i);
    const monthly = screen.getByText(/User Monthly Rewards/i);
    expect(transactionsPage).toBeInTheDocument();
    expect(monthly).toBeInTheDocument();
  });
});
