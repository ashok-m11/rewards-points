import PropTypes from "prop-types";
function Transactions({ selectedRow, data }) {
  return (
    <div>
      <table className="table table-hover table-sm caption-top">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Transaction Id</th>
            <th scope="col">Customer Name</th>
            <th scope="col">Purchase Date</th>
            <th scope="col">Product Purchased</th>
            <th scope="col" className="text-end">
              Price
            </th>
            <th scope="col" className="text-end">
              Reward Points
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((data, index) => (
            <tr
              key={`${data.transactionId}-${index}`}
              className={data.customerId === selectedRow ? "highlight-row" : ""}
            >
              <td>{data.transactionId}</td>
              <td>{data.customerName}</td>
              <td>{data.purchaseDate}</td>
              <td>{data.productPurchased}</td>
              <td className="text-end">${data.price.toFixed(2)}</td>
              {/* Price with two decimals */}
              <td className="text-end">{data.rewardsPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
// PropTypes validation for the `data` prop passed into the component
Transactions.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      transactionId: PropTypes.string.isRequired,
      customerName: PropTypes.string.isRequired,
      purchaseDate: PropTypes.string.isRequired,
      productPurchased: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      rewardsPoints: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Transactions;
