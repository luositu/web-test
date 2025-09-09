"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Download
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface TaskDetails {
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
  totalTargets: number
  successfulAttacks: number
  failedAttacks: number
  executionLogs: LogEntry[]
  realTimeStats: RealTimeStats
}

interface LogEntry {
  id: string
  timestamp: string
  level: "info" | "warning" | "error" | "success"
  message: string
  details: string
  attackCase?: string
}

interface RealTimeStats {
  currentQPS: number
  averageResponseTime: number
  successRate: number
  activeConnections: number
}

interface QPSDataPoint {
  time: string
  qps: number
  timestamp: number
}

export default function TaskDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.id as string
  
  const [taskDetails, setTaskDetails] = useState<TaskDetails | null>(null)
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)
  const [qpsHistory, setQpsHistory] = useState<QPSDataPoint[]>([])

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
      totalTargets: 45,
      successfulAttacks: 0,
      failedAttacks: 0,
      realTimeStats: {
        currentQPS: 0,
        averageResponseTime: 0,
        successRate: 0,
        activeConnections: 0
      },
      executionLogs: [
        {
          id: "1",
          timestamp: "2024-01-14 16:30:00",
          level: "info",
          message: "任务创建完成",
          details: "攻击任务已创建，等待手动启动",
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
          
          return {
            ...prev,
            progress: newProgress,
            successfulAttacks: newSuccessful,
            failedAttacks: newFailed,
            realTimeStats: {
              ...prev.realTimeStats,
              currentQPS: newQPS,
              averageResponseTime: 700 + Math.random() * 300,
              successRate: newSuccessful / (newSuccessful + newFailed + (prev.totalTargets - newSuccessful - newFailed)) * 100,
              activeConnections: 5 + Math.floor(Math.random() * 10)
            }
          }
        })

        // 更新QPS历史数据
        setQpsHistory(prev => {
          const newData = [...prev, { time: timeStr, qps: 2 + Math.random() * 2, timestamp }]
          // 只保留最近50个数据点
          return newData.slice(-50)
        })
      }, 2000)
      
      setRefreshInterval(interval)
      return () => clearInterval(interval)
    } else {
      // 任务不运行时清空QPS历史数据
      if (taskDetails?.status === "pending") {
        setQpsHistory([])
      }
    }
  }, [taskDetails?.status])

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
        <TabsList className="grid w-full grid-cols-3 h-12 bg-muted p-1 rounded-lg">
          <TabsTrigger value="realtime" className="text-sm">实时监控</TabsTrigger>
          <TabsTrigger value="logs" className="text-sm">执行日志</TabsTrigger>
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
                  {qpsHistory.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={qpsHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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

            {/* 性能指标和状态 */}
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>实时性能指标</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">当前QPS:</span>
                      <span className="text-lg font-bold">{taskDetails.realTimeStats.currentQPS.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">平均响应时间:</span>
                      <span className="text-lg font-bold">{taskDetails.realTimeStats.averageResponseTime.toFixed(0)}ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">活跃连接数:</span>
                      <span className="text-lg font-bold">{taskDetails.realTimeStats.activeConnections}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
          </div>
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