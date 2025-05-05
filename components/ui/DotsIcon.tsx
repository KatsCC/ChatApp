import Svg, { Path } from "react-native-svg";

const DotsIcon = ({ width = 23, height = 23, color = "white" }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill={color}>
      <Path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
    </Svg>
  );
};

export default DotsIcon;
