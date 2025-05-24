export type RunnerFn = () => Promise<void>;

let isRunning = false;
let interval: NodeJS.Timeout | null = null;
let intervalMs = 1000;
let runner: RunnerFn;

export function initController(fn: RunnerFn, initialRate = 1000): void {
  runner = fn;
  intervalMs = initialRate;
}

export function start(rate: number = intervalMs): void {
  if (isRunning) return;
  intervalMs = rate;
  isRunning = true;
  interval = setInterval(runner, intervalMs);
}

export function stop(): void {
  if (interval) clearInterval(interval);
  interval = null;
  isRunning = false;
}

export function updateRate(newRate: number): void {
  if (!isRunning) {
    intervalMs = newRate;
    return;
  }
  stop();
  start(newRate);
}

export function getCurrentRate(): number {
  return intervalMs;
}

export function status(): { isRunning: boolean; intervalMs: number } {
  return { isRunning, intervalMs };
}
