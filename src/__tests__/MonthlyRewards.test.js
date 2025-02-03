import { render, screen } from "@testing-library/react";
import MonthlyRewards from "../components/MonthlyRewards"; // Update the path accordingly

describe("MonthlyRewards", () => {
  const sampleData = [
    [
      "1-1-2022", // Key - typically, it could be a concatenated string with customerId, month, and year
      {
        customerId: "123",
        customerName: "John Doe",
        month: "January",
        year: "2022",
        rewardsPoints: 100,
      },
    ],
    [
      "2-1-2023",
      {
        customerId: "124",
        customerName: "Jane Doe",
        month: "February",
        year: "2023",
        rewardsPoints: 150,
      },
    ],
  ];

  it("should render the table with correct columns and data", () => {
    render(<MonthlyRewards data={sampleData} />);

    // Check the table headers
    expect(screen.getByText("Customer Id")).toBeInTheDocument();
    expect(screen.getByText("Customer Name")).toBeInTheDocument();
    expect(screen.getByText("Month")).toBeInTheDocument();
    expect(screen.getByText("Year")).toBeInTheDocument();
    expect(screen.getByText("Reward Points")).toBeInTheDocument();

    // Check if rows are rendered correctly
    expect(screen.getByText("123")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("January")).toBeInTheDocument();
    expect(screen.getByText("2022")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();

    expect(screen.getByText("124")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("February")).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();
  });

  it("should not render 'No data available' when data is provided", () => {
    render(<MonthlyRewards data={sampleData} />);

    // Ensure the "No data available" message is not present when data is passed
    expect(screen.queryByText("No data available")).toBeNull();
  });

  it("should display the correct number of rows based on the data", () => {
    render(<MonthlyRewards data={sampleData} />);

    // Check if the correct number of rows (excluding header) is rendered
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(sampleData.length + 1); // +1 for header row
  });
});
