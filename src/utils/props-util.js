export const isEmptyElement = e => {
  return !(e.tag || (e.text && e.text.trim() !== ''));
};

export const filterEmpty = elemens => {
  return elemens.filter(item => !isEmptyElement(item));
};
