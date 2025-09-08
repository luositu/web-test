import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"
import type { ApiResponse, AttackCase } from "@/lib/types"

export async function GET(): Promise<NextResponse<ApiResponse<AttackCase[]>>> {
  try {
    const attackCases = dataStore.getAttackCases()
    return NextResponse.json({
      success: true,
      data: attackCases,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "获取攻击用例列表失败",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<AttackCase>>> {
  try {
    const body = await request.json()
    const { name, type, description, targetAccounts, messageTemplate, attackCount, interval } = body

    if (!name || !type || !description) {
      return NextResponse.json(
        {
          success: false,
          error: "缺少必要字段",
        },
        { status: 400 },
      )
    }

    const newAttackCase = dataStore.createAttackCase({
      name,
      type,
      description,
      status: "draft",
      targetAccounts: targetAccounts || [],
      messageTemplate: messageTemplate || "",
      attackCount: attackCount || 1,
      interval: interval || 60,
      targetCount: 0,
      successRate: 0,
      createdBy: "当前用户",
    })

    return NextResponse.json({
      success: true,
      data: newAttackCase,
      message: "攻击用例创建成功",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "创建攻击用例失败",
      },
      { status: 500 },
    )
  }
}
