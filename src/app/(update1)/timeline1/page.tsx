declare module '@knight-lab/timelinejs/dist/js/timeline.js' {
  export default class Timeline {
    constructor(
      container: HTMLElement | string,
      data: any,
      options?: any
    );
    setData(data: any): void;
    setOptions(options: any): void;
    goToId(id: string): void;
    goToDate(date: Date | string): void;
    updateDisplay(): void;
  }
}