import Svg, { Path } from "react-native-svg";

const HomeIcon = ({ width = 23, height = 23, color = "white" }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill={color}>
      <Path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z" />
      <Path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z" />
    </Svg>
  );
};

export default HomeIcon;
