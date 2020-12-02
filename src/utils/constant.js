// 默认时间格式化
export const DATE_DEFAULT_FROMAT = {
  date: 'yyyy/MM/dd',
  month: 'yyyy/MM',
  daterange: 'yyyy/MM/dd',
  quarter: 'yyyy',
  week: 'YYYY/MM/DD',
  year: 'yyyy',
};

// 时间类型选项
export const DATE_TYPES = [
  {
    value: 'date',
    label: '按天',
  },
  {
    value: 'week',
    label: '按周',
  },
  {
    value: 'month',
    label: '按月',
  },
  {
    value: 'daterange',
    label: '按区间',
  },
  {
    value: 'quarter',
    label: '按季度',
  },
  {
    value: 'year',
    label: '按年',
  },
];

// 季度选项
export const QUARTERS = [
  {
    value: 1,
    label: '第一季度',
  },
  {
    value: 2,
    label: '第二季度',
  },
  {
    value: 3,
    label: '第三季度',
  },
  {
    value: 4,
    label: '第四季度',
  },
];
