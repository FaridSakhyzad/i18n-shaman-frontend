export const debounce = (callback: Function, wait: number) => {
  let timeoutId: number | null = null;

  return (...args: any[]) => {
    window.clearTimeout(timeoutId as number);

    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
};