export const calculateRewardsPoints = (amount) => {
  if (amount <= 50) {
    return 0;
  } else if (amount > 50 && amount <= 100) {
    return amount - 50;
  } else {
    const pointsAbove100 = (amount - 100) * 2;
    const pointsBetween50And100 = 50;
    return pointsAbove100 + pointsBetween50And100;
  }
};

export const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
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

export const aggregateRewardsByMonthYear = (transactions) => {
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

  return Object.entries(
    transactions.reduce((acc, transaction) => {
      const { customerId, customerName, purchaseDate, rewardsPoints } =
        transaction;
      const [day, month, year] = purchaseDate.split("/");
      const key = `${customerId}-${customerName}-${month}-${year}`;
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
};

export const transactionsWithPoints = (data) => {
  const monthsToDisplay = 3;
  const today = new Date();
  const threeMonthsAgo = new Date(
    today.setMonth(today.getMonth() - monthsToDisplay)
  );
  return data
    .filter((transaction) => {
      const purchaseDate = parseDate(transaction.purchaseDate);
      const flooredPrice = Math.floor(transaction.price);
      return (
        !isNaN(transaction.price) &&
        Number.isFinite(transaction.price) &&
        flooredPrice > 50 &&
        purchaseDate >= threeMonthsAgo
      );
    })
    .map((transaction) => {
      const flooredPrice = Math.floor(transaction.price);
      return {
        ...transaction,
        rewardsPoints: calculateRewardsPoints(flooredPrice),
      };
    })
    .sort((a, b) => {
      const dateA = parseDate(a.purchaseDate);
      const dateB = parseDate(b.purchaseDate);
      return dateA - dateB;
    });
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

  // Sort the result by customerName
  result.sort((a, b) => {
    const nameA = a[1].customerName.toLowerCase();
    const nameB = b[1].customerName.toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

  return result;
};
