import PropTypes from "prop-types";
import React, { useState } from "react";

function TotalRewards({ onRowClick, data }) {
  const [selectedRow, setSelectedRow] = useState(null);

  const highlightCustomer = (customer) => {
    onRowClick(customer);
    setSelectedRow(customer);
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
          {data.map(([key, item]) => (
            <tr
              key={key}
              onClick={() => highlightCustomer(key)}
              className={key === selectedRow ? "highlight-row" : ""}
            >
              <td>{item.customerName}</td>

              <td className="text-end">{item.rewardsPoints}</td>
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
