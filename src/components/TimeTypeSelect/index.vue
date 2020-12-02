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
      <!--季度选项-->
      <Col v-show="type === 'quarter'">
        <Select
          v-model="quarter"
          @on-change="change"
          class="select-quarter"
          :disabled="disableds[2]"
          :size="size"
        >
          <Option
            v-for="item in mergedQuarters"
            :value="item.value"
            :key="item.value"
            :disabled="item.disabled"
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
import {
  getYear,
  getWeeks,
  createDisabledDate,
  getMonth,
  getRangeDate,
  getDate,
} from '@/utils/date';
import { DATE_DEFAULT_FROMAT, DATE_TYPES, QUARTERS } from '@/utils/constant';

const dateType = ['date', 'week', 'month', 'daterange', 'quarter', 'year'];

export default {
  name: 'TimeTypeSelect',
  filters: {
    weekFormart,
  },
  props: {
    // 当切换类型选项的时候设置的默认值
    // 在自定义禁用时间的时候，可以配置这个属性
    // 设置默认值
    defaultDateValue: {
      type: Object,
      default: () => ({}),
    },
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
        return DATE_DEFAULT_FROMAT;
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
      default: 'radioGroup',
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
        return DATE_TYPES;
      },
    },

    // 季度类型的选项
    quarters: {
      type: Array,
      validator(value) {
        return value.every(({ value }) => [1, 2, 3, 4].includes(value));
      },
      default() {
        return QUARTERS;
      },
    },

    // 需要显示那些时间类型
    include: {
      type: Array,
      validator(value) {
        return value.every(val => dateType.includes(val));
      },
    },

    // 排除哪些时间类型 优先级高于 include
    exclude: {
      type: Array,
      validator(value) {
        return value.every(val => dateType.includes(val));
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
      mergedQuarters: [],
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
        // 监视时间选择器的 value 变化
        // 当切换到季度或者在季度下改变年份
        // 将会重新计算季度
        if (type === 'quarter') {
          this.createQuqrtes();
        }
      },
      deep: true,
    },
  },
  created() {
    const disabledType = typeof this.disabledDate;
    const { type } = this.value;

    // 如果传入这个props 判断是否是一个对象还是一个布尔值
    // 如果是布尔值就使用 默认的控制时间规则
    // 如果是一个对象就使用传入的控制时间规则
    if (disabledType !== 'undefined') {
      this.options.disabledDate =
        disabledType === 'object'
          ? createDisabledDate(this.disabledDate)
          : createDisabledDate();
    }

    // 筛选出需要显示的时间类型
    let timeTypes = this.types;
    if (this.include) {
      timeTypes = this.include.map(item =>
        this.types.find(it => it.value === item),
      );
    }
    if (this.exclude) {
      timeTypes = this.types.filter(item => !this.exclude.includes(item.value));
    }
    this.timeTypes = timeTypes;

    if (type === 'quarter') {
      this.createQuqrtes();
    }
  },
  methods: {
    createQuqrtes() {
      // 对季节做选择
      const copyQuartes = this.quarters.map(item => ({ ...item }));
      const { year, quarter } = this.options?.disabledDate?.quarters();
      const { date } = this.value;
      this.mergedQuarters = copyQuartes.map(item => {
        // 当选择的年份大于禁用的年份或者选择年份等于当前并且当前季度大于指定禁用的季度
        // 就禁止选择当前季度
        item.disabled =
          (item.value > quarter && new Date(date).getFullYear() >= year) ||
          new Date(date).getFullYear() > year;
        return item;
      });
      return this.mergedQuarters;
    },
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

    // 时间选择器类型改变
    timeTypeChange() {
      const { type } = this;
      let date = new Date();
      let value = {
        type,
        date,
        quarter: 1,
      };

      // 如果设置了默认的值则使用默认的
      if (this.defaultDateValue[type]) {
        value.date = this.defaultDateValue[type === 'quarter' ? 'year' : type];
        value.quarter = this.defaultDateValue['quarter'] || 1;
      } else {
        // 没有默认值就根据设置的 数值 计算出默认值
        // 默认计算的默认值是当前时间
        // 或者当传入了禁用时间，默认值就是 禁用时间 往前推 1天/周/月/季度/年
        switch (type) {
          case 'date':
            value.date = getDate(undefined, this.disabledDate.date);
            break;

          case 'week':
            value.date = getWeeks(undefined, this.disabledDate.week);
            break;
          case 'quarter':
            // eslint-disable-next-line no-case-declarations
            const { year, quarter } = this.options.disabledDate.quarters();
            value.date = new Date(`${year}-${quarter * 3}-01`);
            value.quarter = quarter;
            break;

          case 'year':
            value.date = getYear(undefined, this.disabledDate.year);
            break;

          case 'month':
            value.date = getMonth(undefined, this.disabledDate.month);
            break;

          case 'daterange':
            // eslint-disable-next-line no-case-declarations
            const date = getDate(undefined, this.disabledDate.range);
            value.date = getRangeDate(date, date);
            break;
        }
      }
      this.$emit('input', value);
    },

    // 选择日期后的回调
    change() {
      const { type, date, quarter } = this;
      const value = {
        type,
        date,
        quarter,
      };
      // 对类型为周的做特殊处理
      // 获取以选择的时间为基础计算当前一周的 年/月/日
      // 并通过失去光标来关闭日期选择器
      if (type === 'week') {
        value.date = this.getWeekDays((date && date.pop()) || Date.now());
        this.$refs.showWeekText.blur();
      } else if (type === 'quarter') {
        // 在季度模式下并且季度限制有限制的情况下动态生成
        // 季度来控制哪些季度可选
        this.createQuqrtes();
      }

      this.isShowDatePicker = false;
      this.$emit('input', value);
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
