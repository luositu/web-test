import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"
import type { ApiResponse, LogEntry } from "@/lib/types"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<LogEntry[]>>> {
  try {
    const logs = dataStore.getLogs(params.id)
    return NextResponse.json({
      success: true,
      data: logs,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "获取任务日志失败",
      },
      { status: 500 },
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<LogEntry>>> {
  try {
    const body = await request.json()
    const { level, message, details } = body

    if (!level || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "缺少必要字段",
        },
        { status: 400 },
      )
    }

    const newLog = dataStore.createLog({
      taskId: params.id,
      level,
      message,
      details,
    })

    return NextResponse.json({
      success: true,
      data: newLog,
      message: "日志记录成功",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "记录日志失败",
      },
      { status: 500 },
    )
  }
}
