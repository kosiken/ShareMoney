import React from 'react';
import {View, StyleSheet, Animated, StyleProp, ViewStyle} from 'react-native';

interface BoxProps {
  flex?: boolean | number;
  row?: boolean;
  column?: boolean;
  center?: boolean;
  middle?: boolean;
  left?: boolean;
  right?: boolean;
  top?: boolean;
  bottom?: boolean;
  card?: boolean;
  shadow?: boolean;
  color?: string;
  space?: string;
  padding?: number[] | number;
  margin?: number[] | number;
  animated?: boolean;
  wrap?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: any;
}

const Box: React.FC<BoxProps> = props => {
  function handleMargins() {
    const {margin} = props;
    if (typeof margin === 'number') {
      return {
        marginTop: margin,
        marginRight: margin,
        marginBottom: margin,
        marginLeft: margin,
      };
    }

    if (typeof margin === 'object') {
      const marginSize = Object.keys(margin).length;
      switch (marginSize) {
        case 1:
          return {
            marginTop: margin[0],
            marginRight: margin[0],
            marginBottom: margin[0],
            marginLeft: margin[0],
          };
        case 2:
          return {
            marginTop: margin[0],
            marginRight: margin[1],
            marginBottom: margin[0],
            marginLeft: margin[1],
          };
        case 3:
          return {
            marginTop: margin[0],
            marginRight: margin[1],
            marginBottom: margin[2],
            marginLeft: margin[1],
          };
        default:
          return {
            marginTop: margin[0],
            marginRight: margin[1],
            marginBottom: margin[2],
            marginLeft: margin[3],
          };
      }
    }
  }

  function handlePaddings() {
    const {padding} = props;
    if (typeof padding === 'number') {
      return {
        paddingTop: padding,
        paddingRight: padding,
        paddingBottom: padding,
        paddingLeft: padding,
      };
    }

    if (typeof padding === 'object') {
      const paddingSize = Object.keys(padding).length;
      switch (paddingSize) {
        case 1:
          return {
            paddingTop: padding[0],
            paddingRight: padding[0],
            paddingBottom: padding[0],
            paddingLeft: padding[0],
          };
        case 2:
          return {
            paddingTop: padding[0],
            paddingRight: padding[1],
            paddingBottom: padding[0],
            paddingLeft: padding[1],
          };
        case 3:
          return {
            paddingTop: padding[0],
            paddingRight: padding[1],
            paddingBottom: padding[2],
            paddingLeft: padding[1],
          };
        default:
          return {
            paddingTop: padding[0],
            paddingRight: padding[1],
            paddingBottom: padding[2],
            paddingLeft: padding[3],
          };
      }
    }
  }

  const {
    flex,
    row,
    column,
    center,
    middle,
    left,
    right,
    top,
    bottom,
    space,
    padding,
    margin,
    animated,
    wrap,
    style,
    children,
    ...others
  } = props;

  const blockStyles = [
    styles.block,
    flex && {flex},
    flex === false && {flex: 0}, // reset / disable flex
    row && styles.row,
    column && styles.column,
    center && styles.center,
    middle && styles.middle,
    left && styles.left,
    right && styles.right,
    top && styles.top,
    bottom && styles.bottom,
    margin && {...handleMargins()},
    padding && {...handlePaddings()},
    space && {justifyContent: `space-${space}`},
    wrap && {flexWrap: 'wrap'},
    style, // rewrite predefined styles
  ];

  if (animated) {
    return (
      <Animated.View style={blockStyles as any} {...others}>
        {children}
      </Animated.View>
    );
  }

  return (
    <View style={blockStyles as any} {...others}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  block: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    alignItems: 'center',
  },
  middle: {
    justifyContent: 'center',
  },
  left: {
    justifyContent: 'flex-start',
  },
  right: {
    justifyContent: 'flex-end',
  },
  top: {
    justifyContent: 'flex-start',
  },
  bottom: {
    justifyContent: 'flex-end',
  },
});

export default Box;
