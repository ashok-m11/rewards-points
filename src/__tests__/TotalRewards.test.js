import { render, screen } from "@testing-library/react";
import TotalRewards from "../components/TotalRewards"; // Adjust the import path accordingly

describe("TotalRewards", () => {
  const sampleData = [
    {
      customerId: "1",
      customerName: "John Doe",
      rewardsPoints: 150,
    },
    {
      customerId: "2",
      customerName: "Jane Doe",
      rewardsPoints: 200,
    },
  ];

  it("should render the table with correct columns and data", () => {
    render(<TotalRewards data={sampleData} />);

    // Check the table headers
    expect(screen.getByText("Customer Name")).toBeInTheDocument();
    expect(screen.getByText("Reward Points")).toBeInTheDocument();

    // Check if rows are rendered correctly
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
  });

  it("should not render 'No data available' when data is provided", () => {
    render(<TotalRewards data={sampleData} />);

    // Ensure the 'No data available' message is not shown when data is provided
    expect(screen.queryByText("No data available")).toBeNull();
  });

  it("should render only the rows that match the data", () => {
    render(<TotalRewards data={sampleData} />);

    // Ensure only the correct number of rows are rendered
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(3); // 2 data rows + 1 header row
  });
});
