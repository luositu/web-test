// 模拟数据存储
import type { Account, AttackCase, Task, LogEntry, MessageTemplate } from "./types"

// 内存数据存储
class DataStore {
  private accounts: Account[] = [
    {
      id: "1",
      uid: "4683494726",
      sixin_st: "ChrdWFpc2hvdS5zaXhpbi5sb2dpbjJvbI5z",
      salt: "JvzhX7HlxdFfUhLi",
      did: "ANDROID_2d0298105c3618d6",
      group: "默认组",
      createdAt: "2024-01-10 09:00",
      updatedAt: "2024-01-15 14:30",
    },
    {
      id: "2",
      uid: "2766034668",
      sixin_st: "_mt_1Nv_e3YPq63d4fwtrYWp7etWFBap",
      salt: "ds0jLSTYtKUH0exPuajjw==",
      did: "ANDROID_eeeeeeee000sixln",
      group: "测试组A",
      createdAt: "2024-01-12 11:20",
      updatedAt: "2024-01-14 16:45",
    },
    {
      id: "3",
      uid: "2766034669",
      sixin_st: "_mt_1Nv_e3YPq63d4fwtrYWp7etWFBap",
      salt: "C97XyC1qhhfRFOcCQyVp5g==",
      did: "ANDROID_eeeeeeee001sixln",
      group: "测试组B",
      createdAt: "2024-01-08 15:30",
      updatedAt: "2024-01-13 10:15",
    },
  ]

  private attackCases: AttackCase[] = [
    {
      id: "1",
      name: "钓鱼邮件测试 - 财务部门",
      type: "私聊文本",
      status: "active",
      description: "针对财务部门的钓鱼邮件攻击测试",
      targetAccounts: ["1"],
      messageTemplate: "1",
      attackCount: 3,
      qps: 60,
      interval: 60,
      targetCount: 45,
      successRate: 23.5,
      createdAt: "2024-01-10",
      lastRun: "2024-01-15 14:30",
      lastExecuted: "2024-01-15 14:30",
      createdBy: "管理员",
      senderGroup: "测试组A",
      senderAccounts: ["1", "2"],
      receiverGroup: "",
      receiverAccounts: [],
    },
    {
      id: "2",
      name: "社交工程攻击 - LinkedIn",
      type: "群聊文本",
      status: "paused",
      description: "LinkedIn平台社交工程攻击测试",
      targetAccounts: ["2"],
      messageTemplate: "2",
      attackCount: 2,
      qps: 120,
      interval: 120,
      targetCount: 28,
      successRate: 18.2,
      createdAt: "2024-01-12",
      lastRun: "2024-01-14 09:15",
      lastExecuted: "2024-01-14 09:15",
      createdBy: "测试员A",
      senderGroup: "测试组B",
      senderAccounts: [],
      receiverGroup: "",
      receiverAccounts: [],
    },
    {
      id: "3",
      name: "恶意链接测试 - 内部系统",
      type: "私聊图片",
      status: "completed",
      description: "内部系统恶意链接攻击测试",
      attackCount: 1,
      qps: 60,
      targetCount: 67,
      successRate: 31.8,
      createdAt: "2024-01-08",
      lastExecuted: "2024-01-13 16:45",
      senderGroup: "测试组C",
      senderAccounts: [],
      receiverGroup: "",
      receiverAccounts: [],
    },
    {
      id: "4",
      name: "点赞攻击测试 - 营销部门",
      type: "点赞",
      status: "active",
      description: "营销部门点赞攻击测试",
      attackCount: 1,
      qps: 60,
      targetCount: 32,
      successRate: 28.1,
      createdAt: "2024-01-11",
      lastExecuted: "2024-01-16 10:20",
      senderGroup: "测试组A",
      senderAccounts: ["1", "2"],
      receiverGroup: "",
      receiverAccounts: [],
    },
    {
      id: "5",
      name: "评论攻击测试",
      type: "评论",
      status: "draft",
      description: "评论功能攻击测试",
      attackCount: 1,
      qps: 60,
      targetCount: 15,
      successRate: 0,
      createdAt: "2024-01-13",
      lastExecuted: "未执行",
      senderGroup: "测试组B",
      senderAccounts: [],
      receiverGroup: "",
      receiverAccounts: [],
    },
    {
      id: "6",
      name: "账号登录测试",
      type: "登录",
      status: "active",
      description: "账号登录安全测试",
      attackCount: 1,
      qps: 60,
      targetCount: 58,
      successRate: 35.2,
      createdAt: "2024-01-09",
      lastExecuted: "2024-01-15 16:30",
      senderGroup: "测试组C",
      senderAccounts: [],
      receiverGroup: "",
      receiverAccounts: [],
      accountParams: {
        did: "ANDROID_2d0298105c3618d6",
        deviceModel: "小米11",
        osVersion: "Android 12",
        appVersion: "8.0.42"
      }
    },
    {
      id: "7",
      name: "账号注册测试",
      type: "注册",
      status: "paused",
      description: "账号注册流程测试",
      attackCount: 1,
      qps: 60,
      targetCount: 25,
      successRate: 42.1,
      createdAt: "2024-01-07",
      lastExecuted: "2024-01-14 12:10",
      senderGroup: "测试组C",
      senderAccounts: [],
      receiverGroup: "",
      receiverAccounts: [],
    },
  ]

