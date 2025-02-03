import PropTypes from "prop-types";
import React, { useState } from "react";

function TotalRewards({ onRowClick, data }) {
  const [selectedRow, setSelectedRow] = useState(null);
  const highlightCustomer = (cusId) => {
    onRowClick(cusId);
    setSelectedRow(cusId);
  };

  return (
    <div>
      <table className="table table-hover  table-sm caption-top">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Customer Name</th>
            <th scope="col" className="text-end">
              Reward Points
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((data) => (
            <tr
              key={data.customerId}
              onClick={() => highlightCustomer(data.customerId)}
              className={data.customerId === selectedRow ? "highlight-row" : ""}
            >
              <td>{data.customerName}</td>
              <td className="text-end">{data.rewardsPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
// PropTypes validation for the `data` prop passed into the component
TotalRewards.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      customerName: PropTypes.string.isRequired,
      rewardsPoints: PropTypes.number.isRequired,
    })
  ).isRequired,
};
export default TotalRewards;
