# 时间类型选择器组件

## 类型选项
- 类型
 ```typescript
// 选择类型
interface IType<T> {
  date: T // 天
  week: T // 周
  month: T // 月
  quarter: number // 季度
  year: T // 年
  daterange: T // 日期区间
}
// 时间禁用函数
type disableFn = (date: Date) => Boolean
 
// 可选的显示风格
type Style = 'select' | ''
 
// 可选的size
type Size = 'small' | 'default' | 'large'

// 可选的时间类型
type Types = 'date' | 'week' | 'month' | 'quarter' | 'year' | 'daterange'
 
// 下拉选项
interface IOption<T> {
    label: string;
    value: T;
}

// v-model 类型
interface IValue {
  type: string;
  value: string | string[];
  quarter: number | null
}

// 默认时间选择类型选项
const defaultTypes: IOption<Types>[]  = [
  {label: '按天', value: 'date'}, 
  {label: '按周', value: 'week'},
  {label: '按月', value: 'month'},
  {label: '按季度', value: 'quarter'},
  {label: '按年', value: 'year'},
  {label: '按区间', value: 'daterange'},
]
// 默认季度的选项
const defaultQuarters: IOption<number>[]  = [
  {label: '第一季度', value: 0}, 
  {label: '第二季度', value: 1},
  {label: '第三季度', value: 2},
  {label: '第四季度', value: 3},
]

// 默认选择的类型对象
const defaultValue: IValue = {
  type: 'month',
  value: dayjs(new Date()).format('YYYY-MM-DD'),
  quarter: null
}

// 格式化默认值
const format: IType<string> = {
  date: 'YYYY/MM/DD',
  week: 'YYYY/MM/DD',
  month: 'YYYY/MM',
  quarter: 'YYYY',
  year: 'YYYY',
  daterange: 'YYYY/MM/DD'
}
 ```

- 默认的`types`选项

```json
[
    {
        "value": "date",
        "label": "按天"
    },
    {
        "value": "week",
        "label": "按周"
    },
    {
        "value": "month",
        "label": "按月"
    },
    {
        "value": "daterange",
        "label": "按区间"
    },
    {
        "value": "quarter",
        "label": "按季度"
    },
    {
        "value": "year",
        "label": "按年"
    }
]
```

## props

| 属性                 | 类型              | 说明                                                                                                                         | 默认值                                         | 版本 |
| -------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ---- |
| v-model(value)       | IValue     | 当前选择的时间类型和值, 默认类型为月，值为当前月                                                                             | defaultValue |      |
| iviewDatePickerProps | Object            | 对应`iview DatePicker`的`props`                                                                                              | `{}` |      |
| format               | IType<string>     | 格式化显示时间                                                                    | format |      |
| label                | String            | 组件标签文本                                                                                                                 | "时间" |      |
| isShowLabel          | Boolean           | 是否显示标签文本                                                                                                             | `true` |      |
| disabledDate         | Boolean \| IType<disableFn> | 时间选择器禁用哪些时间，`Boolan`为`true`则使用组件内部的禁用规则，`false`则为不禁用 | `false` |                                                |
| disableds            | Boolean \| IType<disableFn> | 禁止选择`DatePicker`和`quarter`控件 | `false`                                                                                               |                                                |
| showStyle            | Style             | 时间选择器的风格                                                               |                                                |      |
| size                 | Size              | 内部 `iview` 组件的 `size`                                                                                | "default" |      |
| types                | IOption<string>[] | 类型选项                                                                                                                     | defaultTypes                               |      |
| quarters             | IOption<number>[] | 季度下拉选项                                                                                                                 | defaultQuarters |      |
| include              | Types[] \| Types | 需要显示的时间类型 |                                                                                                            |                                                |
| exclude              | Types[] \| Types | 不需要显示的时间类型 |                                                                                                          |                                                |
| defaultValues        | IType \| Boolean | 时间控件的默认值, `Boolean`为`true`则使用组件默认的默认值，`false`为不使用默认值 |  |                                                |

