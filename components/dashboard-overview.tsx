import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Settings, Activity, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react"

export function DashboardOverview() {
  const stats = [
    {
      title: "活跃账号",
      value: "24",
      change: "+12%",
      icon: Users,
      color: "text-chart-1",
    },
    {
      title: "攻击用例",
      value: "156",
      change: "+8%",
      icon: Target,
      color: "text-chart-2",
    },
    {
      title: "执行任务",
      value: "8",
      change: "+3",
      icon: Activity,
      color: "text-chart-3",
    },
    {
      title: "成功率",
      value: "87%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-chart-4",
    },
  ]

  const recentTasks = [
    {
      id: 1,
      name: "邮件钓鱼测试",
      status: "running",
      progress: 65,
      startTime: "2024-01-15 14:30",
    },
    {
      id: 2,
      name: "SQL注入检测",
      status: "completed",
      progress: 100,
      startTime: "2024-01-15 10:15",
    },
    {
      id: 3,
      name: "社工攻击模拟",
      status: "pending",
      progress: 0,
      startTime: "2024-01-15 16:00",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">演练概览</h2>
        <p className="text-muted-foreground mt-2">蓝军演练平台实时监控和管理界面</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-accent">{stat.change}</span> 较上周
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">快速操作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90">
              <Target className="mr-2 h-4 w-4" />
              创建新攻击用例
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Users className="mr-2 h-4 w-4" />
              管理测试账号
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Settings className="mr-2 h-4 w-4" />
              配置演练计划
            </Button>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">最近任务</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {task.status === "running" && <Clock className="h-4 w-4 text-accent" />}
                    {task.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {task.status === "pending" && <AlertCircle className="h-4 w-4 text-muted-foreground" />}
                    <div>
                      <p className="font-medium text-foreground">{task.name}</p>
                      <p className="text-sm text-muted-foreground">{task.startTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={task.status === "completed" ? "default" : "secondary"}
                      className={
                        task.status === "running"
                          ? "bg-accent text-accent-foreground"
                          : task.status === "completed"
                            ? "bg-green-500 text-white"
                            : "bg-muted text-muted-foreground"
                      }
                    >
                      {task.status === "running" ? "执行中" : task.status === "completed" ? "已完成" : "待执行"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{task.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
