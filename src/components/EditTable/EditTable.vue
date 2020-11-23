<template>
  <div class="wrap">
    {{ data }}
    <Table
      :height="600"
      :columns="columns"
      :data="data"
      border
      class="table"
    ></Table>
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
import createColums from '@/utils/createColums';
import { columns } from '@/columns';
import { data } from '../../mock/app';

/**
 * 可编辑的表格.
 * @displayName EditTable
 */
export default {
  name: 'EditTable',
  data() {
    // this.cacheData
    this.cacheData = data.map(item => ({ ...item }));
    return {
      current: {},
      columns: [],
      data: data,
      params: {
        current: 1,
        pageSize: 20,
      },
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
    };
  },
  props: {
    isEditing: {
      type: Boolean,
      default: false,
    },
    editManner: {
      type: String,
      default: 'cell',
    },
  },
  methods: {
    // 保存前的校验数据
    // 根据每一条数据中的 invalid 属性来判断当前这个数据校验是否通过
    // 在单元格内部会在每一次编辑的时候都会做校验
    validate() {
      const invalid = this.data.some(item => item.invalid);
      if (invalid) {
        return Promise.reject('校验失败');
      } else {
        return Promise.resolve('校验通过');
      }
    },
    // 切换表格编辑状态，通知父组件
    // 父组件中的编辑单元格中的表单控件将切换显示隐藏
    tableSave() {
      return this.validate()
        .then(resolve => {
          setTimeout(() => {
            resolve();
          }, 3000);
        })
        .catch(e => {
          return e;
        });
    },

    tableCancel() {
      const data = this.cacheData.map(item => ({ ...item }));
      this.data = data;
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

    // 点击搜索按钮获取列表数据
    search() {
      this.$emit('refresh', this.getLastParams());
    },

    // 单元格编辑触发的回调
    cellChange({ value, dataKey, invalid, index }) {
      this.$set(
        this.data,
        index,
        Object.assign(this.data[index], { [dataKey]: value, invalid }),
      );
    },
    // 当前的编辑
    rowEdit({ row, index }) {
      this.current = row;
      this.$set(this.data[index], 'isEditing', true);
    },
    // 当前行的保存
    rowSave({ row, index }) {
      this.validate().then(() => {
        this.$emit('rowSave', row);

        // 模拟请求
        this.$set(this.data[index], 'updating', true);
        setTimeout(() => {
          this.$Message.info('保存成功');
          this.$set(this.data[index], 'isEditing', false);
          this.$set(this.data[index], 'updating', false);
        }, 1000);
      });
    },
    // 当前行的取消
    rowCancel({ index }) {
      this.$set(this.data[index], 'isEditing', false);
      try {
        this.$set(this.data, index, JSON.parse(JSON.stringify(this.current)));
      } catch (e) {
        console.log(e);
      }
    },
  },
  created() {
    this.columns = createColums.bind(this)(columns);
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
.page {
  padding-top: 20px;
  text-align: center;
}
.text-danger {
  color: #ed4014;
  padding-top: 8px;
}
</style>
