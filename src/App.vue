<template>
  <div id="app">
    {{data}}
    <PageContent>
      <Table
        :columns="columns"
        @toggle="toggle"
      ></Table>
    </PageContent>
  </div>
</template>

<script>
import EditTableCell from "@/components/EditTableCell";
import Table from "./components/EditTable";
import PageContent from "./components/PageContent";

export default {
  name: "App",
  data() {
    return {
      data: [],
      columns: [],
      types: [
        {
          value: "date",
          label: "按天"
        },
        {
          value: "week",
          label: "按周"
        },
        {
          value: "month",
          label: "按月"
        },
        {
          value: "quarter",
          label: "按季度"
        },
        {
          value: "year",
          label: "按年"
        }
      ],
      value: {
        type: "month",
        date: null,
        quarter: ""
      },
      datePickerOptions: {
        disabledDate(date) {
          const disabledMonth = date.getMonth();
          return disabledMonth >= 11;
        }
      },
      isEditing: false
    };
  },
  components: {
    Table,
    PageContent
  },

  created() {
    this.data = [
      {
        name: "John Brown",
        age: 18,
        address: "New York No. 1 Lake Park",
        date: "2016-07-03",
        email: "JohnBrown@gmail.com"
      },
      {
        name: "Jim Green",
        age: 24,
        address: "London No. 1 Lake Park",
        date: "2016-10-01",
        email: "JimGreen@gmail.com"
      },
      {
        name: "Joe Black",
        age: 30,
        address: "Sydney No. 1 Lake Park",
        date: "2016-10-02",
        email: "JoeBlack@gmail.com"
      },
      {
        name: "Jon Snow",
        age: 26,
        address: "Ottawa No. 2 Lake Park",
        date: "2016-10-04",
        email: "JonSnow@gmail.com"
      }
    ];
    this.columns = [
      {
        title: "Date",
        key: "date",
        resizable: true,
        tooltip: true,
        render: (h, { row, column, index }) => {
          return (
            <EditTableCell
              dataKey={column.key}
              text={row[column.key]}
              index={index}
              isEditing={this.isEditing}
              placeholder="请输入一个日期"
              rules={[{ required: true, message: "这是一个必填的字段" }]}
              onCellChange={this.cellChange}
            />
          );
        },
        width: 160
      },
      {
        title: "Email",
        key: "email",
        resizable: true,
        tooltip: true,
        render: (h, { row, column, index }) => {
          return (
            <EditTableCell
              dataKey={column.key}
              text={row[column.key]}
              index={index}
              isEditing={this.isEditing}
              placeholder="请输入一个邮箱"
              rules={[
                { required: true, message: "这是一个必填的字段" },
                { type: "email", message: "该字段的值是一个邮箱" }
              ]}
              onCellChange={this.cellChange}
            />
          );
        },
        width: 220
      },
      {
        title: "Name",
        key: "name",
        resizable: true,
        width: 180
      },
      {
        title: "Age",
        key: "age",
        resizable: true,
        width: 140,
        render: (h, { row, column, index }) => {
          const iviewProps = {
            size: "small"
          };
          return (
            <EditTableCell
              dataKey={column.key}
              text={row[column.key]}
              index={index}
              dataType="number"
              isEditing={this.isEditing}
              placeholder="请输入年龄"
              iviewProps={iviewProps}
              rules={[
                { required: true, message: "不能为空" },
                {
                  type: "integer",
                  min: 1,
                  max: 150,
                  message: "请正确输入年龄"
                }
              ]}
              onCellChange={this.cellChange}
            />
          );
        }
      },
      {
        title: "Address",
        key: "address"
      }
    ];
  },
  methods: {
    toggle(value) {
      console.log(1, value)
      this.isEditing = value;
    },
    cellChange({ value, dataKey, index }) {
      this.$set(this.data, index, Object.assign(this.data[index], {[dataKey]: value}))
    }
  }
};
</script>

<style lang="scss">
body,
html {
  height: 100%;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 30px;
  height: 100%;
}
.select-time .ivu-radio-group-button .ivu-radio-wrapper-checked {
  background-color: rgba(45, 140, 240, 1);
  color: #fff;
  &:hover {
    color: #fff;
    border-color: #57a3f3;
  }
}
</style>
