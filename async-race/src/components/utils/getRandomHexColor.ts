const getRandomSubColor = () => {
  const color = Math.floor(Math.random() * 256).toString(16);
  return color.length === 2 ? color : `0${color}`;
};

const getRandomHexColor = () => {
  const color1 = getRandomSubColor();
  const color2 = getRandomSubColor();
  const color3 = getRandomSubColor();
  return `#${color1}${color2}${color3}`;
};

export default getRandomHexColor;
