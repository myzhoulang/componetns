<template>
  <div id="app">
    <PageContent>
      <Space :size="8" direction="horizontal" className="search-params">
        {{ value }}
        <TimeTypeSelect
          v-model="value"
          :include="['date', 'week', 'month', 'quarter', 'year', 'daterange']"
          :datePicker="{
            options: datePickerOptions,
            valueFormat: 'yyyy-MM-dd',
          }"
          :disabled-date="{
            date: -1,
            quarter: -1,
            week: -1,
            year: -1,
            month: -2,
            range: -1,
          }"
          :ivew-row-props="{ gutter: 8, type: 'flex', align: 'middle' }"
          @change="timeTypeChange"
          class="select-time"
        />
        <Button type="primary" @click="toggleEditing" :loading="updating">
          {{ isEditing ? '保存指标' : '编辑指标' }}
        </Button>
        <Button type="warning" @click="cancel">取消编辑</Button>
      </Space>
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
import Space from '@/components/Space';
import { dateDisabled } from '@/utils/date';

export default {
  name: 'App',
  data() {
    return {
      dateDisabled,
      updating: false,
      value: {
        type: 'quarter',
        date: new Date(),
        quarter: 1,
      },
      datePickerOptions: {
        disabledDate(date) {
          const disabledMonth = date.getMonth();
          return disabledMonth >= 11;
        },
      },
      editManner: 'row',
      isEditing: false,
    };
  },
  components: {
    Space,
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
* {
  margin: 0;
  padding: 0;
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
