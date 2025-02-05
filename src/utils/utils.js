export const calculateRewardsPoints = (amount) => {
  const flooredAmount = Math.floor(amount);
  if (isNaN(flooredAmount) || flooredAmount <= 0) return 0;

  if (flooredAmount <= 50) return 0;
  if (flooredAmount <= 100) return flooredAmount - 50;

  return (flooredAmount - 100) * 2 + 50;
};

// Utility function to deep clone and sort the data by date
export const sortDataByDate = (data, dateKey) => {
  // Deep clone the data to avoid mutating the original data
  const clonedData = structuredClone(data);
  return clonedData.sort((a, b) => {
    const dateA = parseDate(a[dateKey]);
    const dateB = parseDate(b[dateKey]);

    // Check if the dates are valid (not NaN)
    if (isNaN(dateA) || isNaN(dateB)) {
      return 0; // Handle invalid date
    }

    // Sort the dates (earliest to latest)
    return dateB - dateA;
  });
};

// Utility function to deep clone and sort the data based on a key
export const sortData = (data, sortKey) => {
  // Deep clone the data to avoid mutating the original data
  const clonedData = structuredClone(data);
  return clonedData.sort((a, b) => {
    // Extract values based on the sortKey
    const valA = a[1][sortKey] || ""; // Default to empty string if value is missing
    const valB = b[1][sortKey] || ""; // Default to empty string if value is missing

    if (valA < valB) return -1;
    if (valA > valB) return 1;
    return 0;
  });
};

export const parseDate = (dateStr) => {
  const parsedDate = new Date(dateStr.split("/").reverse().join("-")); // Convert dd/mm/yyyy to yyyy-mm-dd
  const day = parsedDate.getDate();
  const month = parsedDate.getMonth() + 1;
  const year = parsedDate.getFullYear();
  return new Date(`${month}/${day}/${year}`);
};

export const aggregateRewardsByCustomer = (data) => {
  return data.reduce((acc, item) => {
    if (!acc[item.customerId]) {
      acc[item.customerId] = {
        customerName: item.customerName,
        rewardsPoints: 0,
      };
    }
    acc[item.customerId].rewardsPoints += item.rewardsPoints;
    return acc;
  }, {});
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const aggregateRewardsByMonthYear = (transactions) => {
  const result = Object.entries(
    transactions.reduce((acc, transaction) => {
      const { customerId, customerName, purchaseDate, rewardsPoints } =
        transaction;
      // Convert purchaseDate to ISO date (yyyy-mm-dd)
      const parsedDate = new Date(purchaseDate.split("/").reverse().join("-")); // Convert dd/mm/yyyy to yyyy-mm-dd

      const month = parsedDate.getMonth() + 1; // Get month (0-indexed, so add 1)
      const year = parsedDate.getFullYear(); // Extract year

      // Format month to always have 2 digits (e.g., 09 instead of 9)
      const formattedMonth = month < 10 ? `0${month}` : month;
      const key = `${customerId}-${customerName}-${formattedMonth}-${year}`;
      const monthName = monthNames[parseInt(month) - 1];

      if (!acc[key]) {
        acc[key] = {
          customerId,
          customerName,
          month: monthName,
          year,
          rewardsPoints: 0,
        };
      }
      acc[key].rewardsPoints += rewardsPoints;

      return acc;
    }, {})
  );

  // Use the sortData function to sort by customerId
  return sortData(result, "customerId");
};

export const transactionsWithPoints = (data) => {
  const monthsToDisplay = 3;
  const today = new Date();
  const threeMonthsAgo = new Date(
    today.setMonth(today.getMonth() - monthsToDisplay)
  );

  const filteredData = data
    .filter((transaction) => {
      const purchaseDate = parseDate(transaction.purchaseDate);
      return purchaseDate >= threeMonthsAgo && transaction.price > 50;
    })
    .map((transaction) => {
      // Calculate rewards points for each transaction
      const rewardsPoints = calculateRewardsPoints(transaction.price);

      // Only return the transaction if rewardsPoints are greater than 0
      if (rewardsPoints > 0) {
        return {
          ...transaction,
          rewardsPoints,
        };
      }

      // Skip the transaction if rewardsPoints are 0
      return null;
    })
    .filter((transaction) => transaction !== null); // Remove any null transactions

  // Use the sortDataByDate function to sort by purchaseDate
  return sortDataByDate(filteredData, "purchaseDate");
};

export const aggregateRewardsByCustomerUtil = (transactions) => {
  const result = Object.entries(
    transactions.reduce((acc, transaction) => {
      const { customerId, customerName, rewardsPoints } = transaction;
      const key = `${customerId}-${customerName}`;

      if (!acc[key]) {
        acc[key] = {
          customerId,
          customerName,
          rewardsPoints: 0,
        };
      }
      acc[key].rewardsPoints += rewardsPoints;
      return acc;
    }, {})
  );

  // Use the sortData function to sort by customerName
  return sortData(result, "customerName");
};
