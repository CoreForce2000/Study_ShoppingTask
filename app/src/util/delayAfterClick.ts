export function delayAfterClick(func: Function, delay:number = 350, delayUpperRange:number = 0) {
    const randomDelay = Math.random() * delayUpperRange + delay;
    
    setTimeout(() => {
      func();
    }, randomDelay);
  }
