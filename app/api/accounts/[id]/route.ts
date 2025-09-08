import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"
import type { ApiResponse, Account } from "@/lib/types"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<Account>>> {
  try {
    const account = dataStore.getAccount(params.id)
    if (!account) {
      return NextResponse.json(
        {
          success: false,
          error: "账号不存在",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: account,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "获取账号信息失败",
      },
      { status: 500 },
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<Account>>> {
  try {
    const body = await request.json()
    const updatedAccount = dataStore.updateAccount(params.id, body)

    if (!updatedAccount) {
      return NextResponse.json(
        {
          success: false,
          error: "账号不存在",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedAccount,
      message: "账号更新成功",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "更新账号失败",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const deleted = dataStore.deleteAccount(params.id)
    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "账号不存在",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "账号删除成功",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "删除账号失败",
      },
      { status: 500 },
    )
  }
}
