import * as dayjs from 'dayjs';
const weekOfYear = require('dayjs/plugin/weekOfYear');
dayjs.extend(weekOfYear);

export const gender = value => {
  return value ? 'man' : 'Woman';
};

export const weekFormart = value => {
  const d = dayjs(value[0]);
  return `${d.year()} - ${d.week()}th`;
};
