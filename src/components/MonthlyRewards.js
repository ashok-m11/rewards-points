import PropTypes from "prop-types";
function MonthlyRewards({ selectedRow, data }) {
  return (
    <div>
      <table className="table table-hover table-sm caption-top">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Customer Id</th>
            <th scope="col">Customer Name</th>
            <th scope="col">Month</th>
            <th scope="col">Year</th>
            <th scope="col" className="text-end">
              Reward Points
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map(([key, item]) => (
            <tr
              key={key}
              className={
                `${item.customerId}-${item.customerName}` === selectedRow
                  ? "highlight-row"
                  : ""
              }
            >
              <td>{item.customerId}</td>
              <td>{item.customerName}</td>
              <td>{item.month}</td>
              <td>{item.year}</td>
              <td className="text-end">{item.rewardsPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

MonthlyRewards.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        customerId: PropTypes.string.isRequired,
        customerName: PropTypes.string.isRequired,
        month: PropTypes.string.isRequired,
        year: PropTypes.string.isRequired,
        rewardsPoints: PropTypes.number.isRequired,
      })
    )
  ).isRequired,
};
export default MonthlyRewards;
