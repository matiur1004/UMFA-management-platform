export const diffUsages = (usage: number, averageUsage: number) => {
  return (usage - averageUsage).toFixed(2)
};

export const abnormalityLevel = (usage: number, averageUsage: number) => {
  return (usage - averageUsage) / averageUsage * 100
}

export const percentUsage = (usage: number, averageUsage: number) => {
  if (usage && !averageUsage || !usage && averageUsage) {
    return 100;
  }

  if (!usage || !averageUsage) {
    return 0;
  }

  return Math.abs(((usage - averageUsage) / averageUsage) * 100).toFixed(2);
};

export const periodName = (periodName: string, arrLength: number = 3) => {
  return periodName.substr(0, arrLength);
};

export const calculateReadingByUsage = (usage: number, averageUsage: number) => {
  let str = '';
  const diffUsage = +diffUsages(usage, averageUsage);

  if (diffUsage > 0) {
    str += '+' + diffUsage;
  } else {
    str += diffUsage;
  }

  return str;
};
