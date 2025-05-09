import Svg, { Path } from "react-native-svg";

const MessageIcon = ({ width = 23, height = 23, color = "white" }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill={color}>
      <Path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9 9 0 0 0 8 15" />
    </Svg>
  );
};

export default MessageIcon;
