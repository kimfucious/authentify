export const trimText = (len, text) => {
  if (text && text.length <= len) return text;
  return text.slice(0, len - 3) + "...";
};