  private tasks: Task[] = [
    {
      id: "1",
      name: "财务部门钓鱼测试计划",
      description: "针对财务部门的综合钓鱼邮件测试",
      status: "running",
      priority: "high",
      attackCases: ["1"],
      startTime: "2024-01-15 09:00",
      progress: 65,
      createdAt: "2024-01-14",
      createdBy: "管理员",
      autoStart: true,
    },
    {
      id: "2",
      name: "社交工程攻击演练",
      description: "模拟社交工程攻击场景",
      status: "paused",
      priority: "medium",
      attackCases: ["2"],
      startTime: "2024-01-14 14:30",
      progress: 40,
      createdAt: "2024-01-13",
      createdBy: "测试员A",
      autoStart: false,
    },
  ]

  private logs: LogEntry[] = [
    {
      id: "1",
      taskId: "1",
      timestamp: "2024-01-15 14:30:25",
      level: "info",
      message: "任务执行进度更新",
      details: "已完成 65% 的攻击用例执行",
    },
    {
      id: "2",
      taskId: "1",
      timestamp: "2024-01-15 14:25:12",
      level: "success",
      message: "攻击用例执行成功",
      details: "钓鱼邮件已成功发送至目标账号",
    },
  ]

  private messageTemplates: MessageTemplate[] = [
    {
      id: "1",
      name: "紧急财务通知",
      type: "email",
      subject: "【紧急】财务系统升级通知 - 需要立即验证",
      content: "尊敬的{{name}}，我们的财务系统将在今晚进行紧急升级...",
      variables: ["name", "department", "deadline"],
      createdAt: "2024-01-08",
      updatedAt: "2024-01-08",
    },
    {
      id: "2",
      name: "IT支持请求",
      type: "email",
      subject: "IT支持 - 账户安全验证",
      content: "您好{{name}}，我们检测到您的账户存在异常登录...",
      variables: ["name", "ip_address", "time"],
      createdAt: "2024-01-09",
      updatedAt: "2024-01-09",
    },
  ]

  private accountGroups: string[] = ["默认组", "测试组A", "测试组B"]

  // 账号管理方法
  getAccounts(): Account[] {
    return this.accounts
  }

  getAccount(id: string): Account | undefined {
    return this.accounts.find((account) => account.id === id)
  }

