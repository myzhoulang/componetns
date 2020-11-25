import { gender } from './utils/filters';

export const columns = [
  {
    title: 'Name',
    key: 'name',
    resizable: true,
    width: 180,
    isRenderEditTableCell: true,
    suffix: '',
    isSingle: true,
    rules: [{ required: true, message: 'Name is Required' }],
    dataType: '',
    placeholder: 'Name',
    fixed: 'left',
  },
  {
    title: 'Age',
    key: 'age',
    resizable: true,
    isSingle: true,
    width: 140,
    isRenderEditTableCell: true,
    suffix: '',
    dataType: 'number',
    rules: [
      { required: true, message: 'Age is Required' },
      { type: 'integer', min: 1, max: 150, message: '请正确输入年龄' },
    ],
  },
  {
    title: 'Birthday',
    key: 'birthday',
    resizable: true,
    isSingle: true,
    width: 240,
    isRenderEditTableCell: true,
    suffix: '',
    dataType: 'date',
    date: {
      iviewProps: {},
    },

    rules: [{ required: true, message: 'Birthday is Required' }],
  },
  {
    title: 'Email',
    key: 'email',
    resizable: true,
    tooltip: true,
    isSingle: true,
    width: 240,
    isRenderEditTableCell: true,
    suffix: '',
    rules: [
      { required: true, message: 'Email is Required' },
      { type: 'email', message: '该字段的值是一个邮箱' },
    ],
  },
  {
    title: 'Gender',
    key: 'gender',
    resizable: true,
    isSingle: true,
    width: 200,
    filter: gender,
    isRenderEditTableCell: true,
    suffix: '',
    dataType: 'checkbox',
    rules: [{ required: true, message: 'Gender is Required' }],
    options: [
      { label: 'Man', value: 'Man' },
      { label: 'Woman', value: 'Woman' },
    ],
  },
  // {
  //   title: 'Occupation',
  //   key: 'occupation',
  //   resizable: true,
  //   isSingle: true,
  //   tooltip: true,
  //   isRenderEditTableCell: true,
  //   suffix: '',
  //   dataType: 'select',
  //   rules: [{ required: true, message: 'Occupation is Required' }],
  //   width: 200,
  //   options: [
  //     { label: 'Teacher', value: 'teacher' },
  //     { label: 'Student', value: 'student' },
  //     { label: 'Doctor', value: 'doctor' },
  //   ],
  // },
  // {
  //   title: 'QQ',
  //   key: 'qq',
  //   resizable: true,
  //   isSingle: true,
  //   tooltip: true,
  //   isRenderEditTableCell: true,
  //   suffix: '',
  //   rules: [{ required: true, message: 'QQ is Required' }],
  //   minWidth: 200,
  // },
  // {
  //   title: 'Address',
  //   key: 'address',
  //   isSingle: true,
  //   resizable: true,
  //   tooltip: true,
  //   isRenderEditTableCell: true,
  //   suffix: '',
  //   rules: [{ required: true, message: 'Address is Required' }],
  // },

  {
    title: 'Action',
    key: 'action',
    // eslint-disable-next-line no-unused-vars
    render(h, params) {
      const { row } = params;
      return (
        <div>
          {row.isEditing ? (
            <div>
              <Button
                loading={row.updating}
                type={'primary'}
                onClick={() => this.rowSave(params)}
                style={{ marginRight: '8px' }}
              >
                Save
              </Button>
              <Button onClick={() => this.rowCancel(params)}>Cancel</Button>
            </div>
          ) : (
            <Button
              onClick={() => this.rowEdit(params)}
              type={'primary'}
              style={{ marginRight: '8px' }}
            >
              Edit
            </Button>
          )}
        </div>
      );
    },
  },
];
