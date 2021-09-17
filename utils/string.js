export const snakeToTitle = (text) => {
  return text.split('_')
    .map((chunk) => `${chunk[0].toUpperCase()}${chunk.slice(1).toLowerCase()}`)
    .join(' ');
};

export const camelToSnake = (key) => key.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
