import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"
import type { ApiResponse, Account } from "@/lib/types"

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<Account[]>>> {
  try {
    const { searchParams } = new URL(request.url)
    const group = searchParams.get("group")

    let accounts: Account[]
    if (group) {
      accounts = dataStore.getAccountsByGroup(group)
    } else {
      accounts = dataStore.getAccounts()
    }

    return NextResponse.json({
      success: true,
      data: accounts,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "获取账号列表失败",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Account>>> {
  try {
    const body = await request.json()
    const { uid, sixin_st, salt, did, group } = body

    if (!uid || !sixin_st || !salt || !did) {
      return NextResponse.json(
        {
          success: false,
          error: "缺少必要字段：uid、sixin_st、salt、did",
        },
        { status: 400 },
      )
    }

    const newAccount = dataStore.createAccount({
      uid,
      sixin_st,
      salt,
      did,
      group: group || "默认组",
    })

    return NextResponse.json({
      success: true,
      data: newAccount,
      message: "账号创建成功",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "创建账号失败",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const body = await request.json()
    const { ids } = body

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json(
        {
          success: false,
          error: "缺少账号ID列表",
        },
        { status: 400 },
      )
    }

    const success = dataStore.deleteAccounts(ids)

    if (success) {
      return NextResponse.json({
        success: true,
        data: null,
        message: "批量删除成功",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "删除失败",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "批量删除失败",
      },
      { status: 500 },
    )
  }
}
