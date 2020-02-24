/* eslint-disable no-bitwise */
export function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let colour = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += `00${value.toString(16)}`.substr(-2);
  }

  return colour;
}
/* eslint-enable no-bitwise */

const colors = {
  active: 'rgba(102, 102, 102, 0.5)',
  background: '#111111',
  black: '#000000',
  border: 'rgba(255, 255, 255, 0.33)',
  brand: '#FD6FFF',
  control: '#FFCA58',
  focus: '#FFCA58',
  placeholder: '#AAAAAA',
  text: '#eeeeee',
  white: '#FFFFFF',
};

export const normalizeColor = (color, theme, required) => {
  const colorSpec = colors[color] || color;
  // If the color has a light or dark object, use that
  let result = colorSpec;
  if (colorSpec) {
    if (theme.dark && colorSpec.dark) {
      result = colorSpec.dark;
    } else if (!theme.dark && colorSpec.light) {
      result = colorSpec.light;
    }
  }
  // allow one level of indirection in color names
  if (result && colors[result]) {
    result = normalizeColor(result, theme);
  }
  return required && result === color ? 'inherit' : result;
};
