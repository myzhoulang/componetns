<template>
  <div @mouseenter="showEditIcon" @mouseleave="hideEditIcon">
    <Row
      :gutter="8"
      justify="space-between"
      align="middle"
      type="flex"
      v-show="!isShowInput"
    >
      <Col :span="typeof isEditing === 'undefined' ? 20 : 24">
        <div class="text">{{ text || '-' }}</div>
      </Col>
      <Col
        :span="4"
        v-show="isShowEditIcon"
        v-if="typeof isEditing === 'undefined'"
      >
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
        :span="typeof isEditing === 'undefined' ? 20 : 24"
        :class="{ 'ivu-form-item-error': invalid }"
      >
        <InputNumber
          ref="input-control"
          v-model="value"
          v-if="dataType === 'number'"
          @on-change="change"
          v-bind="iviewProps"
        />
        <Input
          v-else
          v-model="value"
          ref="input-control"
          @on-change="change"
          v-bind="iviewProps"
        />
      </Col>
      <Col aria-colspan="4" v-if="typeof isEditing === 'undefined'">
        <Icon @click="saveValue" class="icon" type="md-checkmark" />
      </Col>
    </Row>
  </div>
</template>

<script>
import Schema from 'async-validator';

let timer = null;
let timer2 = null;
export default {
  name: 'EditTableCell',
  props: {
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
  },
  watch: {
    isEditing(value) {
      this.isShowInput = value;
    },
  },
  data() {
    return {
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
      // 做一下简单的防抖处理， 防抖处理函数需要封装到 util
      timer = setTimeout(() => {
        this.isShowEditIcon = true;
      }, 80);
    },

    // 鼠标移除单元格隐藏编辑icon
    hideEditIcon() {
      clearTimeout(timer);
      this.isShowEditIcon = false;
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
      this.validate().then(errors => {
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
          if (!errors) {
            const { value, dataKey, index } = this;
            this.$emit('cellChange', { value, dataKey, index });
          }
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
