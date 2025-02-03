import { render, screen } from "@testing-library/react";
import Transactions from "../components/Transactions"; // Adjust the import path accordingly

describe("Transactions", () => {
  const sampleData = [
    {
      transactionId: "T1",
      customerName: "John Doe",
      purchaseDate: "01/01/2025",
      productPurchased: "Laptop",
      price: 1000.0,
      rewardsPoints: 150,
    },
    {
      transactionId: "T2",
      customerName: "Jane Doe",
      purchaseDate: "02/01/2025",
      productPurchased: "Smartphone",
      price: 500.0,
      rewardsPoints: 100,
    },
  ];

  it("should render the table with the correct columns and data", () => {
    render(<Transactions data={sampleData} />);

    // Check the table headers
    expect(screen.getByText("Transaction Id")).toBeInTheDocument();
    expect(screen.getByText("Customer Name")).toBeInTheDocument();
    expect(screen.getByText("Purchase Date")).toBeInTheDocument();
    expect(screen.getByText("Product Purchased")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Reward Points")).toBeInTheDocument();

    // Check the first row's values
    expect(screen.getByText("T1")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("01/01/2025")).toBeInTheDocument();
    expect(screen.getByText("Laptop")).toBeInTheDocument();
    expect(screen.getByText("$1000.00")).toBeInTheDocument(); // Price should be formatted with two decimals
    expect(screen.getByText("150")).toBeInTheDocument();

    // Check the second row's values
    expect(screen.getByText("T2")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("02/01/2025")).toBeInTheDocument();
    expect(screen.getByText("Smartphone")).toBeInTheDocument();
    expect(screen.getByText("$500.00")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("should not render 'No transactions available' when data is provided", () => {
    render(<Transactions data={sampleData} />);

    // Ensure that the "No transactions available" message is not shown when there is data
    expect(screen.queryByText("No transactions available")).toBeNull();
  });

  it("should handle missing data gracefully", () => {
    const incompleteData = [
      {
        transactionId: "T1",
        customerName: "John Doe",
        purchaseDate: "01/01/2025",
        productPurchased: "Laptop",
        price: 1000.0,
        rewardsPoints: 150,
      },
      {
        transactionId: "T2",
        customerName: "Jane Doe",
        // Missing purchaseDate
        productPurchased: "Smartphone",
        price: 500.0,
        rewardsPoints: 100,
      },
    ];

    render(<Transactions data={incompleteData} />);

    // Check that all available rows are rendered
    expect(screen.getByText("T1")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("01/01/2025")).toBeInTheDocument();
    expect(screen.getByText("Laptop")).toBeInTheDocument();

    // For T2, ensure missing purchaseDate is handled gracefully
    expect(screen.getByText("T2")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.queryByText("purchaseDate")).toBeNull(); // Ensure purchaseDate does not break the UI
    expect(screen.getByText("Smartphone")).toBeInTheDocument();
  });

  it("should display price with two decimal places", () => {
    const testData = [
      {
        transactionId: "T1",
        customerName: "John Doe",
        purchaseDate: "01/01/2025",
        productPurchased: "Laptop",
        price: 1000,
        rewardsPoints: 150,
      },
    ];

    render(<Transactions data={testData} />);

    // Ensure price is displayed with two decimal places
    expect(screen.getByText("$1000.00")).toBeInTheDocument();
  });
});
