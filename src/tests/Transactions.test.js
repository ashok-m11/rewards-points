import { render, screen, waitFor } from '@testing-library/react';
import Transactions from '../components/Transactions';
import { handleFetchData } from '../fetchdata';

// Mock handleFetchData function
jest.mock('../fetchdata');

describe('Transactions Component', () => {
  
  it('displays loading state initially', () => {
    render(<Transactions />);
    
    // Check if loading spinner is shown initially
    expect(screen.getByRole('status')).toHaveTextContent('Loading...');
  });

  it('displays error message when fetching data fails', async () => {
    // Mock the handleFetchData function to simulate an error
    handleFetchData.mockRejectedValueOnce(new Error('Something went wrong'));

    render(<Transactions />);

    // Wait for error message to appear
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Error: Something went wrong'));
  });

  it('displays transactions table when data is fetched successfully', async () => {
    // Mock the handleFetchData function to return successful data
    handleFetchData.mockResolvedValueOnce([
      {
        transactionId: '1',
        customerName: 'Alice',
        purchaseDate: '01/01/2021',
        productPurchased: 'Laptop',
        price: 1000,
        rewardsPoints: 100,
      },
      {
        transactionId: '2',
        customerName: 'Bob',
        purchaseDate: '02/01/2021',
        productPurchased: 'Phone',
        price: 800,
        rewardsPoints: 80,
      },
    ]);

    render(<Transactions />);

    // Wait for the header to be rendered
     // Use findByText to directly wait for elements to appear
     expect(await screen.findByText('Transactions')).toBeInTheDocument();
     expect(await screen.findByText('Alice')).toBeInTheDocument();
     expect(await screen.findByText('Bob')).toBeInTheDocument();
     expect(await screen.findByText('$1000')).toBeInTheDocument();
     expect(await screen.findByText('100')).toBeInTheDocument();
  });

  it('displays "No data available" message when there is no data', async () => {
    // Mock the handleFetchData function to return an empty array
    handleFetchData.mockResolvedValueOnce([]);

    render(<Transactions />);

    // Wait for "No data available" message to appear
   
    expect(await screen.findByText('No data available')).toBeInTheDocument();
  });
});