  createAccount(account: Omit<Account, "id" | "createdAt" | "updatedAt">): Account {
    const newAccount: Account = {
      ...account,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.accounts.push(newAccount)
    return newAccount
  }

  updateAccount(id: string, updates: Partial<Account>): Account | null {
    const index = this.accounts.findIndex((account) => account.id === id)
    if (index === -1) return null

    this.accounts[index] = {
      ...this.accounts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    return this.accounts[index]
  }

  deleteAccount(id: string): boolean {
    const index = this.accounts.findIndex((account) => account.id === id)
    if (index === -1) return false

    this.accounts.splice(index, 1)
    return true
  }

  // 攻击用例管理方法
  getAttackCases(): AttackCase[] {
    return this.attackCases
  }

  getAttackCase(id: string): AttackCase | undefined {
    return this.attackCases.find((case_) => case_.id === id)
  }

  createAttackCase(attackCase: Omit<AttackCase, "id" | "createdAt">): AttackCase {
    const newCase: AttackCase = {
      ...attackCase,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastExecuted: "未执行",
    }
    this.attackCases.push(newCase)
    return newCase
  }

  updateAttackCase(id: string, updates: Partial<AttackCase>): AttackCase | null {
    const index = this.attackCases.findIndex((case_) => case_.id === id)
    if (index === -1) return null

    this.attackCases[index] = {
      ...this.attackCases[index],
      ...updates,
    }
    return this.attackCases[index]
  }

  deleteAttackCase(id: string): boolean {
    const index = this.attackCases.findIndex((case_) => case_.id === id)
    if (index === -1) return false

    this.attackCases.splice(index, 1)
    return true
  }

  // 任务管理方法
  getTasks(): Task[] {
    return this.tasks
  }

  getTask(id: string): Task | undefined {
    return this.tasks.find((task) => task.id === id)
  }

  createTask(task: Omit<Task, "id" | "createdAt">): Task {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    this.tasks.push(newTask)
    return newTask
  }

  updateTask(id: string, updates: Partial<Task>): Task | null {
    const index = this.tasks.findIndex((task) => task.id === id)
    if (index === -1) return null

    this.tasks[index] = {
      ...this.tasks[index],
      ...updates,
    }
    return this.tasks[index]
  }

  deleteTask(id: string): boolean {
    const index = this.tasks.findIndex((task) => task.id === id)
    if (index === -1) return false

    this.tasks.splice(index, 1)
    return true
  }

  // 日志管理方法
  getLogs(taskId?: string): LogEntry[] {
    if (taskId) {
      return this.logs.filter((log) => log.taskId === taskId)
    }
    return this.logs
  }

  createLog(log: Omit<LogEntry, "id" | "timestamp">): LogEntry {
    const newLog: LogEntry = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    }
    this.logs.push(newLog)
    return newLog
  }

  // 消息模板管理方法
  getMessageTemplates(): MessageTemplate[] {
    return this.messageTemplates
  }

  getMessageTemplate(id: string): MessageTemplate | undefined {
    return this.messageTemplates.find((template) => template.id === id)
  }

  createMessageTemplate(template: Omit<MessageTemplate, "id" | "createdAt" | "updatedAt">): MessageTemplate {
    const newTemplate: MessageTemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.messageTemplates.push(newTemplate)
    return newTemplate
  }

  // 账号组管理方法
  getAccountGroups(): string[] {
    return this.accountGroups
  }

  createAccountGroup(groupName: string): boolean {
    if (this.accountGroups.includes(groupName)) {
      return false
    }
    this.accountGroups.push(groupName)
    return true
  }

  deleteAccountGroup(groupName: string): boolean {
    const index = this.accountGroups.indexOf(groupName)
    if (index === -1 || groupName === "默认组") {
      return false
    }

    // 将该组的账号移动到默认组
    this.accounts.forEach((account) => {
      if (account.group === groupName) {
        account.group = "默认组"
      }
    })

    this.accountGroups.splice(index, 1)
    return true
  }

  getAccountsByGroup(group: string): Account[] {
    return this.accounts.filter((account) => account.group === group)
  }

  // 批量操作方法
  deleteAccounts(ids: string[]): boolean {
    let deletedCount = 0
    ids.forEach((id) => {
      const index = this.accounts.findIndex((account) => account.id === id)
      if (index !== -1) {
        this.accounts.splice(index, 1)
        deletedCount++
      }
    })
    return deletedCount > 0
  }
}

// 单例实例
export const dataStore = new DataStore()
