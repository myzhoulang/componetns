<template>
  <div class="table-warp">
    <Table
      ref="table"
      v-bind="iviewTableProps"
      class="table"
      :id="tableId"
      :data="data"
      :columns="columns"
      :height="tableHeight"
    />
    <div class="page" v-show="params.total > 0">
      <Space>
        <Page
          show-elevator
          show-sizer
          show-total
          :disabled="page.disabled"
          :page-size="params.pageSize"
          :total="params.total"
          :current.sync="params.current"
          v-bind="iviewPageProps"
          @on-change="changePage"
          @on-page-size-change="pageSizeChange"
        />
        <span
          >总共 <b>{{ Math.ceil(params.total / params.pageSize) }}</b> 页</span
        >
      </Space>
    </div>
  </div>
</template>

<script>
import Space from '@/components/Space';
export default {
  name: 'ZTable',
  components: {
    Space,
  },
  props: {
    // 表格的 ID
    tableId: {
      type: String,
    },
    // 对应iview Table 中能传入的props
    iviewTableProps: {
      type: Object,
      default() {
        return {};
      },
    },
    // 对应iview Page 中能传入的props
    iviewPageProps: {
      type: Object,
      default() {
        return {};
      },
    },
    page: {
      type: Object,
    },
    data: {
      type: Array,
    },
    columns: {
      type: Array,
    },
  },

  data() {
    return {
      tableHeight: 0,
      orignHeight: 0,
    };
  },

  computed: {
    params() {
      return this.page;
    },
  },

  watch: {
    'page.total'(value) {
      if (value > 0) {
        this.tableHeight = this.$refs.table.$el.offsetHeight - 52;
      } else {
        this.tableHeight = 0;
      }
    },
  },

  methods: {
    changePage() {
      // this.$emit('update:page', this.params);
      // this.$emit('refresh');
    },
    pageSizeChange(pageSize) {
      this.params.pageSize = pageSize;
      // this.$emit('update:page', this.params);
      // this.$emit('refresh');
    },
  },
};
</script>

<style scoped lang="scss">
.table-warp {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.table {
  flex: 1;
  // 设置高  度为 0 解决在设置flex的时候，字内容高度超出高度不会出现滚动条
  //height: 0;
  > ::v-deep .ivu-table {
    display: flex;
    flex-direction: column;
    > .ivu-table-body {
      flex: 1;
    }

    > .ivu-table-tip {
      height: 48px !important;

      td {
        height: 48px !important;
      }
    }
  }
}
.page {
  text-align: center;
  padding-top: 20px;
  height: 52px;
}
</style>
