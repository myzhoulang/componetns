<template>
  <div class="wrap">
    <Row class="search-params" :gutter="8" type="flex" align="middle">
      <Col>
        <TimeTypeSelect
          v-model="value"
          :types="types"
          :show-type-values="['date', 'week', 'month', 'quarter']"
          :datePicker="{
            options: datePickerOptions,
            valueFormat: 'yyyy-MM-dd',
          }"
          :ivew-row-props="{ gutter: 8, type: 'flex', align: 'middle' }"
          @change="timeTypeChange"
          class="select-time"
        />
      </Col>
      <Col class="action">
        <Button type="primary" @click="search">查询</Button>
        <Button type="primary" @click="toggleEditing">
          {{ isEditing ? '保存指标' : '编辑指标' }}
        </Button>
        <Button type="primary">导出</Button>
      </Col>
      <Col v-show="isEditing" :span="24" class="text-danger">
        当前表格处于编辑状态，编辑完成后，点击“保存指标”按钮，提交编辑的数据；（请逐页编辑保存）
      </Col>
    </Row>
    <Table :columns="columns" :data="data" border class="table"></Table>
    <div class="page">
      <Page
        @on-change="changePage"
        @on-page-size-change="pageSizeChange"
        :total="40"
        show-elevator
        show-sizer
        show-total
        :page-size="params.pageSize"
        :current="params.current"
      />
    </div>
  </div>
</template>

<script>
import TimeTypeSelect from '@/components/TimeTypeSelect/index';

/**
 * 可编辑的表格.
 * @displayName EditTable
 */
export default {
  name: 'EditTable',
  data() {
    return {
      params: {
        current: 1,
        pageSize: 20,
      },
      isEditing: false,
      data: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-07-03',
          email: 'JohnBrown@gmail.com',
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01',
          email: 'JimGreen@gmail.com',
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02',
          email: 'JoeBlack@gmail.com',
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04',
          email: 'JonSnow@gmail.com',
        },
      ],
      types: [
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
          value: 'quarter',
          label: '按季度',
        },
        {
          value: 'year',
          label: '按年',
        },
      ],
      value: {
        type: 'month',
        date: null,
        quarter: '',
      },
      datePickerOptions: {
        disabledDate(date) {
          const disabledMonth = date.getMonth();
          return disabledMonth >= 11;
        },
      },
    };
  },
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    export: {
      type: Object,
      default() {
        return {
          url: '',
          name: '',
          params: {},
          type: '',
          disabled: false,
        };
      },
    },
  },
  methods: {
    // 切换表格编辑状态，通知父组件
    // 父组件中的编辑单元格中的表单控件将切换显示隐藏
    toggleEditing() {
      this.isEditing = !this.isEditing;
      this.$emit('toggle', this.isEditing);
    },
    // 获取最新的请求api参数
    getLastParams() {
      const { type, date, quarter } = this.value;
      return {
        ...this.params,
        type,
        date,
        quarter: type === 'quarter' ? quarter : undefined,
      };
    },

    // 每页条数改变
    pageSizeChange() {
      this.$emit('refresh', this.getLastParams());
    },

    // 当前页码改变
    changePage() {
      this.$emit('refresh', this.getLastParams());
    },

    // 时间类型选择器选择类型改变
    timeTypeChange(value) {
      console.log('parent-value', value);
      Object.assign(this.value, value);
    },

    // 点击搜索按钮获取列表数据
    search() {
      this.$emit('refresh', this.getLastParams());
    },
  },
  components: {
    TimeTypeSelect,
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.table {
  flex: 1;
}
.action button {
  margin-left: 8px;
}
.search-params {
  padding-bottom: 20px;
}
.page {
  padding-top: 20px;
  text-align: center;
}
.text-danger {
  color: #ed4014;
  padding-top: 8px;
}
</style>
