let uniqueId = 1;

export function getId(componentName) {
  return (componentName || '') + uniqueId++;
}

export function getMin(data, fn) {
  const value = fn instanceof Function ? fn : d => d;
  let min = Infinity;
  data.forEach((d) => {
    const v = value(d);
    if (v < min) {
      min = v;
    }
  });

  return min;
}

export function getMax(data, fn) {
  const value = fn instanceof Function ? fn : d => d;
  let max = -Infinity;
  data.forEach((d) => {
    const v = value(d);
    if (v > max) {
      max = v;
    }
  });

  return max;
}

export function getLatLngRange(series, key = 'lat') {
  let min = Infinity;
  let max = -Infinity;

  series.forEach((data, idx) => {
    const sMin = getMin(data, d => d[key]);
    const sMax = getMax(data, d => d[key]);

    if (sMax > max) {
      max = sMax;
    }

    if (sMin < min) {
      min = sMin;
    }
  });

  return { min, max };
};

export function arrayGenerator(N) {
  return Array.apply(null, { length: N }).map(Number.call, Number);
}