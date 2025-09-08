import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"
import type { ApiResponse, Task } from "@/lib/types"

export async function GET(): Promise<NextResponse<ApiResponse<Task[]>>> {
  try {
    const tasks = dataStore.getTasks()
    return NextResponse.json({
      success: true,
      data: tasks,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "获取任务列表失败",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Task>>> {
  try {
    const body = await request.json()
    const { name, description, priority, attackCases, scheduledTime, autoStart } = body

    if (!name || !description) {
      return NextResponse.json(
        {
          success: false,
          error: "缺少必要字段",
        },
        { status: 400 },
      )
    }

    const newTask = dataStore.createTask({
      name,
      description,
      status: "pending",
      priority: priority || "medium",
      attackCases: attackCases || [],
      startTime: scheduledTime || new Date().toISOString(),
      progress: 0,
      createdBy: "当前用户",
      scheduledTime,
      autoStart: autoStart || false,
    })

    return NextResponse.json({
      success: true,
      data: newTask,
      message: "任务创建成功",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "创建任务失败",
      },
      { status: 500 },
    )
  }
}
