<template>
  <div class="time-type-select">
    <Row v-bind="ivewRowProps">
      <Col class="label" v-if="isShowLabel">{{ label }}</Col>
      <Col>
        <Select
          v-if="showStyle === 'select'"
          v-model="type"
          @on-change="timeTypeChange"
          class="select-type"
          :disabled="disableds[0]"
          :size="size"
        >
          <template v-for="item in timeTypes">
            <Option :value="item.value" :key="item.value">
              {{ item.label }}
            </Option>
          </template>
        </Select>

        <RadioGroup
          v-else
          v-model="type"
          type="button"
          @on-change="timeTypeChange"
          :size="size"
          :disabled="disableds[0]"
        >
          <template v-for="item in timeTypes">
            <Radio :label="item.value" :key="item.value">
              {{ item.label }}
            </Radio>
          </template>
        </RadioGroup>
      </Col>
      <Col class="datepicker-wrap">
        <DatePicker
          v-if="type !== 'week'"
          v-bind="iviewDatePickerProps"
          class="select-date"
          v-model="date"
          @on-change="change"
          :type="typeMap[type]"
          :size="size"
          :disabled="disableds[1]"
          :format="format[type]"
          :options="{ disabledDate: options.disabledDate[type] }"
          placeholder="请选择日期"
        />
        <div v-else>
          <DatePicker
            class="select-date"
            v-model="date"
            v-bind="iviewDatePickerProps"
            :show-week-numbers="true"
            :type="typeMap[type]"
            :size="size"
            :disabled="disableds[1]"
            :options="{ disabledDate: options.disabledDate[type] }"
            :multiple="true"
            :open="isShowDatePicker"
            @on-ok="hideDatePicker"
            @on-change="change"
            placeholder="请选择日期"
          />
          <input
            ref="showWeekText"
            @focus="showDatePicker"
            @blur="hideDatePicker"
            class="week-date"
            :value="date | weekFormart"
          />
        </div>
      </Col>
      <Col v-show="type === 'quarter'">
        <Select
          v-model="quarter"
          @on-change="change"
          class="select-quarter"
          :disabled="disableds[2]"
          :size="size"
        >
          <Option
            v-for="item in quarters"
            :value="item.value"
            :key="item.value"
          >
            {{ item.label }}
          </Option>
        </Select>
      </Col>
    </Row>
  </div>
</template>

<script>
import * as dayjs from 'dayjs';
import { weekFormart } from '@/utils/filters';

const dateType = ['date', 'week', 'month', 'daterange', 'quarter', 'year'];

