<template>
  <div :class="['time-type-select', className]">
    <Row :gutter="8" type="flex" align="middle">
      <Col>时间：</Col>
      <Col>
        <Select
          v-if="showStyle === 'select'"
          v-model="type"
          @on-change="change"
          class="select-type"
          :disabled="disableds[0]"
          :size="size"
        >
          <template v-for="item in types">
            <Option
              :value="item.value"
              :key="item.value"
              v-if="!showTypeValues || showTypeValues.includes(item.value)"
            >
              {{ item.label }}
            </Option>
          </template>
        </Select>

        <RadioGroup
          v-else
          v-model="type"
          type="button"
          @on-change="change"
          :size="size"
          :disabled="disableds[0]"
        >
          <template v-for="item in types">
            <Radio
              v-if="!showTypeValues || showTypeValues.includes(item.value)"
              :value="item.value"
              :label="item.value"
              :key="item.value"
            >
              {{ item.label }}
            </Radio>
          </template>
        </RadioGroup>
      </Col>
      <Col>
        <DatePicker
          class="select-date"
          v-model="date"
          @on-change="change"
          :show-week-numbers="type === 'week'"
          :type="typeMap[type]"
          :size="size"
          :disabled="disableds[1]"
          :options="datePicker.options"
          :valueFormat="datePicker.valueFormat"
          placeholder="请选择日期"
        >
        </DatePicker>
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

export default {
  name: "TimeTypeSelect",
  props: {
    // 设置内部表单控件是否可以手动改动
    // 默认是都可以手动选择
    disableds: {
      type: Array,
      default() {
        return [false, false, false];
      }
    },
    // 显示的风格是什么样的
    // 可选值 有 'select' 和 'radioGroup'
    showStyle: {
      type: String
    },
    // size 对应 iview 中的size
    // 值有： small,default,large
    size: {
      type: String,
      default: "default"
    },
    // 组件包裹层的 class
    className: {
      type: String,
      default: ""
    },
    // 对应 iview 中的 Row 组件中的 justify
    // 控制组件中的表单控件水平摆放位置
    // 可选值有 start、end、center、space-around、space-between
    justify: {
      type: String,
      default: "start"
    },
    // 对应 iview 中的 Row 组件中的 gutter
    // 控制组件中的表单控件之间的间距
    gutter: {
      type: Number,
      default: 8
    },
    // 对应 iview 中时间控件的 options 选项
    datePicker: {
      type: Object
    },
    // 时间类型的选项
    types: {
      default() {
        return [
          {
            value: "month",
            label: "月度考核"
          },
          {
            value: "quarter",
            label: "季度考核"
          },
          {
            value: "year",
            label: "年度考核"
          }
        ];
      }
    },
    // 季度类型的选项
    quarters: {
      default() {
        return [
          {
            value: 1,
            label: "第一季度"
          },
          {
            value: 2,
            label: "第二季度"
          },
          {
            value: 3,
            label: "第三季度"
          },
          {
            value: 4,
            label: "第四季度"
          }
        ];
      }
    },

    // 需要显示那些时间类型
    showTypeValues: {
      type: Array
    },

    // 组件的 v-model
    value: {
      required: true,
      default() {
        return {
          type: "month",
          date: null,
          quarter: ""
        };
      }
    }
  },
  watch: {
    value(value = {}) {
      const { type, date, quarter } = value;
      this.type = type || "month";
      this.date = date || null;
      this.quarter = quarter || "";
    }
  },
  created() {
    console.log(this.disabledDate);
  },
  methods: {
    change() {
      const { type, date, quarter } = this;
      // TODO: 在向父级传送数据的时候 通过传入的格式化规则对日期进行格式化
      // TODO: 当时间类型选择改变，是否需要清除后面的日期和季度的值
      // 如： Date对象 => 'yyyy-mm-dd'
      this.$emit("change", {
        type,
        date,
        quarter
      });
    }
  },
  data() {
    const { type, date, quarter } = this.value;
    return {
      typeMap: {
        date: "date",
        month: "month",
        year: "year",
        week: "date",
        quarter: "year"
      },
      type,
      date,
      quarter
    };
  }
};
</script>

<style scoped>
.select-type,
.select-quarter {
  width: 120px;
}
</style>
