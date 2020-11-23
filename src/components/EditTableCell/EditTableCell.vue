<template>
  <div @mouseenter="showEditIcon" @mouseleave="hideEditIcon">
    <Row
      :gutter="8"
      justify="space-between"
      align="middle"
      type="flex"
      v-show="!isShowInput"
    >
      <Col :span="editManner === 'cell' ? 19 : 24">
        <div class="text">{{ text || '-' }}</div>
      </Col>

      <Col :span="5" v-show="isShowEditIcon" v-if="editManner === 'cell'">
        <Icon @click="showInput" class="icon" type="md-brush" />
      </Col>
    </Row>
    <Row
      :gutter="8"
      justify="space-between"
      align="middle"
      type="flex"
      v-show="isShowInput"
    >
      <Col
        :span="editManner === 'cell' ? 19 : 24"
        :class="{ 'ivu-form-item-error': invalid }"
      >
        <template v-if="dataType === 'number'">
          <InputNumber
            :size="size"
            :transfer="true"
            v-model="value"
            v-if="dataType === 'number'"
            v-bind="iviewProps"
            @on-change="change"
            ref="input-control"
          />
        </template>

        <template v-if="dataType === 'select'">
          <Select
            :placeholder="placeholder"
            :size="size"
            :transfer="true"
            v-model="value"
          >
            <Option
              v-for="item in options"
              :value="item.value"
              :key="item.value"
            >
              {{ item.label }}
            </Option>
          </Select>
        </template>

        <template v-if="dataType === 'checkbox'">
          <RadioGroup v-model="value">
            <Radio
              :label="value"
              v-for="{ label, value } in options"
              :key="value"
            >
              <span>{{ label }}</span>
            </Radio>
          </RadioGroup>
        </template>

        <template v-if="!dataType || dataType === 'string'">
          <Input
            :placeholder="placeholder"
            :size="size"
            v-model="value"
            v-bind="iviewProps"
            @on-change="change"
            ref="input-control"
          />
        </template>

        <template v-if="dataType === 'date'">
          <DatePicker
            :transfer="true"
            :size="size"
            :type="date.type"
            :placeholder="placeholder"
            @on-change="change"
            v-bind="date.iviewProps"
            v-model="value"
          ></DatePicker>
        </template>
      </Col>
      <Col :span="5" v-if="editManner === 'cell'">
        <Icon @click="saveValue" class="icon" type="md-checkmark" />
      </Col>
    </Row>
  </div>
</template>

<script>
import Schema from 'async-validator';
import dayjs from 'dayjs';

let timer = null;
let timer2 = null;
export default {
  name: 'EditTableCell',
  props: {
    // 编辑方式
    editManner: {
      type: String,
      validate(value) {
        return ['table', 'row', 'cell'].includes(value);
      },
      default: 'cell',
    },
    // 数据的可以
    dataKey: {
      type: String,
    },
    // 当前数据在数据集中的索引位置
    index: {
      type: Number,
      required: true,
    },
    // 显示的值
    text: {
      type: [String, Number],
    },
    // 当前数据的数据类型
    dataType: {
      type: String,
      default: 'string',
      validate(value) {
        return [
          'string',
          'number',
          'select',
          'radio',
          'checkbox',
          'date',
        ].includes(value);
      },
    },
    // 当数据类型是日期类型
    // 配置日期控件显示
    date: {
      type: String,
      default: 'date',
      validate(value) {
        return ['date', 'month', 'year'].includes(value);
      },
    },
    // 当前数据可修改的规则
    // 验证规则参考 https://github.com/yiminghe/async-validator
    rules: {
      type: Array,
    },
    // 表单控件的placeholder
    placeholder: {
      type: String,
    },
    // 表单控件的大小
    size: {
      type: String,
      default: 'default',
      validate(value) {
        return ['small', 'default', 'large'].includes(value);
      },
    },
    // iview 上的属性透传到 iview 表单控件
    iviewProps: {
      type: Object,
    },
    // 是否处于编辑状态
    isEditing: {
      type: Boolean,
      default: false,
    },
    // select 或 radio 的 options 选项
    // [{label: 'label', value: value}]
    options: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    isEditing(value) {
      this.isShowInput = value;
    },
  },
  data() {
    return {
      invalidMessage: [],
      value: this.text,
      isShowEditIcon: false,
      isShowInput: false,
      validator: null,
      invalid: false,
    };
  },
  created() {
    // 根据传入的规则初始化验证器
    const descriptor = {
      [this.dataKey]: this.rules,
    };
    this.validator = new Schema(descriptor);
    this.isShowInput = this.isEditing;
  },
  methods: {
    // 鼠标移入单元格显示编辑icon
    showEditIcon() {
      // 只有在 cell 形式下才会有这个操作
      if (this.editManner === 'cell') {
        // 做一下简单的防抖处理， 防抖处理函数需要封装到 util
        timer = setTimeout(() => {
          this.isShowEditIcon = true;
        }, 80);
      }
    },

    // 鼠标移除单元格隐藏编辑icon
    hideEditIcon() {
      if (this.editManner === 'cell') {
        clearTimeout(timer);
        this.isShowEditIcon = false;
      }
    },

    // 验证数据合法性
    validate() {
      const { dataKey, value, validator } = this;
      return validator
        .validate({ [dataKey]: value })
        .then(errors => {
          this.invalid = errors?.length > 0 ? true : false;
          return errors;
        })
        .catch(({ errors }) => {
          this.invalid = true;
          return errors;
        });
    },

    // 保存数据， 并通知父级
    saveValue($event) {
      // 校验数据是否是合规的
      const { dataKey, value, index } = this;
      return this.validate().then(errors => {
        if (!errors) {
          this.isShowInput = false;
          this.$emit('cellChange', { dataKey, value, index }, $event);
        } else {
          const message = errors.map(item => item.message).join('<br />');
          this.$Message.error(message);
        }
      });
    },

    // 显示表单控件
    showInput() {
      this.isShowInput = true;
      this.$nextTick(() => {
        this.$refs['input-control']?.focus();
      });
    },

    // 表单控件输入事件
    // 实时校验输入数据是否合法
    change() {
      // 防抖处理 封装到 util
      clearTimeout(timer2);
      timer2 = setTimeout(() => {
        this.validate().then(errors => {
          let invalid = false;
          const { value, dataKey, index } = this;
          let v = value;
          // 对日期格式进行处理
          if (value instanceof Date) {
            v = dayjs(value).format('YYYY-MM-DD');
          }
          if (errors) {
            this.invalidMessage = errors.map(item => item.message);
            invalid = true;
          } else {
            this.invalidMessage = [];
          }
          this.$emit('cellChange', { value: v, dataKey, invalid, index });
        });
      }, 100);
    },
  },
};
</script>

<style scoped>
.icon {
  cursor: pointer;
}
.text {
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

::v-deep .ivu-input-number {
  width: 100%;
}
</style>
