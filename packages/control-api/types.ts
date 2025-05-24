export interface ControlStatus {
    isRunning: boolean;
    intervalMs: number;
  }
  
  export interface ControlRateRequest {
    rate: number;
  }
  
  export interface ControlStartRequest {
    rate?: number; // optional, fallback to default
  }
  