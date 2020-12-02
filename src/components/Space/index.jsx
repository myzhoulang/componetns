import { filterEmpty } from '@/utils/props-util';
const spaceSize = {
  small: 8,
  middle: 16,
  large: 24,
};
import './index.less';
const Space = {
  functional: true,
  name: 'Space',
  props: {
    className: {
      type: String,
    },
    size: {
      type: [String, Number],
    },
    direction: {
      type: String,
      default: 'horizontal',
      validate(value) {
        return ['horizontal', 'vertical'].includes(value);
      },
    },
    align: {
      type: String,
      validate(value) {
        return ['start', 'end', 'center', 'baseline'].includes(value);
      },
    },
  },
  render(h, content) {
    const { children } = content;
    const { size, direction, align, className } = content.props;
    const items = filterEmpty(children);
    const len = items.length;

    if (len < 1) {
      return null;
    }
    const itemClassName = 'space-item';
    // 水平方向 子元素默认居中对齐
    const mergedAlign =
      align === undefined && direction === 'horizontal' ? 'center' : align;
    const spaceClassName = [
      {
        [className]: true,
        space: true,
        [`space-${direction}`]: true,
        [`space-align-${mergedAlign}`]: true,
      },
    ];
    return (
      <div class={spaceClassName}>
        {items.map((child, i) => {
          return (
            <div
              class={itemClassName}
              key={i}
              style={
                i === len - 1
                  ? {}
                  : {
                      [direction === 'vertical'
                        ? 'marginBottom'
                        : 'marginRight']:
                        typeof size === 'string'
                          ? `${spaceSize[size]}px`
                          : `${size}px`,
                    }
              }
            >
              {child}
            </div>
          );
        })}
      </div>
    );
  },
};

Space.install = function(Vue) {
  Vue.component(Space.name, Space);
};

export default Space;
