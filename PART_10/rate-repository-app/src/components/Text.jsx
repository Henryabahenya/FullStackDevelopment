import { Text as NativeText, StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  text: {
    color: '#24292e',
    fontSize: 14,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    fontWeight: 'normal',
  },
  colorTextSecondary: {
    color: '#586069',
  },
  colorPrimary: {
    color: '#0366d6',
  },
  fontSizeSubheading: {
    fontSize: 15,
  },
  fontWeightBold: {
    fontWeight: 'bold',
  },
});

const Text = ({ color, fontSize, fontWeight, style, ...props }) => {
  const textStyle = [
    styles.text,
    color === 'secondary' && styles.colorTextSecondary,
    color === 'primary' && styles.colorPrimary,
    fontSize === 'subheading' && styles.fontSizeSubheading,
    fontWeight === 'bold' && styles.fontWeightBold,
    style,
  ];

  return <NativeText style={textStyle} {...props} />;
};

export default Text;
