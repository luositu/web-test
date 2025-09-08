// API客户端工具函数
import type { ApiResponse } from "./types"

class ApiClient {
  private baseUrl = "/api"

  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "请求失败")
      }

      return data
    } catch (error) {
      console.error("API请求错误:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "未知错误",
      }
    }
  }

  // 账号管理API
  async getAccounts() {
    return this.request("/accounts")
  }

  async createAccount(account: any) {
    return this.request("/accounts", {
      method: "POST",
      body: JSON.stringify(account),
    })
  }

  async updateAccount(id: string, updates: any) {
    return this.request(`/accounts/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    })
  }

  async deleteAccount(id: string) {
    return this.request(`/accounts/${id}`, {
      method: "DELETE",
    })
  }

  // 攻击用例API
  async getAttackCases() {
    return this.request("/attack-cases")
  }

  async createAttackCase(attackCase: any) {
    return this.request("/attack-cases", {
      method: "POST",
      body: JSON.stringify(attackCase),
    })
  }

  // 任务管理API
  async getTasks() {
    return this.request("/tasks")
  }

  async createTask(task: any) {
    return this.request("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    })
  }

  async getTaskLogs(taskId: string) {
    return this.request(`/tasks/${taskId}/logs`)
  }

  async createTaskLog(taskId: string, log: any) {
    return this.request(`/tasks/${taskId}/logs`, {
      method: "POST",
      body: JSON.stringify(log),
    })
  }
}

export const apiClient = new ApiClient()
