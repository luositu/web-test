"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Settings,
  Play,
  Pause,
  Square,
  Eye,
  Trash2,
  Copy,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity,
  FileText,
  Target,
  BarChart3,
  Download,
  RefreshCw,
} from "lucide-react"

interface Task {
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
}

interface AttackCase {
  id: string
  name: string
  type: string
  status: "draft" | "active" | "paused" | "completed" | "待执行"
  targetCount: number
  successRate: number
  createdAt: string
  lastExecuted: string
  senderGroup: string
  senderAccounts: string[]
  receiverGroup: string
  receiverAccounts: string[]
  attackCount: number
  qps: number
}

interface LogEntry {
  id: string
  taskId: string
  timestamp: string
  level: "info" | "warning" | "error" | "success"
  message: string
  details?: string
}

export function TaskManagement() {
  // 模拟攻击用例数据 - 实际应该从攻击用例管理组件或API获取
  const [attackCases] = useState<AttackCase[]>([
    {
      id: "1",
      name: "钓鱼邮件测试 - 财务部门",
      type: "私聊文本",
      status: "active",
      targetCount: 45,
      successRate: 23.5,
      createdAt: "2024-01-10",
      lastExecuted: "2024-01-15 14:30",
      senderGroup: "测试组A",
      senderAccounts: ["1", "2"],
      receiverGroup: "",
      receiverAccounts: [],
      attackCount: 1,
      qps: 60,
    },
    {
      id: "2", 
      name: "社交工程攻击 - LinkedIn",
      type: "群聊文本",
      status: "paused",
      targetCount: 28,
      successRate: 18.2,
      createdAt: "2024-01-12",
      lastExecuted: "2024-01-14 09:15",
      senderGroup: "测试组B",
      senderAccounts: [],
      receiverGroup: "",
      receiverAccounts: [],
      attackCount: 1,
      qps: 60,
    },
    {
      id: "3",
      name: "恶意链接测试 - 内部系统",
      type: "私聊图片", 
      status: "completed",
      targetCount: 67,
      successRate: 31.8,
      createdAt: "2024-01-08",
      lastExecuted: "2024-01-13 16:45",
      senderGroup: "测试组C",
      senderAccounts: [],
      receiverGroup: "",
      receiverAccounts: [],
      attackCount: 1,
      qps: 60,
    },
    {
      id: "4",
      name: "点赞攻击测试 - 营销部门", 
      type: "点赞",
      status: "active",
      targetCount: 32,
      successRate: 28.1,
      createdAt: "2024-01-11",
      lastExecuted: "2024-01-16 10:20",
      senderGroup: "测试组A",
      senderAccounts: ["1", "2"],
      receiverGroup: "",
      receiverAccounts: [],
      attackCount: 1,
      qps: 60,
    },
    {
      id: "5",
      name: "评论攻击测试",
      type: "评论",
      status: "draft",
      targetCount: 15,
      successRate: 0,
      createdAt: "2024-01-13",
      lastExecuted: "未执行",
      senderGroup: "测试组B",
      senderAccounts: [],
      receiverGroup: "",
      receiverAccounts: [],
      attackCount: 1,
      qps: 60,
    },
    {
      id: "6",
      name: "账号登录测试",
      type: "登录",
      status: "active",
      targetCount: 58,
      successRate: 35.2,
      createdAt: "2024-01-09",
      lastExecuted: "2024-01-15 16:30",
      senderGroup: "测试组C",
      senderAccounts: [],
      receiverGroup: "",
      receiverAccounts: [],
      attackCount: 1,
      qps: 60,
    },
    {
      id: "7",
      name: "账号注册测试",
      type: "注册",
      status: "paused",
      targetCount: 22,
      successRate: 19.8,
      createdAt: "2024-01-14",
      lastExecuted: "2024-01-16 08:45",
      senderGroup: "测试组A",
      senderAccounts: ["1", "2"],
      receiverGroup: "",
      receiverAccounts: [],
      attackCount: 1,
      qps: 60,
    },
    {
      id: "8",
      name: "关注攻击测试",
      type: "关注",
      status: "completed",
      targetCount: 41,
      successRate: 26.7,
      createdAt: "2024-01-07",
      lastExecuted: "2024-01-12 14:15",
      senderGroup: "测试组B",
      senderAccounts: [],
      receiverGroup: "",
      receiverAccounts: [],
      attackCount: 1,
      qps: 60,
    },
    {
      id: "9",
      name: "私聊个人主页分享",
      type: "私聊发送个人主页",
      status: "active",
      targetCount: 19,
      successRate: 42.1,
      createdAt: "2024-01-15",
      lastExecuted: "2024-01-16 11:30",
      senderGroup: "测试组C", 
      senderAccounts: [],
      receiverGroup: "",
      receiverAccounts: [],
      attackCount: 1,
      qps: 60,
    },
    {
      id: "10",
      name: "群聊创建测试",
      type: "群聊创建",
      status: "draft",
      targetCount: 8,
      successRate: 0,
      createdAt: "2024-01-16",
      lastExecuted: "未执行",
      senderGroup: "测试组A",
      senderAccounts: ["1", "2"],
      receiverGroup: "",
      receiverAccounts: [],
      attackCount: 1,
      qps: 60,
    },
  ])

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      name: "财务部门钓鱼测试计划",
      description: "针对财务部门的综合钓鱼邮件测试",
      status: "running",
      priority: "high",
      attackCases: ["钓鱼邮件测试 - 财务部门", "恶意链接测试"],
      startTime: "2024-01-15 09:00",
      progress: 65,
      createdAt: "2024-01-14",
      createdBy: "管理员",
    },
    {
      id: "2",
      name: "社交工程攻击演练",
      description: "模拟社交工程攻击场景",
      status: "paused",
      priority: "medium",
      attackCases: ["社交工程攻击 - LinkedIn"],
      startTime: "2024-01-14 14:30",
      progress: 40,
      createdAt: "2024-01-13",
      createdBy: "测试员A",
    },
    {
      id: "3",
      name: "全员安全意识测试",
      description: "公司全员安全意识评估",
      status: "completed",
      priority: "high",
      attackCases: ["钓鱼邮件测试", "恶意链接测试", "社交工程攻击"],
      startTime: "2024-01-10 08:00",
      endTime: "2024-01-12 18:00",
      progress: 100,
      createdAt: "2024-01-09",
      createdBy: "安全主管",
    },
  ])

  const [logs, setLogs] = useState<LogEntry[]>([
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
    {
      id: "3",
      taskId: "2",
      timestamp: "2024-01-15 11:45:33",
      level: "warning",
      message: "任务执行暂停",
      details: "用户手动暂停了任务执行",
    },
    {
      id: "4",
      taskId: "3",
      timestamp: "2024-01-12 18:00:00",
      level: "success",
      message: "任务执行完成",
      details: "全员安全意识测试已成功完成",
    },
  ])

  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    priority: "medium" as const,
    attackCases: [] as string[],
    scheduledTime: "",
    autoStart: false,
  })

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "running":
        return <Play className="h-4 w-4 text-green-500" />
      case "paused":
        return <Pause className="h-4 w-4 text-yellow-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "pending":
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: Task["status"]) => {
    const variants = {
      running: "bg-green-500 text-white",
      paused: "bg-yellow-500 text-white",
      completed: "bg-blue-500 text-white",
      failed: "bg-destructive text-destructive-foreground",
      pending: "bg-muted text-muted-foreground",
    }

    const labels = {
      running: "执行中",
      paused: "已暂停",
      completed: "已完成",
      failed: "执行失败",
      pending: "待执行",
    }

    return <Badge className={variants[status]}>{labels[status]}</Badge>
  }

  const getPriorityBadge = (priority: Task["priority"]) => {
    const variants = {
      high: "bg-destructive text-destructive-foreground",
      medium: "bg-accent text-accent-foreground",
      low: "bg-muted text-muted-foreground",
    }

    const labels = {
      high: "高优先级",
      medium: "中优先级",
      low: "低优先级",
    }

    return (
      <Badge variant="outline" className={variants[priority]}>
        {labels[priority]}
      </Badge>
    )
  }

  const getLogLevelIcon = (level: LogEntry["level"]) => {
    switch (level) {
      case "info":
        return <Activity className="h-4 w-4 text-blue-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
    }
  }

  return (
    <div className="space-y-6 min-w-[1200px]">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">任务管理</h2>
          <p className="text-muted-foreground mt-2">创建和管理蓝军演练执行计划</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="bg-transparent">
            <Copy className="mr-2 h-4 w-4" />
            复制计划
          </Button>
          <Button variant="outline" className="bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            导出日志
          </Button>
          <Button className="bg-primary text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" />
            创建任务
          </Button>
        </div>
      </div>

      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-12 bg-muted p-1 rounded-lg">
          <TabsTrigger
            value="tasks"
            className="h-10 px-6 rounded-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-primary/20 transition-all duration-200 hover:bg-muted-foreground/10"
          >
            任务列表
          </TabsTrigger>
          <TabsTrigger
            value="create"
            className="h-10 px-6 rounded-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-primary/20 transition-all duration-200 hover:bg-muted-foreground/10"
          >
            创建计划
          </TabsTrigger>
          <TabsTrigger
            value="monitor"
            className="h-10 px-6 rounded-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-primary/20 transition-all duration-200 hover:bg-muted-foreground/10"
          >
            执行监控
          </TabsTrigger>
          <TabsTrigger
            value="logs"
            className="h-10 px-6 rounded-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-primary/20 transition-all duration-200 hover:bg-muted-foreground/10"
          >
            执行日志
          </TabsTrigger>
        </TabsList>

        {/* 任务列表 */}
        <TabsContent value="tasks" className="space-y-4 min-h-[600px] w-full">
          <div className="grid grid-cols-1 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">总任务数</p>
                    <p className="text-2xl font-bold text-foreground">8</p>
                  </div>
                  <Settings className="h-8 w-8 text-chart-1" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Settings className="mr-2 h-5 w-5" />
                执行任务列表
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>任务名称</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>优先级</TableHead>
                    <TableHead>进度</TableHead>
                    <TableHead>开始时间</TableHead>
                    <TableHead>创建者</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{task.name}</p>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(task.status)}
                          {getStatusBadge(task.status)}
                        </div>
                      </TableCell>
                      <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${task.progress}%` }}></div>
                          </div>
                          <span className="text-sm text-muted-foreground">{task.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{task.startTime}</TableCell>
                      <TableCell className="text-muted-foreground">{task.createdBy}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            {task.status === "running" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Square className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 创建计划 */}
        <TabsContent value="create" className="space-y-4 min-h-[600px] w-full">
          <div className="w-full max-w-none">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <Plus className="mr-2 h-5 w-5" />
                    创建攻击计划
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-name">计划名称</Label>
                    <Input
                      id="task-name"
                      placeholder="输入攻击计划名称"
                      value={newTask.name}
                      onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task-description">计划描述</Label>
                    <Textarea
                      id="task-description"
                      placeholder="描述攻击计划的目标和范围"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">优先级</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择优先级" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">高优先级</SelectItem>
                        <SelectItem value="medium">中优先级</SelectItem>
                        <SelectItem value="low">低优先级</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scheduled-time">计划执行时间</Label>
                    <Input
                      id="scheduled-time"
                      type="datetime-local"
                      value={newTask.scheduledTime}
                      onChange={(e) => setNewTask({ ...newTask, scheduledTime: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auto-start"
                      checked={newTask.autoStart}
                      onCheckedChange={(checked) => setNewTask({ ...newTask, autoStart: checked })}
                    />
                    <Label htmlFor="auto-start">自动启动执行</Label>
                  </div>

                  <Button className="w-full bg-primary text-primary-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    创建计划
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <Target className="mr-2 h-5 w-5" />
                    用例选择
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded" />
                        <div>
                          <p className="font-medium">钓鱼邮件测试 - 财务部门</p>
                          <p className="text-sm text-muted-foreground">邮件钓鱼攻击</p>
                        </div>
                      </div>
                      <Badge variant="outline">邮件</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded" />
                        <div>
                          <p className="font-medium">社交工程攻击 - LinkedIn</p>
                          <p className="text-sm text-muted-foreground">社交媒体攻击</p>
                        </div>
                      </div>
                      <Badge variant="outline">社交</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded" />
                        <div>
                          <p className="font-medium">恶意链接测试 - 内部系统</p>
                          <p className="text-sm text-muted-foreground">Web攻击测试</p>
                        </div>
                      </div>
                      <Badge variant="outline">Web</Badge>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    <Plus className="mr-2 h-4 w-4" />
                    添加更多用例
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* 执行监控 */}
        <TabsContent value="monitor" className="space-y-4 min-h-[600px] w-full">
          <div className="w-full max-w-none">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-foreground">
                      <div className="flex items-center">
                        <Activity className="mr-2 h-5 w-5" />
                        实时监控
                      </div>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        刷新
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tasks
                        .filter((task) => task.status === "running")
                        .map((task) => (
                          <div key={task.id} className="p-4 border border-border rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-foreground">{task.name}</h4>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Pause className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Square className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">执行进度</span>
                                <span className="font-medium">{task.progress}%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${task.progress}%` }}
                                ></div>
                              </div>
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>开始时间: {task.startTime}</span>
                                <span>用例数: {task.attackCases.length}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    执行统计
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-foreground">2</p>
                    <p className="text-sm text-muted-foreground">正在执行的任务</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-foreground">156</p>
                    <p className="text-sm text-muted-foreground">今日执行次数</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-foreground">87%</p>
                    <p className="text-sm text-muted-foreground">平均成功率</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* 执行日志 */}
        <TabsContent value="logs" className="space-y-4 min-h-[600px] w-full">
          <div className="w-full max-w-none">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-foreground">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    执行日志
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部日志</SelectItem>
                        <SelectItem value="info">信息</SelectItem>
                        <SelectItem value="warning">警告</SelectItem>
                        <SelectItem value="error">错误</SelectItem>
                        <SelectItem value="success">成功</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Download className="mr-2 h-4 w-4" />
                      导出
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
                      {getLogLevelIcon(log.level)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground">{log.message}</p>
                          <span className="text-sm text-muted-foreground">{log.timestamp}</span>
                        </div>
                        {log.details && <p className="text-sm text-muted-foreground mt-1">{log.details}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
