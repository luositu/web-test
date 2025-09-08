// 数据类型定义
export interface Account {
  id: string
  uid: string
  sixin_st: string
  salt: string
  did: string
  status: "active" | "inactive" | "error"
  description?: string
  lastUsed: string
  createdAt: string
  updatedAt: string
}

export interface AttackCase {
  id: string
  name: string
  type: "email" | "social" | "web" | "sms"
  status: "draft" | "active" | "paused" | "completed"
  description: string
  targetAccounts: string[]
  messageTemplate: string
  attackCount: number
  interval: number
  successRate: number
  targetCount: number
  createdAt: string
  lastRun: string
  createdBy: string
}

export interface Task {
  id: string
  name: string
  description: string
  status: "pending" | "running" | "paused" | "completed" | "failed"
  priority: "low" | "medium" | "high"
  attackCases: string[]
  startTime: string
  endTime?: string
  progress: number
  createdAt: string
  createdBy: string
  scheduledTime?: string
  autoStart: boolean
}

export interface LogEntry {
  id: string
  taskId: string
  timestamp: string
  level: "info" | "warning" | "error" | "success"
  message: string
  details?: string
}

export interface MessageTemplate {
  id: string
  name: string
  type: "email" | "sms" | "social"
  subject: string
  content: string
  variables: string[]
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