export default {
  name: 'TimeTypeSelect',
  filters: {
    weekFormart,
  },
  props: {
    // iview 中的 row props
    ivewRowProps: {
      type: Object,
      default: () => ({}),
    },

    // iview 中的 datePicker Props
    iviewDatePickerProps: {
      type: Object,
      default: () => ({}),
    },

    // 展示格式化日期
    format: {
      type: Object,
      default() {
        return {
          date: 'yyyy/MM/dd',
          month: 'yyyy/MM',
          daterange: 'yyyy/MM/dd',
          quarter: 'yyyy',
          week: 'YYYY/MM/DD',
          year: 'yyyy',
        };
      },
    },

    // label 文案
    label: {
      type: String,
      default: '时间:',
    },

    // 是否显示 日期选择器的 label
    isShowLabel: {
      type: Boolean,
      default: true,
    },

    // 时间选择器禁止选择的时间
    disabledDate: {
      type: [Object, Boolean],
    },

    // 设置内部表单控件是否可以手动改动
    // 默认是都可以手动选择
    disableds: {
      type: Array,
      validator(value) {
        return value.every(item => typeof item === 'boolean');
      },
      default() {
        return [false, false, false];
      },
    },

    // 显示的风格是什么样的
    // 可选值 有 'select' 和 'radioGroup'
    showStyle: {
      default: 'select',
      validator(value) {
        return ['select', 'radioGroup'].includes(value);
      },
      type: String,
    },

    // size 对应 iview 中的size
    // 值有： small,default,large
    // 组件内部所有的 iview 组件的 size 将会统一使用这个
    size: {
      type: String,
      validator(value) {
        return ['small', 'default', 'large'].includes(value);
      },
      default: 'default',
    },

    // 对应 iview 中时间控件的 options 选项
    datePicker: {
      type: Object,
      default() {
        return {};
      },
    },

    // 时间类型的选项
    types: {
      type: Array,
      validator(value) {
        return value.every(({ value }) => dateType.includes(value));
      },
      default() {
        return [
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
      },
    },

    // 季度类型的选项
    quarters: {
      type: Array,
      validator(value) {
        return value.every(({ value }) => [1, 2, 3, 4].includes(value));
      },
      default() {
        return [
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
      },
    },

    // 需要显示那些时间类型
    include: {
      type: Array,
      validator(value) {
        return dateType.includes(value);
      },
    },

    // 排除哪些时间类型 优先级高于 include
    exclude: {
      type: Array,
      validator(value) {
        return dateType.includes(value);
      },
    },

    // 组件的 v-model
    // 默认是当前时间 yyyy/MM/dd
    value: {
      type: Object,
      default() {
        return {
          type: 'month',
          date: dayjs(new Date().setDate(1)).format('YYYY/MM/DD'),
          quarter: '',
        };
      },
    },
  },
  data() {
    const { type, date, quarter } = this.value;
    return {
      options: {
        disabledDate: {},
      },
      timeTypes: [],
      typeMap: {
        date: 'date',
        month: 'month',
        year: 'year',
        week: 'date',
        daterange: 'daterange',
        quarter: 'year',
      },
      type,
      date,
      quarter,
      isShowDatePicker: false,
    };
  },
  watch: {
    value: {
      handler(value = {}) {
        const { type, date, quarter } = value;
        this.type = type || 'month';
        this.date = date || null;
        this.quarter = quarter || '';
      },
      deep: true,
    },
  },
  created() {
    const disabledType = typeof this.disabledDate;
    // 启用控制时间选择时，默认设置
    const defaultDisabledDate = {
      date(date) {
        return date.getTime() > new Date().getTime();
      },
      week(date) {
        return (
          date.valueOf() >
          dayjs(new Date())
            .day(6)
            .valueOf()
        );
      },
      month(date) {
        const oDate = new Date();
        return (
          date.getMonth() > oDate.getMonth() ||
          date.getFullYear() > oDate.getFullYear()
        );
      },
      daterange(date) {
        return date.getTime() > new Date().getTime();
      },
      quarter(date) {
        return date.getFullYear() > new Date().getFullYear();
      },
      year(date) {
        return date.getFullYear() > new Date().getFullYear();
      },
    };
    // 如果传入这个props 判断是否是一个对象还是一个布尔值
    // 如果是布尔值就使用 默认的控制时间规则
    // 如果是一个对象就使用传入的控制时间规则
    if (typeof disabledType !== 'undefined') {
      this.options.disabledDate =
        typeof disabledType === 'object'
          ? this.disabledDate
          : defaultDisabledDate;
    }

    // 筛选出需要显示的时间类型
    let timeTypes = this.types;
    if (this.include) {
      timeTypes = this.include.map(item =>
        this.types.find(it => it.value === item),
      );
    }
    if (this.exclude) {
      timeTypes = this.types.filter(item =>
        this.exclude.find(it => it !== item.value),
      );
    }
    this.timeTypes = timeTypes;
  },
  methods: {
    // 在选择周的模式下点击datepicker 中的确定
    hideDatePicker() {
      this.isShowDatePicker = false;
    },

    // 在选择周的模式下自定义输入框获取焦点自动弹出时间选择器
    showDatePicker() {
      this.isShowDatePicker = true;
    },

    // 获取当前日期这一周的日期
    getWeekDays(date) {
      const days = [];
      for (let i = 0; i < 7; i++) {
        days.push(
          dayjs(date)
            .day(i)
            .format(this.format['week']),
        );
      }
      return days;
    },

    // 获取一个时间区间
    getDateRange() {
      const oDate = dayjs(new Date());
      return [oDate.format('YYYY/MM/01'), oDate.format('YYYY/MM/DD')];
    },

    // 时间选择器类型改变
    timeTypeChange() {
      const { type } = this;
      let date2 = new Date();
      if (type === 'week') {
        date2 = this.getWeekDays(Date.now());
      } else if (type === 'daterange') {
        date2 = this.getDateRange();
      }
      this.$emit('input', {
        type,
        date: date2,
        quarter: type === 'quarter' ? 1 : '',
      });
    },

    // 选择日期后的回调
    change() {
      const { type, date, quarter } = this;
      let date2 = date;

      // 对类型为周的做特殊处理
      // 获取以选择的时间为基础计算当前一周的 年/月/日
      // 并通过失去光标来关闭日期选择器
      if (type === 'week') {
        date2 = this.getWeekDays((date && date.pop()) || Date.now());
        this.$refs.showWeekText.blur();
      }
      this.isShowDatePicker = false;
      this.$emit('input', {
        type,
        date: date2,
        quarter,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.select-type,
.select-quarter {
  width: 120px;
}
// 设置data-picker宽度至少为200px 以便于 daterange 时候可以正常显示出选择的时间
.select-date {
  min-width: 200px;
}
.time-type-select {
  ::v-deep .ivu-radio-group-button .ivu-radio-wrapper-checked {
    background-color: rgba(45, 140, 240, 1);
    color: #fff;

    &:hover {
      color: #fff;
      border-color: #57a3f3;
    }
  }

  ::v-deep .ivu-date-picker-cells-focused em {
    box-shadow: none;
  }
}

.datepicker-wrap {
  position: relative;

  ::v-deep .ivu-picker-confirm {
    display: none;
  }

  .week-date {
    position: absolute;
    padding: 4px 16px 4px 7px;
    left: 5px;
    right: 0;
    top: 1px;
    bottom: 1px;
    background: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-radius: 4px;
    border: none;
    color: #515a6e;

    &:focus {
      box-shadow: none;
      outline: none;
    }
  }
}
</style>
