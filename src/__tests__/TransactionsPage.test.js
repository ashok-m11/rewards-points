import { render, screen, waitFor } from "@testing-library/react";
import TransactionsPage from "../pages/TransactionsPage";
import { handleFetchData } from "../services/fetchData";

// Mocking the services
jest.mock("../services/fetchData");
jest.mock("../utils/logger", () => ({
  error: jest.fn(),
  warn: jest.fn(),
}));

describe("TransactionsPage", () => {
  it("should display loading state initially", () => {
    render(<TransactionsPage />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading...");
  });

  it("should display error message when fetch fails", async () => {
    // Simulate fetch error
    handleFetchData.mockRejectedValue(new Error("Network Error"));

    render(<TransactionsPage />);

    await waitFor(() => {
      expect(
        screen.getByText("Error: Something went wrong")
      ).toBeInTheDocument();
    });
  });

  it('should display "No data available" when no transactions data is available', async () => {
    const mockData = []; // Simulating no transactions data

    // Mocking the data fetching function to resolve to an empty array
    handleFetchData.mockResolvedValue(mockData);

    // Render the component
    render(<TransactionsPage />);

    // Wait for the loading text to disappear
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    // After loading is done, check for all instances of "No data available"
    const noDataElements = await screen.findAllByText("No data available");
    expect(noDataElements.length).toBeGreaterThan(0); // Ensure that the text appears in at least one place
  });

  it("should render data correctly when transactions data is available", async () => {
    // Mocking data that will be returned from the API
    const mockData = [
      {
        transactionId: "1",
        customerName: "John Doe",
        purchaseDate: "01/10/2025",
        productPurchased: "Product A",
        price: 100,
        rewardsPoints: 50,
      },
      {
        transactionId: "2",
        customerName: "Jane Smith",
        purchaseDate: "01/11/2025",
        productPurchased: "Product B",
        price: 150,
        rewardsPoints: 150,
      },
    ];

    handleFetchData.mockResolvedValue(mockData);

    // Render the TransactionsPage
    render(<TransactionsPage />);

    // Wait for the data to be loaded
    await waitFor(() => screen.findAllByText("John Doe")); // Use findAllByText to get all occurrences

    // Now that the data is available, perform separate assertions
    const johnDoeElements = screen.getAllByText("John Doe");
    expect(johnDoeElements.length).toBeGreaterThan(0); // Check if there is at least one "John Doe"

    expect(screen.getByText("Product A")).toBeInTheDocument(); // Product A should be in the table
    expect(screen.getByText("$100.00")).toBeInTheDocument(); // $100.00 should be in the table
  });
  it("should display 'No data available' when monthly rewards data is empty", async () => {
    // Simulate successful fetch with empty data for monthly rewards
    handleFetchData.mockResolvedValue([]);

    render(<TransactionsPage />);

    await waitFor(() => {
      const noDataElements = screen.queryAllByText("No data available");

      // Assert that there are three instances of 'No data available' (one for each section)
      expect(noDataElements.length).toBe(3);
    });
  });

  it("should display 'No data available' when total rewards data is empty", async () => {
    handleFetchData.mockResolvedValue([]);

    render(<TransactionsPage />);

    await waitFor(() => {
      const noDataElements = screen.queryAllByText("No data available");

      // Assert that there are three instances of 'No data available' (one for each section)
      expect(noDataElements.length).toBe(3);
    });
  });
});
