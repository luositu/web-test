import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"
import type { ApiResponse } from "@/lib/types"

export async function GET(): Promise<NextResponse<ApiResponse<string[]>>> {
  try {
    const groups = dataStore.getAccountGroups()
    return NextResponse.json({
      success: true,
      data: groups,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "获取账号组列表失败",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const body = await request.json()
    const { groupName } = body

    if (!groupName) {
      return NextResponse.json(
        {
          success: false,
          error: "缺少组名",
        },
        { status: 400 },
      )
    }

    const success = dataStore.createAccountGroup(groupName)

    if (success) {
      return NextResponse.json({
        success: true,
        data: null,
        message: "账号组创建成功",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "账号组已存在",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "创建账号组失败",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const body = await request.json()
    const { groupName } = body

    if (!groupName) {
      return NextResponse.json(
        {
          success: false,
          error: "缺少组名",
        },
        { status: 400 },
      )
    }

    const success = dataStore.deleteAccountGroup(groupName)

    if (success) {
      return NextResponse.json({
        success: true,
        data: null,
        message: "账号组删除成功",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "无法删除该账号组",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "删除账号组失败",
      },
      { status: 500 },
    )
  }
}
