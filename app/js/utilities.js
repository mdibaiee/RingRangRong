const map = (a, oldMin, oldMax, min, max) => {
  return (a - oldMin)/(oldMax-oldMin) * (max-min) + min;
};
