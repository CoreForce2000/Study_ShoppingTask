import {
  require_react
} from "./chunk-XMMJGW5B.js";
import {
  __commonJS
} from "./chunk-5WWUZCGV.js";

// node_modules/react-sub-unsub/dist/index.js
var require_dist = __commonJS({
  "node_modules/react-sub-unsub/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Subs = exports.Subscribe = void 0;
    var Subscribe = class _Subscribe {
      /**
       * Call a function that adds a listener and returns a function that will unsubscribe the listener.
       *
       * The function passed in will be called immediately to add the listener,
       * and its Unsubscribe function will be returned.
       *
       * @param subscribe The subscribe function, which returns an Unsubscribe. Will be called immediately.
       * @returns The Unsubscribe function for this subscription.
       */
      static subscribe(subscribe) {
        try {
          return subscribe();
        } catch (e) {
          console.error(e);
        }
        return () => {
        };
      }
      /**
       * Subscribe to an emitter event. Returns a function that will unsubscribe the listener.
       *
       * @param eventEmitter The [EventEmitter](https://nodejs.org/api/events.html#class-eventemitter) to subscribe to.
       * @param eventName The name of the event to listen for.
       * @param listener The listener callback that is called when the event occurs.
       * @returns The Unsubscribe function for this subscription.
       */
      static subscribeEvent(eventEmitter, eventName, listener) {
        eventEmitter.addListener(eventName, listener);
        return () => {
          eventEmitter.removeListener(eventName, listener);
        };
      }
      /**
       * Appends an event listener for events whose type attribute value is type. The callback argument sets the callback
       * that will be invoked when the event is dispatched.
       *
       * The options argument sets listener-specific options. For compatibility this can be a boolean, in which case the
       * method behaves exactly as if the value was specified as options's capture.
       *
       * When set to true, options's capture prevents callback from being invoked when the event's eventPhase attribute
       * value is BUBBLING_PHASE. When false (or not present), callback will not be invoked when event's eventPhase attribute
       * value is CAPTURING_PHASE. Either way, callback will be invoked if event's eventPhase attribute value is AT_TARGET.
       *
       * Returns a function that will unsubscribe the listener.
       *
       * @param domObj The DOM object to subscribe to for events.
       * @param eventName The name of the event to listen for.
       * @param listener The listener callback that is called when the event occurs.
       * @param options Listener-specific options. See function description.
       * @returns The Unsubscribe function for this subscription.
       */
      static subscribeDOMEvent(domObj, eventName, listener, options) {
        domObj.addEventListener(eventName, listener, options);
        return () => {
          domObj.removeEventListener(eventName, listener, options);
        };
      }
      /**
       * Sets a timer which executes a function once the timer expires using `setTimeout`.
       * Returns an unsubscribe function that clears the timeout using `clearTimeout`.
       *
       * @param handler A function to be executed after the timer expires.
       * @param delay The time, in milliseconds that the timer should wait before the specified function or code is executed. If this parameter is omitted, a value of 0 is used, meaning execute "immediately", or more accurately, the next event cycle.
       * @param args Additional arguments which are passed through to the handler specified.
       * @returns The Unsubscribe function for this subscription.
       */
      static setTimeout(handler, delay, ...args) {
        const timeout = setTimeout(handler, delay, args);
        return () => clearTimeout(timeout);
      }
      /**
       * Repeatedly calls a function with a fixed time delay between each call using `setInterval`.
       * Returns an unsubscribe function that clears the interval using `clearInterval`.
       *
       * @param handler A function to be executed after the timer expires.
       * @param delay The time, in milliseconds (thousandths of a second), the timer should delay in between executions of the specified function or code. Defaults to 0 if not specified.
       * @param args Additional arguments which are passed through to the handler once the timer expires.
       * @returns The Unsubscribe function for this subscription.
       */
      static setInterval(handler, delay, ...args) {
        const interval = setInterval(handler, delay, args);
        return () => clearInterval(interval);
      }
      /**
       * Call all unsubscribe functions passed in. Can pass either an array of unsubscribe functions,
       * or a single unsubscribe function.
       *
       * @param unsubs An array of unsubscribe functions, or a single unsubscribe function.
       */
      static unsubAll(unsubs) {
        if (Array.isArray(unsubs)) {
          unsubs.forEach((unsub) => {
            try {
              unsub();
            } catch (e) {
              console.error(e);
            }
          });
        } else {
          try {
            unsubs();
          } catch (e) {
            console.error(e);
          }
        }
      }
      /**
       * Creates and returns a cleanup function that, when called, calls all unsubscribe functions provided.
       *
       * @param unsubs All subscriptions to be unsubscribed when the returned cleanup function is called.
       * @returns A cleanup function that unsubscribes all subscriptions provided.
       */
      static createCleanup(unsubs) {
        return () => _Subscribe.unsubAll(unsubs);
      }
    };
    exports.Subscribe = Subscribe;
    var Subs = class {
      /**
       * Construct a new Subs object.
       *
       * A Subs object can be used to subscribe and unsubscribe to events,
       * and to collect subscriptions in an array to be unsubscribed all at once.
       *
       * Calling any of the subscribe functions will add the unsubscribe function to
       * an internal array. You can then call `unsubAll()` to unsubscribe all
       * at once and clear the list.
       *
       * You can optionally pass in an array of unsubscribe functions to start with.
       *
       * @param list Optional array of unsubscribe functions. Defaults to an empty list.
       */
      constructor(list = []) {
        this.list = list;
      }
      /**
       * Call a function that adds a listener and returns a function that will unsubscribe the listener.
       *
       * The function passed in will be called immediately to add the listener,
       * and its Unsubscribe function will be returned.
       *
       * The Unsubscribe function will be added to the internal list of unsubs. You can unsubscribe all by calling `unsubAll()`.
       *
       * @param subscribe The subscribe function, which returns an Unsubscribe. Will be called immediately.
       * @returns The Unsubscribe function for this subscription.
       */
      subscribe(subscribe) {
        const unsub = Subscribe.subscribe(subscribe);
        this.push(unsub);
        return unsub;
      }
      /**
       * Subscribe to an emitter event. Returns a function that will unsubscribe the listener.
       *
       * The Unsubscribe function will be added to the internal list of unsubs. You can unsubscribe all by calling `unsubAll()`.
       *
       * @param eventEmitter The [EventEmitter](https://nodejs.org/api/events.html#class-eventemitter) to subscribe to.
       * @param eventName The name of the event to listen for.
       * @param listener The listener callback that is called when the event occurs.
       * @returns The Unsubscribe function for this subscription.
       */
      subscribeEvent(eventEmitter, eventName, listener) {
        const unsub = Subscribe.subscribeEvent(eventEmitter, eventName, listener);
        this.push(unsub);
        return unsub;
      }
      /**
       * Subscribe to an event on a DOM object (Window or Node). Returns a function that will unsubscribe the listener.
       *
       * The Unsubscribe function will be added to the internal list of unsubs. You can unsubscribe all by calling `unsubAll()`.
       *
       * @param domObj The DOM object to subscribe to for events.
       * @param eventName The name of the event to listen for.
       * @param listener The listener callback that is called when the event occurs.
       * @returns The Unsubscribe function for this subscription.
       */
      subscribeDOMEvent(domObj, eventName, listener) {
        const unsub = Subscribe.subscribeDOMEvent(domObj, eventName, listener);
        this.push(unsub);
        return unsub;
      }
      /**
       * Sets a timer which executes a function once the timer expires using `setTimeout`.
       * Returns an unsubscribe function that clears the timeout using `clearTimeout`.
       *
       * The Unsubscribe function will be added to the internal list of unsubs. You can unsubscribe all by calling `unsubAll()`.
       *
       * @param handler A function to be executed after the timer expires.
       * @param delay The time, in milliseconds that the timer should wait before the specified function or code is executed. If this parameter is omitted, a value of 0 is used, meaning execute "immediately", or more accurately, the next event cycle.
       * @param args Additional arguments which are passed through to the handler specified.
       * @returns The Unsubscribe function for this subscription.
       */
      setTimeout(handler, delay, ...args) {
        const timeout = setTimeout(handler, delay, args);
        const unsub = () => clearTimeout(timeout);
        this.push(unsub);
        return unsub;
      }
      /**
       * Repeatedly calls a function with a fixed time delay between each call using `setInterval`.
       * Returns an unsubscribe function that clears the interval using `clearInterval`.
       *
       * The Unsubscribe function will be added to the internal list of unsubs. You can unsubscribe all by calling `unsubAll()`.
       *
       * @param handler A function to be executed after the timer expires.
       * @param delay The time, in milliseconds (thousandths of a second), the timer should delay in between executions of the specified function or code. Defaults to 0 if not specified.
       * @param args Additional arguments which are passed through to the handler once the timer expires.
       * @returns The Unsubscribe function for this subscription.
       */
      setInterval(handler, delay, ...args) {
        const interval = setInterval(handler, delay, args);
        const unsub = () => clearInterval(interval);
        this.push(unsub);
        return unsub;
      }
      /**
       * Pushes an unsubscribe function onto the subscription list.
       *
       * You can unsubscribe all by calling `unsubAll()`.
       *
       * @param unsub The unsubscribe function to push to the subscription list.
       */
      push(unsub) {
        this.list.push(unsub);
      }
      /**
       * Call all unsubscribe functions and clear the unsubscribe list.
       */
      unsubAll() {
        Subscribe.unsubAll(this.list);
        this.list.splice(0, this.list.length);
      }
      /**
       * Creates and returns a cleanup function that, when called, calls all unsubscribe functions and clears the unsubscribe list.
       *
       * @returns A cleanup function that unsubscribes all subscriptions and clears the unsubscribe list.
       */
      createCleanup() {
        return () => {
          this.unsubAll();
        };
      }
    };
    exports.Subs = Subs;
  }
});

