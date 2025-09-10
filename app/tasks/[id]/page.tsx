"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Square, 
  RefreshCw,
  Activity,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Eye,
  Download,
  FileText,
  Server,
  Zap,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { Task, TaskExecutionLog, RealTimeStats, QPSDataPoint, BackendLog } from "@/lib/types"

// 使用扩展的Task类型
type TaskDetails = Task & {
  totalTargets: number
  successfulAttacks: number
  failedAttacks: number
}

export default function TaskDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.id as string
  
  const [taskDetails, setTaskDetails] = useState<TaskDetails | null>(null)
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)
  const [expandedCases, setExpandedCases] = useState<Set<string>>(new Set())

  // 模拟任务详情数据
  useEffect(() => {
    const mockTaskDetails: TaskDetails = {
      id: taskId,
      name: "财务部门钓鱼测试计划",
      description: "针对财务部门的综合钓鱼邮件测试，评估员工安全意识水平",
      status: "pending",
      priority: "high",
      attackCases: ["钓鱼邮件测试 - 财务部门", "恶意链接测试 - 内部系统"],
      startTime: "尚未开始",
      progress: 0,
      createdAt: "2024-01-14",
      createdBy: "管理员",
      autoStart: false,
      totalTargets: 45,
      successfulAttacks: 0,
      failedAttacks: 0,
      realTimeStats: {
        currentQPS: 0,
        averageResponseTime: 0,
        successRate: 0,
        activeConnections: 0,
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        avgThroughput: 0
      },
      qpsHistory: [
        { time: "16:30", qps: 0, timestamp: Date.now() - 300000, responseTime: 0, errorRate: 0 },
        { time: "16:31", qps: 0, timestamp: Date.now() - 240000, responseTime: 0, errorRate: 0 },
      ],
      executionLogs: [
        {
          id: "1",
          taskId: taskId,
          timestamp: "2024-01-14 16:30:00",
          level: "info",
          message: "任务创建完成",
          details: "攻击任务已创建，等待手动启动",
          component: "system",
          executionTime: 125,
          responseCode: 200
        },
        {
          id: "2", 
          taskId: taskId,
          attackCaseId: "1",
          timestamp: "2024-01-14 16:30:15",
          level: "info",
          message: "载入攻击用例配置",
          details: "成功载入2个攻击用例：钓鱼邮件测试 - 财务部门, 恶意链接测试 - 内部系统",
          component: "system",
          executionTime: 45
        },
        {
          id: "3",
          taskId: taskId,
          attackCaseId: "1",
          timestamp: "2024-01-14 16:31:00",
          level: "info",
          message: "开始执行攻击用例：钓鱼邮件测试 - 财务部门",
          details: "目标用户数量：25，预计QPS：5",
          component: "api",
          executionTime: 120,
          responseCode: 200
        },
        {
          id: "4",
          taskId: taskId,
          attackCaseId: "1",
          timestamp: "2024-01-14 16:31:05",
          level: "success",
          message: "消息发送成功",
          details: "向用户 user_001 发送钓鱼邮件成功",
          component: "api",
          executionTime: 850,
          responseCode: 200,
          targetUserId: "user_001",
          requestData: '{"message": "财务系统升级通知", "targetUser": "user_001"}',
          responseData: '{"status": "success", "messageId": "msg_123"}'
        },
        {
          id: "5",
          taskId: taskId,
          attackCaseId: "2",
          timestamp: "2024-01-14 16:32:00",
          level: "info",
          message: "开始执行攻击用例：恶意链接测试 - 内部系统",
          details: "目标用户数量：20，预计QPS：3",
          component: "api",
          executionTime: 95,
          responseCode: 200
        },
        {
          id: "6",
          taskId: taskId,
          attackCaseId: "2",
          timestamp: "2024-01-14 16:32:10",
          level: "warning",
          message: "部分用户响应异常",
          details: "用户 user_015 未响应恶意链接点击",
          component: "network",
          executionTime: 1200,
          responseCode: 408,
          targetUserId: "user_015"
        }
      ],
      backendLogs: [
        {
          id: "bl1",
          taskId: taskId,
          timestamp: "2024-01-14 16:30:00",
          source: "api_server",
          level: "info",
          message: "Task created successfully",
          context: { taskId: taskId, attackCases: 2 },
          requestId: "req-123-456"
        },
        {
          id: "bl2",
          taskId: taskId, 
          timestamp: "2024-01-14 16:30:15",
          source: "auth_service",
          level: "info",
          message: "Account verification completed",
          context: { verifiedAccounts: 45 },
          duration: 1200
        }
      ]
    }
    
    setTaskDetails(mockTaskDetails)
  }, [taskId])

  // 实时数据刷新
  useEffect(() => {
    if (taskDetails?.status === "running") {
      const interval = setInterval(() => {
        const now = new Date()
        const timeStr = now.toLocaleTimeString('zh-CN')
        const timestamp = now.getTime()
        
        setTaskDetails(prev => {
          if (!prev) return null
          
          // 模拟实时数据更新
          const newProgress = Math.min(prev.progress + Math.random() * 5, 100)
          const newSuccessful = prev.successfulAttacks + (Math.random() > 0.7 ? 1 : 0)
          const newFailed = prev.failedAttacks + (Math.random() > 0.9 ? 1 : 0)
          const newQPS = 2 + Math.random() * 2
          const totalRequests = (prev.realTimeStats?.totalRequests || 0) + Math.floor(Math.random() * 5)
          const successfulRequests = (prev.realTimeStats?.successfulRequests || 0) + Math.floor(Math.random() * 4)
          
          const newRealTimeStats = {
            currentQPS: newQPS,
            averageResponseTime: 700 + Math.random() * 300,
            successRate: totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0,
            activeConnections: 5 + Math.floor(Math.random() * 10),
            totalRequests: totalRequests,
            successfulRequests: successfulRequests,
            failedRequests: totalRequests - successfulRequests,
            avgThroughput: newQPS * 60
          }

          // 更新QPS历史数据
          const newQpsPoint = {
            time: timeStr.slice(0, 5), // HH:MM格式
            qps: newQPS,
            timestamp: timestamp,
            responseTime: newRealTimeStats.averageResponseTime,
            errorRate: 100 - newRealTimeStats.successRate
          }
          
          return {
            ...prev,
            progress: newProgress,
            successfulAttacks: newSuccessful,
            failedAttacks: newFailed,
            realTimeStats: newRealTimeStats,
            qpsHistory: [...(prev.qpsHistory || []), newQpsPoint].slice(-50)
          }
        })
      }, 2000)
      
      setRefreshInterval(interval)
      return () => clearInterval(interval)
    }
  }, [taskDetails?.status])

  // 按攻击用例分组执行日志
  const groupLogsByAttackCase = () => {
    if (!taskDetails?.executionLogs) return {}
    
    const grouped: Record<string, TaskExecutionLog[]> = {}
    
    taskDetails.executionLogs.forEach(log => {
      const caseId = log.attackCaseId || 'system'
      if (!grouped[caseId]) {
        grouped[caseId] = []
      }
      grouped[caseId].push(log)
    })
    
    return grouped
  }

  // 获取攻击用例名称
  const getAttackCaseName = (caseId: string) => {
    if (caseId === 'system') return '系统日志'
    const index = parseInt(caseId) - 1
    return taskDetails?.attackCases[index] || `攻击用例 ${caseId}`
  }

  // 计算用例统计信息
  const getCaseStats = (logs: TaskExecutionLog[]) => {
    const total = logs.length
    const errors = logs.filter(log => log.level === 'error').length
    const warnings = logs.filter(log => log.level === 'warning').length
    const successes = logs.filter(log => log.level === 'success').length
    const avgExecutionTime = logs
      .filter(log => log.executionTime)
      .reduce((sum, log) => sum + (log.executionTime || 0), 0) / 
      logs.filter(log => log.executionTime).length || 0

    return { total, errors, warnings, successes, avgExecutionTime }
  }

  // 切换用例展开状态
  const toggleCaseExpansion = (caseId: string) => {
    const newExpanded = new Set(expandedCases)
    if (newExpanded.has(caseId)) {
      newExpanded.delete(caseId)
    } else {
      newExpanded.add(caseId)
    }
    setExpandedCases(newExpanded)
  }

  const handleTaskControl = (action: "start" | "pause" | "stop") => {
    if (!taskDetails) return
    
    let newStatus: TaskDetails["status"] = taskDetails.status
    let updatedDetails = {...taskDetails}
    
    switch (action) {
      case "start":
        newStatus = "running"
        // 设置任务开始时间
        updatedDetails.startTime = new Date().toLocaleString('zh-CN')
        // 添加开始执行的日志
        const startLog: LogEntry = {
          id: (taskDetails.executionLogs.length + 1).toString(),
          timestamp: new Date().toLocaleString('zh-CN'),
          level: "info",
          message: "任务开始执行",
          details: `开始执行攻击用例，总计 ${taskDetails.attackCases.length} 个用例`
        }
        updatedDetails.executionLogs = [startLog, ...taskDetails.executionLogs]
        break
      case "pause":
        newStatus = "paused"
        // 添加暂停日志
        const pauseLog: LogEntry = {
          id: (taskDetails.executionLogs.length + 1).toString(),
          timestamp: new Date().toLocaleString('zh-CN'),
          level: "warning",
          message: "任务执行暂停",
          details: "用户手动暂停了任务执行"
        }
        updatedDetails.executionLogs = [pauseLog, ...taskDetails.executionLogs]
        break
      case "stop":
        newStatus = "completed"
        // 设置结束时间
        updatedDetails.endTime = new Date().toLocaleString('zh-CN')
        // 添加停止日志
        const stopLog: LogEntry = {
          id: (taskDetails.executionLogs.length + 1).toString(),
          timestamp: new Date().toLocaleString('zh-CN'),
          level: "info",
          message: "任务执行完成",
          details: "用户手动停止了任务执行"
        }
        updatedDetails.executionLogs = [stopLog, ...taskDetails.executionLogs]
        break
    }
    
    updatedDetails.status = newStatus
    setTaskDetails(updatedDetails)
  }

  const getStatusBadge = (status: TaskDetails["status"]) => {
    const variants = {
      pending: { variant: "secondary", icon: Clock, text: "待执行" },
      running: { variant: "default", icon: Activity, text: "运行中" },
      paused: { variant: "outline", icon: Pause, text: "暂停" },
      completed: { variant: "default", icon: CheckCircle, text: "已完成" },
      failed: { variant: "destructive", icon: AlertTriangle, text: "失败" }
    } as const
    
    const config = variants[status]
    const IconComponent = config.icon
    
    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {config.text}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: TaskDetails["priority"]) => {
    const variants = {
      low: { variant: "secondary", text: "低" },
      medium: { variant: "outline", text: "中" }, 
      high: { variant: "destructive", text: "高" }
    } as const
    
    const config = variants[priority]
    return <Badge variant={config.variant as any}>{config.text}</Badge>
  }

  const getLogLevelBadge = (level: LogEntry["level"]) => {
    const variants = {
      info: { variant: "secondary", icon: Eye },
      warning: { variant: "outline", icon: AlertTriangle },
      error: { variant: "destructive", icon: AlertTriangle },
      success: { variant: "default", icon: CheckCircle }
    } as const
    
    const config = variants[level]
    const IconComponent = config.icon
    
    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {level.toUpperCase()}
      </Badge>
    )
  }

  if (!taskDetails) {
    return <div className="flex items-center justify-center h-64">加载中...</div>
  }

  return (
    <div className="space-y-6 min-w-[1200px]">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回任务列表</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{taskDetails.name}</h1>
            <p className="text-muted-foreground mt-2">{taskDetails.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="bg-transparent"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新
          </Button>
          <Button variant="outline" className="bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            导出日志
          </Button>
        </div>
      </div>

      {/* 任务状态概览 */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">任务状态</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getStatusBadge(taskDetails.status)}
              <p className="text-xs text-muted-foreground">
                优先级: {getPriorityBadge(taskDetails.priority)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">执行进度</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskDetails.progress.toFixed(1)}%</div>
            <Progress value={taskDetails.progress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {taskDetails.successfulAttacks + taskDetails.failedAttacks} / {taskDetails.totalTargets} 目标
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">成功率</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {taskDetails.totalTargets > 0 && (taskDetails.successfulAttacks + taskDetails.failedAttacks) > 0
                ? ((taskDetails.successfulAttacks / (taskDetails.successfulAttacks + taskDetails.failedAttacks)) * 100).toFixed(1)
                : "0.0"
              }%
            </div>
            <p className="text-xs text-muted-foreground">
              成功 {taskDetails.successfulAttacks} / 失败 {taskDetails.failedAttacks}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">当前QPS</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskDetails.realTimeStats.currentQPS.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              活跃连接: {taskDetails.realTimeStats.activeConnections}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 任务控制 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>任务控制</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            {taskDetails.status === "running" ? (
              <>
                <Button
                  onClick={() => handleTaskControl("pause")}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  <Pause className="mr-2 h-4 w-4" />
                  暂停任务
                </Button>
                <Button
                  onClick={() => handleTaskControl("stop")}
                  variant="destructive"
                >
                  <Square className="mr-2 h-4 w-4" />
                  停止任务
                </Button>
              </>
            ) : (
              <Button
                onClick={() => handleTaskControl("start")}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="mr-2 h-4 w-4" />
                开始/恢复任务
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 详细信息标签页 */}
      <Tabs defaultValue="realtime" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 h-12 bg-muted p-1 rounded-lg">
          <TabsTrigger value="realtime" className="text-sm">实时监控</TabsTrigger>
          <TabsTrigger value="execution-logs" className="text-sm">执行日志</TabsTrigger>
          <TabsTrigger value="qps-stats" className="text-sm">QPS统计</TabsTrigger>
          <TabsTrigger value="backend-logs" className="text-sm">后端日志</TabsTrigger>
          <TabsTrigger value="settings" className="text-sm">任务设置</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime">
          <div className="space-y-6">
            {/* QPS时间图表 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>QPS 实时监控</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  {taskDetails.qpsHistory && taskDetails.qpsHistory.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={taskDetails.qpsHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="time" 
                          tick={{ fontSize: 12 }}
                          interval="preserveStartEnd"
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          domain={['dataMin - 0.5', 'dataMax + 0.5']}
                        />
                        <Tooltip 
                          labelStyle={{ color: '#000' }}
                          contentStyle={{ 
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                          }}
                          formatter={(value: number) => [value.toFixed(2), 'QPS']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="qps" 
                          stroke="#2563eb" 
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">等待任务启动</p>
                        <p className="text-sm">启动任务后将显示QPS实时数据图表</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 攻击用例状态 */}
            <Card>
              <CardHeader>
                <CardTitle>攻击用例状态</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {taskDetails.attackCases.map((caseName, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{caseName}</span>
                      <Badge 
                        variant={taskDetails.status === "running" ? "default" : "secondary"} 
                        className="text-xs"
                      >
                        {taskDetails.status === "running" ? "运行中" : 
                         taskDetails.status === "paused" ? "已暂停" : 
                         taskDetails.status === "completed" ? "已完成" : "待执行"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="execution-logs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>按用例分组的执行日志</span>
              </CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  导出日志
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  刷新
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 日志过滤器 */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">级别:</label>
                    <select className="px-3 py-1 text-sm border rounded">
                      <option value="all">全部</option>
                      <option value="info">信息</option>
                      <option value="warning">警告</option>
                      <option value="error">错误</option>
                      <option value="success">成功</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">组件:</label>
                    <select className="px-3 py-1 text-sm border rounded">
                      <option value="all">全部</option>
                      <option value="qps">QPS</option>
                      <option value="api">API</option>
                      <option value="auth">认证</option>
                      <option value="network">网络</option>
                      <option value="system">系统</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const allCaseIds = Object.keys(groupLogsByAttackCase())
                        if (expandedCases.size === allCaseIds.length) {
                          setExpandedCases(new Set())
                        } else {
                          setExpandedCases(new Set(allCaseIds))
                        }
                      }}
                    >
                      {expandedCases.size === Object.keys(groupLogsByAttackCase()).length ? '全部收起' : '全部展开'}
                    </Button>
                  </div>
                </div>

                {/* 按攻击用例分组的执行日志 */}
                <div className="space-y-4">
                  {Object.entries(groupLogsByAttackCase()).map(([caseId, logs]) => {
                    const isExpanded = expandedCases.has(caseId)
                    const stats = getCaseStats(logs)
                    const caseName = getAttackCaseName(caseId)
                    
                    return (
                      <div key={caseId} className="border rounded-lg">
                        <Collapsible>
                          <CollapsibleTrigger asChild>
                            <div 
                              className="w-full p-4 bg-muted/50 hover:bg-muted cursor-pointer flex items-center justify-between transition-colors"
                              onClick={() => toggleCaseExpansion(caseId)}
                            >
                              <div className="flex items-center space-x-3">
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                                <div>
                                  <h4 className="font-medium">{caseName}</h4>
                                  <div className="flex items-center space-x-4 mt-1">
                                    <div className="text-sm text-muted-foreground">
                                      共 {stats.total} 条日志
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      {stats.successes > 0 && (
                                        <Badge variant="default" className="text-xs">
                                          {stats.successes} 成功
                                        </Badge>
                                      )}
                                      {stats.warnings > 0 && (
                                        <Badge variant="outline" className="text-xs">
                                          {stats.warnings} 警告
                                        </Badge>
                                      )}
                                      {stats.errors > 0 && (
                                        <Badge variant="destructive" className="text-xs">
                                          {stats.errors} 错误
                                        </Badge>
                                      )}
                                    </div>
                                    {stats.avgExecutionTime > 0 && (
                                      <div className="text-sm text-muted-foreground">
                                        平均耗时: {stats.avgExecutionTime.toFixed(0)}ms
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge 
                                  variant={stats.errors > 0 ? "destructive" : stats.warnings > 0 ? "outline" : "default"}
                                  className="text-xs"
                                >
                                  {stats.errors > 0 ? "有错误" : stats.warnings > 0 ? "有警告" : "正常"}
                                </Badge>
                              </div>
                            </div>
                          </CollapsibleTrigger>
                          
                          {isExpanded && (
                            <CollapsibleContent>
                              <div className="border-t">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="w-[150px]">时间</TableHead>
                                      <TableHead className="w-[80px]">级别</TableHead>
                                      <TableHead className="w-[100px]">组件</TableHead>
                                      <TableHead>消息</TableHead>
                                      <TableHead className="w-[100px]">执行时间</TableHead>
                                      <TableHead className="w-[80px]">响应码</TableHead>
                                      <TableHead className="w-[80px]">操作</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {logs.map((log) => (
                                      <TableRow key={log.id}>
                                        <TableCell className="font-mono text-xs">
                                          {log.timestamp}
                                        </TableCell>
                                        <TableCell>
                                          <Badge variant={
                                            log.level === "error" ? "destructive" :
                                            log.level === "warning" ? "outline" :
                                            log.level === "success" ? "default" : "secondary"
                                          }>
                                            {log.level}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm">{log.component}</TableCell>
                                        <TableCell className="text-sm">
                                          <div>
                                            <div className="font-medium">{log.message}</div>
                                            {log.details && (
                                              <div className="text-muted-foreground text-xs mt-1">
                                                {log.details}
                                              </div>
                                            )}
                                            {log.targetUserId && (
                                              <div className="text-blue-600 text-xs mt-1">
                                                目标用户: {log.targetUserId}
                                              </div>
                                            )}
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                          {log.executionTime ? `${log.executionTime}ms` : '-'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                          {log.responseCode && (
                                            <Badge variant={log.responseCode < 400 ? "default" : "destructive"}>
                                              {log.responseCode}
                                            </Badge>
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          <Button variant="ghost" size="sm">
                                            <Eye className="h-4 w-4" />
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </CollapsibleContent>
                          )}
                        </Collapsible>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qps-stats">
          <div className="space-y-6">
            {/* QPS统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="flex items-center p-4">
                  <Zap className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">当前QPS</p>
                    <p className="text-xl font-bold">{taskDetails.realTimeStats?.currentQPS.toFixed(1)}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center p-4">
                  <Clock className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">平均响应时间</p>
                    <p className="text-xl font-bold">{taskDetails.realTimeStats?.averageResponseTime.toFixed(0)}ms</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center p-4">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">成功率</p>
                    <p className="text-xl font-bold">{taskDetails.realTimeStats?.successRate.toFixed(1)}%</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center p-4">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">总请求数</p>
                    <p className="text-xl font-bold">{taskDetails.realTimeStats?.totalRequests}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* QPS历史图表 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>QPS历史趋势</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  {taskDetails.qpsHistory && taskDetails.qpsHistory.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={taskDetails.qpsHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="time" 
                          tick={{ fontSize: 12 }}
                          interval="preserveStartEnd"
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          domain={['dataMin - 0.5', 'dataMax + 0.5']}
                        />
                        <Tooltip 
                          labelStyle={{ color: '#000' }}
                          contentStyle={{ 
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                          }}
                          formatter={(value: number, name: string) => [
                            name === 'qps' ? value.toFixed(2) : 
                            name === 'responseTime' ? `${value.toFixed(0)}ms` :
                            name === 'errorRate' ? `${value.toFixed(1)}%` : value,
                            name === 'qps' ? 'QPS' :
                            name === 'responseTime' ? '响应时间' :
                            name === 'errorRate' ? '错误率' : name
                          ]}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="qps" 
                          stroke="#2563eb" 
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="responseTime" 
                          stroke="#16a34a" 
                          strokeWidth={2}
                          dot={false}
                          yAxisId="right"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">暂无QPS数据</p>
                        <p className="text-sm">启动任务后将记录QPS统计信息</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="backend-logs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Server className="h-5 w-5" />
                <span>后端服务日志</span>
              </CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  导出日志
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  刷新
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 日志过滤器 */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">服务:</label>
                    <select className="px-3 py-1 text-sm border rounded">
                      <option value="all">全部</option>
                      <option value="api_server">API服务器</option>
                      <option value="auth_service">认证服务</option>
                      <option value="database">数据库</option>
                      <option value="cache">缓存</option>
                      <option value="queue">队列</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">级别:</label>
                    <select className="px-3 py-1 text-sm border rounded">
                      <option value="all">全部</option>
                      <option value="debug">调试</option>
                      <option value="info">信息</option>
                      <option value="warn">警告</option>
                      <option value="error">错误</option>
                    </select>
                  </div>
                </div>

                {/* 后端日志表格 */}
                <div className="overflow-hidden rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">时间</TableHead>
                        <TableHead className="w-[100px]">服务</TableHead>
                        <TableHead className="w-[80px]">级别</TableHead>
                        <TableHead>消息</TableHead>
                        <TableHead className="w-[100px]">请求ID</TableHead>
                        <TableHead className="w-[80px]">耗时</TableHead>
                        <TableHead className="w-[80px]">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {taskDetails.backendLogs?.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-xs">
                            {log.timestamp}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {log.source}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              log.level === "error" || log.level === "fatal" ? "destructive" :
                              log.level === "warn" ? "outline" :
                              log.level === "info" ? "default" : "secondary"
                            }>
                              {log.level}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            <div>
                              <div className="font-medium">{log.message}</div>
                              {log.context && (
                                <div className="text-muted-foreground text-xs mt-1 font-mono">
                                  {JSON.stringify(log.context, null, 2)}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs font-mono">
                            {log.requestId}
                          </TableCell>
                          <TableCell className="text-sm">
                            {log.duration ? `${log.duration}ms` : '-'}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>执行日志</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>时间</TableHead>
                      <TableHead>级别</TableHead>
                      <TableHead>用例</TableHead>
                      <TableHead>消息</TableHead>
                      <TableHead>详情</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taskDetails.executionLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                        <TableCell>{getLogLevelBadge(log.level)}</TableCell>
                        <TableCell className="text-sm">{log.attackCase || "-"}</TableCell>
                        <TableCell className="text-sm">{log.message}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-md truncate">
                          {log.details}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>任务设置信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">任务ID</label>
                    <p className="text-sm font-mono">{taskDetails.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">创建者</label>
                    <p className="text-sm">{taskDetails.createdBy}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">创建时间</label>
                    <p className="text-sm">{taskDetails.createdAt}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">开始时间</label>
                    <p className="text-sm">{taskDetails.startTime}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">目标总数</label>
                    <p className="text-sm">{taskDetails.totalTargets}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">攻击用例</label>
                    <div className="space-y-1">
                      {taskDetails.attackCases.map((caseName, index) => (
                        <p key={index} className="text-sm bg-muted p-1 rounded">{caseName}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}