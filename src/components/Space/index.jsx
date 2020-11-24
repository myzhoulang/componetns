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
    size: {
      type: [String, Number],
      validate(value) {
        return ['small', 'middle', 'large'].includes(value);
      },
    },
    direction: {
      type: String,
      validate(value) {
        return ['horizontal', 'vertical'].includes(value);
      },
    },
    align: {
      type: String,
      validate(value) {
        return ['start', 'end', 'center', 'baselint'].includes(value);
      },
    },
  },
  render(h, content) {
    const { children } = content;
    const { size, direction } = content.props;

    const len = children.length;

    if (len < 1) {
      return null;
    }
    const itemClassName = 'space-item';

    return (
      <div className={itemClassName}>
        {children.map((child, i) => {
          <div
            key={i}
            style={
              i === len - 1
                ? {}
                : {
                    [direction === 'vertical' ? 'marginBottom' : 'marginRight']:
                      typeof size === 'string'
                        ? `${spaceSize[size]}px`
                        : `${size}px`,
                  }
            }
          >
            {child}
          </div>;
        })}
      </div>
    );
  },
};

Space.install = function(Vue) {
  Vue.component(Space.name, Space);
};

export default Space;