// node_modules/react-use-precision-timer/dist/components/TimerRenderer.js
var require_TimerRenderer = __commonJS({
  "node_modules/react-use-precision-timer/dist/components/TimerRenderer.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TimerRenderer = void 0;
    var react_1 = __importDefault(require_react());
    var react_sub_unsub_1 = require_dist();
    var TimerRenderer = ({ timer, render = (timer2) => react_1.default.createElement(react_1.default.Fragment, null, timer2.getElapsedRunningTime()), renderRate = 10 }) => {
      const [, setRenderTime] = react_1.default.useState(Date.now());
      react_1.default.useEffect(() => {
        const subs = new react_sub_unsub_1.Subs();
        subs.setInterval(() => setRenderTime((/* @__PURE__ */ new Date()).getTime()), renderRate);
        return subs.createCleanup();
      }, [renderRate]);
      return render(timer);
    };
    exports.TimerRenderer = TimerRenderer;
  }
});

// node_modules/react-use-precision-timer/dist/hooks/useTimer.js
var require_useTimer = __commonJS({
  "node_modules/react-use-precision-timer/dist/hooks/useTimer.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useTimer = void 0;
    var React = __importStar(require_react());
    var react_sub_unsub_1 = require_dist();
    var never = Number.MAX_SAFE_INTEGER;
    var useTimer = (options = {}, callback) => {
      const [firstRun, setFirstRun] = React.useState(true);
      const [renderTime, setRenderTime] = React.useState(Date.now());
      const startedRef = React.useRef(false);
      const startTimeRef = React.useRef(never);
      const lastFireTimeRef = React.useRef(never);
      const nextFireTimeRef = React.useRef(never);
      const pauseTimeRef = React.useRef(never);
      const resumeTimeRef = React.useRef(never);
      const periodElapsedPauseTimeRef = React.useRef(0);
      const totalElapsedPauseTimeRef = React.useRef(0);
      const delay = React.useMemo(() => {
        var _a, _b;
        const s = (_a = options.speedMultiplier) !== null && _a !== void 0 ? _a : 1;
        const d = (_b = options.delay) !== null && _b !== void 0 ? _b : 0;
        return s === 0 ? 0 : s > 0 && d > 0 ? Math.max(1, Math.round(d * (1 / s))) : d;
      }, [options.delay, options.speedMultiplier]);
      const runOnce = React.useMemo(() => options.runOnce, [options.runOnce]);
      const fireOnStart = React.useMemo(() => options.fireOnStart, [options.fireOnStart]);
      const startImmediately = React.useMemo(() => options.startImmediately, [options.startImmediately]);
      const isStarted = React.useCallback(() => {
        return startedRef.current;
      }, []);
      const isStopped = React.useCallback(() => {
        return !isStarted();
      }, [isStarted]);
      const isPaused = React.useCallback(() => {
        return isStarted() && pauseTimeRef.current !== never;
      }, [isStarted]);
      const isRunning = React.useCallback(() => {
        return isStarted() && !isPaused();
      }, [isPaused, isStarted]);
      const getEffectiveDelay = React.useCallback(() => {
        return delay;
      }, [delay]);
      const getStartTime = React.useCallback(() => {
        if (isStarted()) {
          return startTimeRef.current;
        }
        return -1;
      }, [isStarted]);
      const getLastFireTime = React.useCallback(() => {
        return lastFireTimeRef.current < never && !!delay ? lastFireTimeRef.current : -1;
      }, [delay]);
      const getNextFireTime = React.useCallback(() => {
        if (isRunning() && !!delay) {
          return nextFireTimeRef.current;
        }
        return -1;
      }, [isRunning, delay]);
      const getPauseTime = React.useCallback(() => {
        if (isPaused()) {
          return pauseTimeRef.current;
        }
        return -1;
      }, [isPaused]);
      const getResumeTime = React.useCallback(() => {
        if (isStarted() && resumeTimeRef.current < never) {
          return resumeTimeRef.current;
        }
        return -1;
      }, [isStarted]);
      const getElapsedStartedTime = React.useCallback(() => {
        if (isStarted()) {
          return Date.now() - startTimeRef.current;
        }
        return 0;
      }, [isStarted]);
      const getElapsedRunningTime = React.useCallback(() => {
        if (isStarted()) {
          if (isPaused()) {
            return pauseTimeRef.current - startTimeRef.current - totalElapsedPauseTimeRef.current;
          } else {
            return Date.now() - startTimeRef.current - totalElapsedPauseTimeRef.current;
          }
        }
        return 0;
      }, [isPaused, isStarted]);
      const getPeriodElapsedPausedTime = React.useCallback(() => {
        let additionalElapsedPauseTime = 0;
        if (isPaused()) {
          additionalElapsedPauseTime = Date.now() - pauseTimeRef.current;
        }
        return periodElapsedPauseTimeRef.current + additionalElapsedPauseTime;
      }, [isPaused]);
      const getTotalElapsedPausedTime = React.useCallback(() => {
        let additionalElapsedPauseTime = 0;
        if (isPaused()) {
          additionalElapsedPauseTime = Date.now() - pauseTimeRef.current;
        }
        return totalElapsedPauseTimeRef.current + additionalElapsedPauseTime;
      }, [isPaused]);
      const getElapsedResumedTime = React.useCallback(() => {
        if (isRunning()) {
          return Date.now() - resumeTimeRef.current;
        }
        return 0;
      }, [isRunning]);
      const getRemainingTime = React.useCallback(() => {
        const currentTime = Date.now();
        if (isStarted() && !!delay) {
          if (isRunning()) {
            return Math.max(0, nextFireTimeRef.current - currentTime);
          } else if (isPaused()) {
            const edgeTime = lastFireTimeRef.current !== never ? lastFireTimeRef.current : startTimeRef.current;
            return Math.max(0, delay - (pauseTimeRef.current - edgeTime - periodElapsedPauseTimeRef.current));
          }
        }
        return 0;
      }, [isPaused, isRunning, isStarted, delay]);
      const start = React.useCallback((startTimeMillis = Date.now()) => {
        const newNextFireTime = delay ? Math.max(startTimeMillis, fireOnStart ? startTimeMillis : startTimeMillis + delay) : never;
        startTimeRef.current = startTimeMillis;
        lastFireTimeRef.current = never;
        nextFireTimeRef.current = newNextFireTime;
        pauseTimeRef.current = never;
        resumeTimeRef.current = startTimeMillis;
        periodElapsedPauseTimeRef.current = 0;
        totalElapsedPauseTimeRef.current = 0;
        startedRef.current = true;
        setRenderTime(Date.now());
      }, [delay, fireOnStart]);
      const stop = React.useCallback(() => {
        startTimeRef.current = never;
        lastFireTimeRef.current = never;
        nextFireTimeRef.current = never;
        pauseTimeRef.current = never;
        resumeTimeRef.current = never;
        periodElapsedPauseTimeRef.current = 0;
        totalElapsedPauseTimeRef.current = 0;
        startedRef.current = false;
        setRenderTime(Date.now());
      }, []);
      const pause = React.useCallback(() => {
        if (isRunning()) {
          pauseTimeRef.current = Date.now();
          resumeTimeRef.current = never;
          setRenderTime(Date.now());
        }
      }, [isRunning]);
      const resume = React.useCallback(() => {
        if (isStarted() && isPaused()) {
          const currentTime = Date.now();
          nextFireTimeRef.current = currentTime + getRemainingTime();
          periodElapsedPauseTimeRef.current = 0;
          totalElapsedPauseTimeRef.current = totalElapsedPauseTimeRef.current + (currentTime - pauseTimeRef.current);
          pauseTimeRef.current = never;
          resumeTimeRef.current = currentTime;
          setRenderTime(Date.now());
        }
      }, [isStarted, isPaused, getRemainingTime]);
      React.useEffect(() => {
        const subs = new react_sub_unsub_1.Subs();
        const checkTimer = () => {
          if (delay && !isPaused()) {
            const now = Date.now();
            if (now >= nextFireTimeRef.current) {
              const overdueCalls = lastFireTimeRef.current !== never ? Math.max(0, Math.floor((now - nextFireTimeRef.current) / delay)) : 0;
              lastFireTimeRef.current = now;
              periodElapsedPauseTimeRef.current = 0;
              const overdueElapsedTime = overdueCalls * delay;
              const newFireTime = Math.max(now, nextFireTimeRef.current + delay + overdueElapsedTime);
              nextFireTimeRef.current = newFireTime;
              if (typeof callback === "function") {
                try {
                  callback(overdueCalls);
                } catch (e) {
                  console.error(e);
                }
              }
              if (!runOnce) {
                subs.setTimeout(() => {
                  checkTimer();
                }, Math.max(newFireTime - Date.now(), 1));
              } else {
                stop();
              }
            } else if (nextFireTimeRef.current < never) {
              subs.setTimeout(() => {
                checkTimer();
              }, Math.max(nextFireTimeRef.current - Date.now(), 1));
            }
          }
        };
        checkTimer();
        return subs.createCleanup();
      }, [callback, delay, isPaused, renderTime, runOnce, stop]);
      React.useEffect(() => {
        if (firstRun) {
          setFirstRun(false);
          if (startImmediately) {
            start();
          }
        }
      }, [firstRun, startImmediately, start]);
      return React.useMemo(() => {
        return {
          start,
          stop,
          pause,
          resume,
          isStarted,
          isStopped,
          isRunning,
          isPaused,
          getEffectiveDelay,
          getStartTime,
          getLastFireTime,
          getNextFireTime,
          getPauseTime,
          getResumeTime,
          getRemainingTime,
          getElapsedStartedTime,
          getElapsedRunningTime,
          getTotalElapsedPausedTime,
          getPeriodElapsedPausedTime,
          getElapsedResumedTime
        };
      }, [
        getEffectiveDelay,
        getElapsedResumedTime,
        getElapsedRunningTime,
        getElapsedStartedTime,
        getLastFireTime,
        getNextFireTime,
        getPauseTime,
        getPeriodElapsedPausedTime,
        getRemainingTime,
        getResumeTime,
        getStartTime,
        getTotalElapsedPausedTime,
        isPaused,
        isRunning,
        isStarted,
        isStopped,
        pause,
        resume,
        start,
        stop
      ]);
    };
    exports.useTimer = useTimer;
  }
});

