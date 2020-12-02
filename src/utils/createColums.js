const createColums = function(colums = []) {
  return colums.map(
    ({
      isRenderEditTableCell,
      suffix,
      dataType,
      placeholder,
      rules,
      options,
      filter,
      render,
      iviewProps,
      ...other
    }) => {
      const col = {
        ...other,
      };
      if (isRenderEditTableCell) {
        // eslint-disable-next-line no-unused-vars
        col.render = (h, { row, column, index }) => {
          const newRules = [];
          const { editManner = 'cell', isEditing = false } = this;

          const isEditings = {
            cell: false,
            row: row.isEditing,
            table: isEditing,
          };
          // 重新生成规则
          // 主要解决一些字段之间依赖的规则校验
          for (const rule of rules) {
            if (rule.validator) {
              newRules.push(rule.validator.bind(row));
            } else {
              newRules.push(rule);
            }
          }
          return h('edit-table-cell', {
            props: {
              key: column.key,
              dataKey: column.key,
              text: filter ? filter(row[column.key]) : row[column.key],
              index: index,
              dataType: dataType,
              date: iviewProps,
              editManner: this.editManner,
              isEditing: isEditings[editManner],
              placeholder: placeholder,
              options: options,
              rules: newRules,
              suffix,
            },
            on: {
              cellChange: this.cellChange,
            },
          });
        };
      } else {
        col.render = (h, params) => {
          return render.bind(this)(h, params);
        };
      }

      return col;
    },
  );
};
export default createColums;
