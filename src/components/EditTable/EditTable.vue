<template>
  <div class="wrap">
    <!--    {{ cacheData }}-->
    <ZTable
      :data="data"
      :columns="columns"
      :page="params"
      :iview-table-props="{ border: true }"
    />
  </div>
</template>

<script>
import createColums from '@/utils/createColums';
import { columns } from '@/columns';
import { data } from '../../mock/app';
import ZTable from '@/components/ZTable';

/**
 * 可编辑的表格.
 * @displayName EditTable
 */
export default {
  name: 'EditTable',
  components: {
    ZTable,
  },
  data() {
    // this.cacheData
    // this.cacheData = data.map(item => ({ ...item }));
    return {
      cacheData: data.map(item => ({ ...item })),
      tableHeight: 0,
      current: {},
      columns: [],
      data: [],
      params: {
        current: 1,
        pageSize: 20,
        total: 0,
      },
    };
  },
  props: {
    // 是否处于编辑状态
    isEditing: {
      type: Boolean,
      default: false,
    },
    // 表格编辑形式 cell/row/table
    editManner: {
      type: String,
      validate(value) {
        return ['cell', 'row', 'table'].includes(value);
      },
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

    // 编辑形式在 table 下的取消
    // 在父级组件中使用 $refs 的形式调用子组件中的方法
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
        this.cacheData,
        index,
        Object.assign(this.cacheData[index], { [dataKey]: value, invalid }),
      );
    },
    // 当前行的编辑
    // 编辑形式(editManner: 'row')的时候用到
    // eslint-disable-next-line no-unused-vars
    rowEdit({ row, index }) {
      this.current = row;
      this.$set(this.data[index], 'isEditing', true);
    },
    // 当前行的保存
    // 编辑形式(editManner: 'row')的时候用到
    // eslint-disable-next-line no-unused-vars
    rowSave({ row, index }) {
      this.validate().then(() => {
        console.log('data:', row);
        this.$emit('rowSave', row);
        // row.updating = true;
        // 模拟请求
        this.$set(this.data[index], 'updating', true);
        setTimeout(() => {
          this.$Message.info('保存成功');
          this.$set(this.data[index], 'isEditing', false);
          this.$set(this.data[index], 'updating', false);
          // row.isEditing = false;
          // row.updating = false;
        }, 1000);
      });
    },
    // 当前行的取消
    // 编辑形式(editManner: 'row')的时候用到
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

    setTimeout(() => {
      this.data = data;
      this.params.total = 10;
    });
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
