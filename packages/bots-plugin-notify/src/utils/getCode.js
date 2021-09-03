export const getCode = (text = '', provider = 'telegram') => {
  if (provider === 'telegram') return `\`${text}\``;
  if (provider === 'slack') return `\`\`\`${text}\`\`\``;
  return text;
};

export default getCode;