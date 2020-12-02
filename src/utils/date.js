import * as dayjs from 'dayjs';

/**
 * 以指定的某一个时间为基础，向上或向下获取日期
 * @param date      {Date | number | string}  基础的时间
 * @param step      {number}                  向上或向下几天获取新的时间
 * @return          {Date}                    获取到的新的对象
 */
export const getDate = (date = new Date(), step = 0) => {
  const oDate = date instanceof Date ? date : new Date(date);
  const d = oDate.getDate();
  const newDate = new Date(oDate);
  newDate.setDate(d + step);
  return newDate;
};

/**
 * 以指定的某一个时间为基础，向上或向下获取日期
 * @param date      {Date | number | string}  基础的时间
 * @param step      {number}                  向上或向下几年获取新的时间
 * @return          {Date}                    获取到的新的对象
 */
export const getYear = (date = new Date(), step = 0) => {
  const oDate = date instanceof Date ? date : new Date(date);
  const year = oDate.getFullYear();
  const newDate = new Date();
  newDate.setFullYear(year + step);
  return newDate;
};

/**
 * 以指定的某一个时间为基础，向上或向下获取日期
 * @param date      {Date | number | string}  基础的时间
 * @param step      {number}                  向上或向下几周获取新的时间
 * @return          {Array}                   获取到的一周日期
 */
export const getWeeks = (date = new Date(), step = 0) => {
  const d = getDate(date, step * 7);
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(
      dayjs(d)
        .day(i)
        .format('YYYY/MM/DD'),
    );
  }
  return days;
};

/**
 * 以指定的某一个时间为基础，向上或向下获取日期
 * @param date      {Date | number | string}  基础的时间
 * @param step      {number}                  向上或向下几年获取新的时间
 * @return          {Date}                    获取到的新的对象
 */
export const getMonth = (date = new Date(), step = 0) => {
  const oDate = date instanceof Date ? date : new Date(date);
  const month = oDate.getMonth();
  const newDate = new Date(oDate);
  newDate.setMonth(month + step);
  return newDate;
};

/**
 * 以指定的某一个时间为基础，向上或向下获取季度
 * @param date      {Date | number | string}  基础的时间
 * @param step      {number}                  向上或向下几年获取新的时间
 * @return          {Object}                  获取到的新的对象
 */
export const getQuarter = (date = new Date(), step = 0) => {
  // 获取当前时间的季度
  const compQuarter = (date = new Date()) => {
    // 当前传入的时间
    const oDate = date instanceof Date ? date : new Date(date);
    const year = oDate.getFullYear();
    const month = oDate.getMonth() + 1;
    // 计算当前季度
    let quarter = Math.ceil(month / 3);
    if (quarter === 0) {
      return {
        year: year - 1,
        quarter: 4,
      };
    }
    return {
      year,
      quarter,
    };
  };

  const { year, quarter } = compQuarter(date);
  const oDate = new Date();
  if (step !== 0) {
    oDate.setFullYear(year);
    oDate.setMonth((quarter - 1) * 3 + step * 3);
    return compQuarter(oDate);
  }
  return {
    year,
    quarter,
  };
};

/**
 * 获取一个时间的时间
 * @param from      {Date | number | string}  开始时间
 * @param to        {number}                  结束时间
 * @return          {Array}                   时间开始和结束的数组
 */
export const getRangeDate = (from = '1790-01-01', to = new Date()) => {
  return [new Date(from), new Date(to)];
};

function isFunction(arg) {
  return Object.prototype.toString.call(arg) === '[object Function]';
}

// 创建默认的时间禁用
export function createDisabledDate(obj = {}) {
  const {
    date = 0,
    week = 0,
    month = 0,
    quarter = 0,
    daterange = 0,
    year = 0,
  } = obj;

  return {
    date(oDate) {
      return isFunction(date)
        ? date()
        : oDate.getTime() > getDate(undefined, date).getTime();
    },
    week(oDate) {
      if (isFunction(week)) {
        return week();
      }
      return (
        oDate.valueOf() >
        dayjs(new Date())
          .day(6 + 6 * week)
          .valueOf()
      );
    },
    // 默认当前月和之前的月份可选
    month(oDate) {
      return isFunction(month)
        ? month()
        : oDate.getTime() > getMonth(undefined, month).getTime();
    },

    // 当前时间以及之前时间可选
    daterange(oDate) {
      return isFunction(daterange)
        ? daterange()
        : oDate.getTime() > getDate(undefined, daterange).getTime();
    },

    // 季度下的年
    quarter(oDate) {
      if (isFunction(quarter)) {
        return quarter();
      }

      const { year } = getQuarter(undefined, quarter);
      return oDate.getFullYear() > year;
    },

    quarters() {
      return getQuarter(undefined, quarter);
    },

    // 年
    year(oDate) {
      return isFunction(year)
        ? year()
        : oDate.getTime() > getYear(undefined, year).getTime();
    },
  };
}

// export const dateDisabled = createDisabledDate({
//   date: -1,
//   week: -1,
//   month: -1,
//   daterange: 0,
//   quarter: -1,
//   year: -1,
// });

export const dateDisabled = createDisabledDate({
  quarter: -1,
  date: -2,
});
