<template>
  <div id="app">
    <PageContent>
      <Row class="search-params" :gutter="8" type="flex" align="middle">
        <Col>
          <TimeTypeSelect
            v-model="value"
            :types="types"
            :show-type-values="['date', 'week', 'month', 'quarter']"
            :datePicker="{
              options: datePickerOptions,
              valueFormat: 'YYYY-MM-dd',
            }"
            :ivew-row-props="{ gutter: 8, type: 'flex', align: 'middle' }"
            @change="timeTypeChange"
            class="select-time"
          />
        </Col>
        <Col class="action">
          <!--          <Button type="primary" @click="search">查询</Button>-->
          <Button type="primary" @click="toggleEditing" :loading="updating" style="margin-right: 8px">
            {{ isEditing ? '保存指标' : '编辑指标' }}
          </Button>
          <Button type="warning" @click="cancel">取消编辑</Button>
        </Col>
        <Col v-show="isEditing" :span="24" class="text-danger">
          当前表格处于编辑状态，编辑完成后，点击“保存指标”按钮，提交编辑的数据；（请逐页编辑保存）
        </Col>
      </Row>
      <Table
        @rowSave="onRowSave"
        ref="editTable"
        :isEditing="isEditing"
        :edit-manner="editManner"
      />
    </PageContent>
  </div>
</template>

<script>
import Table from './components/EditTable/EditTable';
import PageContent from './components/PageContent';
import TimeTypeSelect from '@/components/TimeTypeSelect';

export default {
  name: 'App',
  data() {
    return {
      updating: false,
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
      editManner: 'row',
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
      isEditing: false,
    };
  },
  components: {
    Table,
    PageContent,
    TimeTypeSelect,
  },

  methods: {
    cancel() {
      this.$refs.editTable.tableCancel();
      this.isEditing = false;
    },
    onRowSave(row) {
      console.log(row);
    },
    toggleEditing() {
      if (this.isEditing) {
        this.updating = true;
        this.$refs.editTable
          .tableSave()
          .then(() => {
            this.isEditing = false;
            this.updating = false;
          })
          .catch(() => {
            this.$Message.error('数据校验失败');
          })
          .finally(() => {
            this.updating = false;
          });
      } else {
        this.isEditing = !this.isEditing;
      }
    },
    // 时间类型选择器选择类型改变
    timeTypeChange(value) {
      console.log('parent-value', value);
      Object.assign(this.value, value);
    },
  },
};
</script>

<style lang="scss">
body,
html {
  height: 100%;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 30px;
  height: 100%;
}
.select-time .ivu-radio-group-button .ivu-radio-wrapper-checked {
  padding-bottom: 20px;
  background-color: rgba(45, 140, 240, 1);
  color: #fff;
  &:hover {
    color: #fff;
    border-color: #57a3f3;
  }
}

.search-params {
  padding-bottom: 20px;
}
</style>
