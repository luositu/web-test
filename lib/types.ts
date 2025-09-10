// 数据类型定义
export interface Account {
  id: string
  uid: string
  sixin_st: string
  salt: string
  did: string
  group: string
  status?: "active" | "inactive" | "error"
  description?: string
  lastUsed?: string
  createdAt: string
  updatedAt: string
}

export interface AttackCase {
  id: string
  name: string
  serviceType: "IM" | "HTTP"
  apiInterface: string
  status: "draft" | "active" | "paused" | "completed" | "pending"
  description?: string
  parameters: string // JSON格式的参数
  attackCount: number
  interval?: number
  qps: number
  successRate?: number
  targetCount?: number
  createdAt: string
  lastExecuted?: string
  lastRun?: string
  createdBy?: string
  // 新的链路级配置
  chainConfig?: {
    accountGroup: string
    parameterFile?: File | null
    globalVariables: string
  }
  // 保留原有字段以保持向后兼容
  senderGroup?: string
  senderAccounts?: string[]
  receiverGroup?: string
  receiverAccounts: string[]
  type?: string
  targetAccounts?: string[]
  messageTemplate?: string
  accountParams?: {
    did?: string
    deviceModel?: string
    osVersion?: string
    appVersion?: string
  }
  messageContent?: {
    text?: string
    imageUrl?: string
    cardContent?: string
    cardImageUrl?: string
    cardWebUrl?: string
    voiceUrl?: string
    videoUrl?: string
  }
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
  // 扩展的执行记录字段
  totalTargets?: number
  successfulAttacks?: number
  failedAttacks?: number
  executionLogs?: TaskExecutionLog[]
  realTimeStats?: RealTimeStats
  qpsHistory?: QPSDataPoint[]
  backendLogs?: BackendLog[]
}

export interface LogEntry {
  id: string
  taskId: string
  timestamp: string
  level: "info" | "warning" | "error" | "success"
  message: string
  details?: string
}

// 任务执行详细日志
export interface TaskExecutionLog {
  id: string
  taskId: string
  attackCaseId?: string
  timestamp: string
  level: "info" | "warning" | "error" | "success" | "debug"
  message: string
  details: string
  component: "qps" | "api" | "auth" | "network" | "system" | "user"
  executionTime?: number // 执行时间（毫秒）
  responseCode?: number
  responseTime?: number
  targetUserId?: string
  requestData?: string
  responseData?: string
}

// 实时统计数据
export interface RealTimeStats {
  currentQPS: number
  averageResponseTime: number
  successRate: number
  activeConnections: number
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  avgThroughput: number
}

// QPS数据点
export interface QPSDataPoint {
  time: string
  qps: number
  timestamp: number
  responseTime?: number
  errorRate?: number
}

// 后端日志
export interface BackendLog {
  id: string
  taskId: string
  timestamp: string
  source: "api_server" | "auth_service" | "database" | "cache" | "queue" | "external_api"
  level: "debug" | "info" | "warn" | "error" | "fatal"
  message: string
  context?: Record<string, any>
  stackTrace?: string
  requestId?: string
  userId?: string
  duration?: number
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

// IM服务接口定义
export interface IMServiceInterface {
  id: string
  name: string
  description: string
  requiredParams: string[]
}

// HTTP服务接口定义
export interface HTTPServiceInterface {
  id: string
  name: string
  description: string
  method: "GET" | "POST" | "PUT" | "DELETE"
  requiredParams: string[]
}

// 服务接口数据
export const IM_INTERFACES: IMServiceInterface[] = [
  {
    id: "im_send_message",
    name: "发送消息",
    description: "向指定用户发送文本消息",
    requiredParams: ["targetUserId", "message", "messageType"]
  },
  {
    id: "im_send_file",
    name: "发送文件",
    description: "向指定用户发送文件",
    requiredParams: ["targetUserId", "fileUrl", "fileName"]
  },
  {
    id: "im_create_group",
    name: "创建群组",
    description: "创建新的群组聊天",
    requiredParams: ["groupName", "memberIds"]
  },
  {
    id: "im_join_group",
    name: "加入群组",
    description: "将用户添加到指定群组",
    requiredParams: ["groupId", "userIds"]
  },
  {
    id: "im_get_conversation_list",
    name: "获取会话列表",
    description: "获取用户的所有会话",
    requiredParams: ["userId", "pageSize"]
  }
]

export const HTTP_INTERFACES: HTTPServiceInterface[] = [
  {
    id: "http_user_login",
    name: "用户登录",
    description: "用户身份验证接口",
    method: "POST",
    requiredParams: ["username", "password"]
  },
  {
    id: "http_user_register",
    name: "用户注册",
    description: "新用户注册接口",
    method: "POST",
    requiredParams: ["username", "password", "email"]
  },
  {
    id: "http_get_user_info",
    name: "获取用户信息",
    description: "获取指定用户的详细信息",
    method: "GET",
    requiredParams: ["userId", "token"]
  },
  {
    id: "http_update_profile",
    name: "更新用户资料",
    description: "更新用户个人资料",
    method: "PUT",
    requiredParams: ["userId", "token", "profileData"]
  },
  {
    id: "http_upload_file",
    name: "文件上传",
    description: "上传文件到服务器",
    method: "POST",
    requiredParams: ["file", "token", "uploadPath"]
  },
  {
    id: "http_search_users",
    name: "搜索用户",
    description: "根据关键词搜索用户",
    method: "GET",
    requiredParams: ["keyword", "token"]
  }
]
