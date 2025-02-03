export const calculatePoints = (amount) => {
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