// node_modules/react-use-precision-timer/dist/hooks/useDelay.js
var require_useDelay = __commonJS({
  "node_modules/react-use-precision-timer/dist/hooks/useDelay.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useDelay = void 0;
    var useTimer_1 = require_useTimer();
    var useDelay = (delay, callback) => {
      return (0, useTimer_1.useTimer)({ delay, runOnce: true }, callback);
    };
    exports.useDelay = useDelay;
  }
});

// node_modules/react-use-precision-timer/dist/hooks/useStopwatch.js
var require_useStopwatch = __commonJS({
  "node_modules/react-use-precision-timer/dist/hooks/useStopwatch.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useStopwatch = void 0;
    var useTimer_1 = require_useTimer();
    var useStopwatch = () => {
      return (0, useTimer_1.useTimer)();
    };
    exports.useStopwatch = useStopwatch;
  }
});

// node_modules/react-use-precision-timer/dist/hooks/useMomentaryBool.js
var require_useMomentaryBool = __commonJS({
  "node_modules/react-use-precision-timer/dist/hooks/useMomentaryBool.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useMomentaryBool = void 0;
    var react_1 = __importDefault(require_react());
    var useDelay_1 = require_useDelay();
    var useMomentaryBool = (initial, delay) => {
      const [state, setState] = react_1.default.useState(initial);
      const callback = react_1.default.useCallback(() => setState(initial), [initial]);
      const onceTimer = (0, useDelay_1.useDelay)(delay, callback);
      const toggle = react_1.default.useCallback(() => {
        setState(!initial);
        onceTimer.start();
      }, [onceTimer, initial]);
      return [state, toggle];
    };
    exports.useMomentaryBool = useMomentaryBool;
  }
});

// node_modules/react-use-precision-timer/dist/index.js
var require_dist2 = __commonJS({
  "node_modules/react-use-precision-timer/dist/index.js"(exports) {
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_TimerRenderer(), exports);
    __exportStar(require_useDelay(), exports);
    __exportStar(require_useStopwatch(), exports);
    __exportStar(require_useTimer(), exports);
    __exportStar(require_useMomentaryBool(), exports);
  }
});
export default require_dist2();
//# sourceMappingURL=react-use-precision-timer.js.map
