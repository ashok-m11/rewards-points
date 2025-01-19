import { useEffect, useState } from "react";
import { handleFetchData } from "../fetchdata";

function Transactions() {
  const [dataSet, setDataSet] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


 
  const fetchDataTransactions = async () => {
    try {
      const res = await handleFetchData();
      return !res.error ? setDataSet(res) : setError(res.error);
    } catch (error) {
      console.error(error); // Add logging here
      setError('Something went wrong');
      return { error: 'Something went wrong' };
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDataTransactions();
  },[]);
 
  
  
  return (
    <div>
  {isLoading && <div role="status" aria-live="polite">Loading...</div>}
  {error && <div className="alert alert-danger" role="alert">Error: {error}</div>}
  
  <h3 className="heading">Transactions</h3> {/* Heading always displayed */}

  {dataSet.length > 0 ? (
     <table className="table  table-hover table-sm caption-top">
      
     <thead className="thead-dark">
       <tr>
         <th scope="col">Transaction Id</th>
         <th scope="col">Customer Name</th>
         <th scope="col">Purchase Date</th>
         <th scope="col">Product Purchased</th>
         <th scope="col" className="text-end">Price</th>
         <th scope="col" className="text-end">Reward Points</th>
       </tr>
     </thead>
     <tbody>
       {dataSet?.map((data) => (
         <tr key={data.transactionId}>
           <td>{data.transactionId}</td>
           <td>{data.customerName}</td>
           <td>{data.purchaseDate}</td>
           <td>{data.productPurchased}</td>
           <td className="text-end">${data.price}</td>
           <td className="text-end">{data.rewardsPoints}</td>
         </tr>
       ))}
     </tbody>
   </table>
  ) : (
    <p>No data available</p> // Display when there's no data
  )}
</div>
);

}

export default Transactions;
