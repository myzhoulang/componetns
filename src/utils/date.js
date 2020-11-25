// 获取上一年
export const preYear = (date = new Date()) => {
  const oDate = date instanceof Date ? date : new Date(date);
  const year = oDate.getFullYear();
  const preDate = new Date();
  preDate.setFullYear(year - 1);

  return preDate;
};

// 获取上一季度
export const getQuarter = (index = 0, date = new Date()) => {
  const oDate = date instanceof Date ? date : new Date(date);
  const currentYear = oDate.getFullYear();
  const currentMonth = oDate.getMonth();
  let year = currentYear;
  let quarter = parseInt(currentMonth / 3, 10);
  if (index === -1) {
    if (currentMonth < 3) {
      year = currentYear - 1;
      quarter = 4;
    }
  }

  return {
    year,
    quarter,
  };
};
