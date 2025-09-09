"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { dataStore } from "@/lib/data-store"
import type { AttackCase as GlobalAttackCase } from "@/lib/types"
import {
  Plus,
  Target,
  Mail,
  MessageSquare,
  Users,
  Zap,
  DollarSign,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  Upload,
  Mic,
  Video,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 使用全局类型定义
type AttackCase = GlobalAttackCase & {
  status: "draft" | "active" | "paused" | "completed" | "待执行" | "pending"
  targetCount?: number
  successRate?: number
  lastExecuted?: string
}

interface AccountGroup {
  id: string
  name: string
  description: string
  accountCount: number
  accounts: Account[]
  createdAt: string
}

interface Account {
  id: string
  uid: string
  sixin_st: string
  salt: string
  did: string
  groupId: string
}

const attackCategories = [
  {
    name: "社交互动",
    icon: <Users className="h-4 w-4" />,
    types: [
      { name: "点赞", command: "Social.Like" },
      { name: "评论", command: "Social.Comment" },
      { name: "关注", command: "Social.Follow" },
      { name: "访问主页", command: "Social.Visit" },
    ],
  },
  {
    name: "账号",
    icon: <Target className="h-4 w-4" />,
    types: [
      { name: "登录", command: "Account.Login" },
      { name: "注册", command: "Account.Register" },
    ],
  },
  {
    name: "私信服务",
    icon: <MessageSquare className="h-4 w-4" />,
    types: [
      { name: "私聊文本", command: "Message.Send" },
      { name: "私聊图片", command: "Message.Send" },
      { name: "私聊卡片", command: "Message.Forward" },
      { name: "私聊表情", command: "Message.Send" },
      { name: "私聊语音", command: "Message.Send" },
      { name: "私聊视频", command: "Message.Send" },
      { name: "私聊转发站内作品", command: "Message.Send" },
      { name: "私聊发送个人主页", command: "Message.Send" },
      { name: "私聊回复在干嘛", command: "Message.Send" },
      { name: "群聊文本", command: "Message.Group.Send" },
      { name: "群聊图片", command: "Message.Group.Send" },
      { name: "群聊卡片", command: "Message.Group.Forward" },
      { name: "群聊表情", command: "Message.Group.Send" },
      { name: "群聊语音", command: "Message.Group.Send" },
      { name: "群聊视频", command: "Message.Group.Send" },
      { name: "群聊发送个人主页", command: "Message.Group.Send" },
      { name: "群聊创建", command: "Message.Group.Create" },
      { name: "群聊设置", command: "Message.Group.Setting" },
      { name: "群聊加入", command: "Message.Group.Join" },
      { name: "回复在干嘛", command: "Message.Group.Send" },
    ],
  },
  {
    name: "商业化激励",
    icon: <DollarSign className="h-4 w-4" />,
    types: [{ name: "广告金币", command: "Commercial.AdCoin" }],
  },
]

export function AttackCaseManagement() {
  // ... existing state variables ...
  const [attackCases, setAttackCases] = useState<AttackCase[]>([])

  // 从全局数据存储加载攻击用例
  useEffect(() => {
    const loadAttackCases = () => {
      const cases = dataStore.getAttackCases()
      setAttackCases(cases)
    }
    loadAttackCases()
  }, [])

  // 旧的本地假数据，现已移除
  /*
    {
      id: "1",
      name: "钓鱼邮件测试 - 财务部门",
      type: "私聊文本",
      status: "active" as const,
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
      status: "paused" as const,
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
      status: "completed" as const,
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
      status: "active" as const,
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
      status: "draft" as const,
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
      status: "active" as const,
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
      accountParams: {
        did: "ANDROID_2d0298105c3618d6",
        deviceModel: "iPhone 15 Pro",
        osVersion: "iOS 17.1",
        appVersion: "8.0.47",
      },
    },
    {
      id: "7",
      name: "账号注册测试",
      type: "注册",
      status: "paused" as const,
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
      accountParams: {
        did: "ANDROID_eeeeeeee000sixln",
        deviceModel: "iPhone 15 Pro",
        osVersion: "iOS 17.1",
        appVersion: "8.0.47",
      },
    },
    {
      id: "8",
      name: "关注攻击测试",
      type: "关注",
      status: "completed" as const,
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
      status: "active" as const,
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
      status: "draft" as const,
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
    {
      id: "11",
      name: "访问主页测试",
      type: "访问主页",
      status: "active" as const,
      targetCount: 35,
      successRate: 31.4,
      createdAt: "2024-01-06",
      lastExecuted: "2024-01-15 13:20",
      senderGroup: "测试组B",
      senderAccounts: [],
      receiverGroup: "",
      receiverAccounts: [],
      attackCount: 1,
      qps: 60,
    },
    {
      id: "12",
      name: "群聊加入测试",
      type: "群聊加入",
      status: "paused" as const,
      targetCount: 12,
      successRate: 16.7,
      createdAt: "2024-01-05",
      lastExecuted: "2024-01-14 12:10",
      senderGroup: "测试组C",
      senderAccounts: [],
      receiverGroup: "",
      receiverAccounts: [],
      attackCount: 1,
      qps: 60,
    },
  */

  // 其他状态变量保持不变
  const [newCase, setNewCase] = useState({
    name: "",
    category: "",
    type: "",
    senderGroup: "",
    senderAccounts: [] as string[],
    receiverGroup: "",
    receiverAccounts: [] as string[],
    attackCount: 1,
    qps: 60,
    accountParams: {
      did: "",
      deviceModel: "",
      osVersion: "",
      appVersion: "",
    },
  })

  const [messageContent, setMessageContent] = useState({
    text: "",
    imageUrl: "",
    cardContent: "",
    cardImageUrl: "",
    cardWebUrl: "",
    voiceUrl: "",
    videoUrl: "",
  })

  const [globalParams, setGlobalParams] = useState({
    qps: "",
    attackCount: "1",
  })

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [showSenderDialog, setShowSenderDialog] = useState(false)
  const [showReceiverDialog, setShowReceiverDialog] = useState(false)
  const [showSenderAccountDialog, setShowSenderAccountDialog] = useState(false)
  const [showReceiverAccountDialog, setShowReceiverAccountDialog] = useState(false)
  const [selectedSenderGroup, setSelectedSenderGroup] = useState<AccountGroup | null>(null)
  const [selectedReceiverGroup, setSelectedReceiverGroup] = useState<AccountGroup | null>(null)

  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [showTypeDialog, setShowTypeDialog] = useState(false)
  const [typeSearchQuery, setTypeSearchQuery] = useState("")

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCases, setSelectedCases] = useState<string[]>([])
  const [editingCase, setEditingCase] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [caseToDelete, setCaseToDelete] = useState<string | null>(null)

  const [typeFilter, setTypeFilter] = useState<string>("")
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [draggedCase, setDraggedCase] = useState<string | null>(null)
  const [subtypeFilter, setSubtypeFilter] = useState<string>("") // Declare the variable here

  const accountGroups = [
    {
      id: "1",
      name: "测试组A",
      description: "主要用于邮件钓鱼测试",
      accountCount: 15,
      accounts: [
        {
          id: "1",
          uid: "4683494726",
          sixin_st: "ChrdWFpc2hvdS5zaXhpbi5sb2dpbjVsb2dpbjVz",
          salt: "abc123",
          did: "ANDROID_2d0298105c3618d6",
          groupId: "1",
        },
        {
          id: "2",
          uid: "2766034668",
          sixin_st: "_mt_1Nv_e3YPq63d4fwtrYWp7etWFBap",
          salt: "def456",
          did: "ANDROID_eeeeeeee000sixln",
          groupId: "1",
        },
      ],
      createdAt: "2024-01-20",
    },
    {
      id: "2",
      name: "测试组B",
      description: "用于社交工程攻击测试",
      accountCount: 22,
      accounts: [],
      createdAt: "2024-01-21",
    },
    {
      id: "3",
      name: "测试组C",
      description: "综合攻击测试组",
      accountCount: 8,
      accounts: [],
      createdAt: "2024-01-22",
    },
  ]

  const getCategoryByTypeName = (typeString: string) => {
    const parts = typeString.split(" > ")
    if (parts.length === 2) {
      const [categoryName, typeName] = parts
      const category = attackCategories.find((cat) => cat.name === categoryName)
      return category || null
    }

    for (const category of attackCategories) {
      const foundType = category.types.find((type) => type.name === typeString)
      if (foundType) {
        return category
      }
    }

    return null
  }

  const getSubtypeFromTypeString = (typeString: string) => {
    const parts = typeString.split(" > ")
    return parts.length === 2 ? parts[1] : typeString
  }

  const needsReceiver = () => {
    return selectedCategory === "私信服务"
  }

  const needsSingleAccountGroup = () => {
    return selectedCategory === "商业化激励"
  }

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value === "all" ? "" : value)
    setSubtypeFilter("") // 重置子类型选择
  }

  const filteredCases = attackCases.filter((case_) => {
    // 搜索查询筛选
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      if (!case_.name.toLowerCase().includes(searchLower) && !case_.type.toLowerCase().includes(searchLower)) {
        return false
      }
    }

    // 类型筛选
    if (categoryFilter && categoryFilter !== "all") {
      const caseCategory = getCategoryByTypeName(case_.type)
      if (caseCategory?.name !== categoryFilter) return false
    }

    // 子类型筛选
    if (typeFilter && typeFilter !== "all") {
      const caseSubtype = getSubtypeFromTypeString(case_.type)
      if (caseSubtype !== typeFilter) return false
    }

    return true
  })

  const totalPages = Math.ceil(filteredCases.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCases = filteredCases.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const getTypeIcon = (type: string) => {
    const category = getCategoryByTypeName(type)
    return category ? category.icon : <Mail className="h-4 w-4" />
  }

  const handleSenderGroupSelect = (group: AccountGroup) => {
    setSelectedSenderGroup(group)
    setNewCase({ ...newCase, senderGroup: group.id, senderAccounts: [] })
    setShowSenderDialog(false)
    setShowSenderAccountDialog(true)
  }

  const handleReceiverGroupSelect = (group: AccountGroup) => {
    setSelectedReceiverGroup(group)
    setNewCase({ ...newCase, receiverGroup: group.id, receiverAccounts: [] })
    setShowReceiverDialog(false)
    setShowReceiverAccountDialog(true)
  }

  const handleSenderAccountSelect = (accountIds: string[]) => {
    setNewCase({ ...newCase, senderAccounts: accountIds })
    setShowSenderAccountDialog(false)
  }

  const handleReceiverAccountSelect = (accountIds: string[]) => {
    setNewCase({ ...newCase, receiverAccounts: accountIds })
    setShowReceiverAccountDialog(false)
  }

  const handleSelectCase = (caseId: string, checked: boolean) => {
    if (checked) {
      setSelectedCases([...selectedCases, caseId])
    } else {
      setSelectedCases(selectedCases.filter((id) => id !== caseId))
    }
  }

  const handleSelectAllCases = (checked: boolean) => {
    if (checked) {
      setSelectedCases(paginatedCases.map((case_) => case_.id))
    } else {
      setSelectedCases([])
    }
  }

  const handleEditCase = (caseId: string) => {
    setEditingCase(caseId)
    const caseToEdit = attackCases.find((case_) => case_.id === caseId)
    if (caseToEdit) {
      setEditingName(caseToEdit.name)
    }
  }

  const handleSaveEdit = (caseId: string) => {
    if (!editingCase) return

    setAttackCases((cases) => cases.map((case_) => (case_.id === caseId ? { ...case_, name: editingName } : case_)))
    setShowEditDialog(false)
    setEditingCase(null)
    toast({
      title: "用例已更新",
      description: "攻击用例信息已成功更新",
    })
  }

  const handleDeleteCase = (caseId: string) => {
    setCaseToDelete(caseId)
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    if (caseToDelete) {
      setAttackCases((cases) => cases.filter((case_) => case_.id !== caseToDelete))
      toast({
        title: "用例已删除",
        description: "攻击用例已成功删除",
      })
    }
    setShowDeleteDialog(false)
    setCaseToDelete(null)
  }

  const handleBatchDeleteCases = () => {
    if (selectedCases.length === 0) return

    setAttackCases((cases) => cases.filter((case_) => !selectedCases.includes(case_.id)))
    setSelectedCases([])
    toast({
      title: "批量删除成功",
      description: `已删除 ${selectedCases.length} 个攻击用例`,
    })
  }

  const handleViewCase = (case_: AttackCase) => {
    toast({
      title: "查看用例",
      description: `正在查看用例: ${case_.name}`,
    })
  }

  const handleRunCase = (case_: AttackCase) => {
    toast({
      title: "执行用例",
      description: `正在执行用例: ${case_.name}`,
    })
  }

  const getMessageType = (typeName: string) => {
    if (typeName.includes("文本")) return "text"
    if (typeName.includes("图片")) return "image"
    if (typeName.includes("卡片")) return "card"
    if (typeName.includes("表情")) return "emoji"
    if (typeName.includes("语音")) return "voice"
    if (typeName.includes("视频")) return "video"
    return "other"
  }

  const handleFileUpload = (file: File, type: "image" | "voice" | "video") => {
    // 模拟文件上传，实际应该调用上传API
    const mockUrl = `https://example.com/${type}/${file.name}`

    if (type === "image") {
      setMessageContent((prev) => ({ ...prev, imageUrl: mockUrl }))
    } else if (type === "voice") {
      setMessageContent((prev) => ({ ...prev, voiceUrl: mockUrl }))
    } else if (type === "video") {
      setMessageContent((prev) => ({ ...prev, videoUrl: mockUrl }))
    }

    toast({
      title: "上传成功",
      description: `${type === "image" ? "图片" : type === "voice" ? "语音" : "视频"}已上传`,
    })
  }

  const handleCreateCase = () => {
    // 验证必填字段
    if (!newCase.name.trim()) {
      toast({
        title: "创建失败",
        description: "请输入用例名称",
        variant: "destructive",
      })
      return
    }

    if (!selectedType) {
      toast({
        title: "创建失败",
        description: "请选择攻击类型",
        variant: "destructive",
      })
      return
    }

    if (!selectedSenderGroup) {
      toast({
        title: "创建失败",
        description: "请选择发信人账号组",
        variant: "destructive",
      })
      return
    }

    if (needsReceiver() && !selectedReceiverGroup) {
      toast({
        title: "创建失败",
        description: "请选择收信人账号组",
        variant: "destructive",
      })
      return
    }

    const newAttackCase = {
      name: newCase.name,
      type: selectedType,
      status: "pending" as const,
      senderGroup: selectedSenderGroup.name,
      senderAccounts: newCase.senderAccounts,
      receiverGroup: selectedReceiverGroup?.name || "",
      receiverAccounts: newCase.receiverAccounts,
      attackCount: newCase.attackCount,
      qps: newCase.qps,
      accountParams: selectedCategory === "账号" ? newCase.accountParams : undefined,
      messageContent: selectedCategory === "私信服务" ? messageContent : undefined,
    }

    // 使用全局数据存储创建攻击用例
    try {
      const createdCase = dataStore.createAttackCase(newAttackCase)
      
      // 刷新本地状态以反映全局存储的变化
      const updatedCases = dataStore.getAttackCases()
      setAttackCases(updatedCases)
    } catch (error) {
      toast({
        title: "创建失败",
        description: "保存攻击用例时出错，请重试",
        variant: "destructive",
      })
      return
    }

    // 重置表单
    setNewCase({
      name: "",
      category: "",
      type: "",
      senderGroup: "",
      senderAccounts: [],
      receiverGroup: "",
      receiverAccounts: [],
      attackCount: 1,
      qps: 60,
      accountParams: {
        did: "",
        deviceModel: "",
        osVersion: "",
        appVersion: "",
      },
    })

    setMessageContent({
      text: "",
      imageUrl: "",
      cardContent: "",
      cardImageUrl: "",
      cardWebUrl: "",
      voiceUrl: "",
      videoUrl: "",
    })

    setSelectedCategory("")
    setSelectedType("")
    setSelectedSenderGroup(null)
    setSelectedReceiverGroup(null)

    toast({
      title: "创建成功",
      description: `攻击用例 "${newCase.name}" 已创建`,
    })
  }

  const AccountRangeSelector = ({
    group,
    selectedAccounts,
    onSelect,
    title,
  }: {
    group: AccountGroup | null
    selectedAccounts: string[]
    onSelect: (accountIds: string[]) => void
    title: string
  }) => {
    const [startIndex, setStartIndex] = useState(1)
    const [endIndex, setEndIndex] = useState(1)

    const handleConfirm = () => {
      if (!group) return

      const start = Math.max(1, Math.min(startIndex, group.accounts.length))
      const end = Math.max(start, Math.min(endIndex, group.accounts.length))

      const selectedIds = group.accounts.slice(start - 1, end).map((acc) => acc.id)
      onSelect(selectedIds)
    }

    const handleSelectAll = () => {
      setStartIndex(1)
      setEndIndex(group?.accounts.length || 1)
    }

    const handleSelectNone = () => {
      setStartIndex(1)
      setEndIndex(1)
    }

    if (!group) return null

    const currentStart = Math.max(1, Math.min(startIndex, group.accounts.length))
    const currentEnd = Math.max(currentStart, Math.min(endIndex, group.accounts.length))
    const selectedCount = currentEnd - currentStart + 1

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">选择 {group.name} 中的账号范围</h4>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              全选
            </Button>
            <Button variant="outline" size="sm" onClick={handleSelectNone}>
              重置
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-index">开始序号</Label>
            <Input
              id="start-index"
              type="number"
              min="1"
              max={group.accounts.length}
              value={startIndex}
              onChange={(e) => setStartIndex(Number.parseInt(e.target.value) || 1)}
              placeholder="1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-index">结束序号</Label>
            <Input
              id="end-index"
              type="number"
              min="1"
              max={group.accounts.length}
              value={endIndex}
              onChange={(e) => setEndIndex(Number.parseInt(e.target.value) || 1)}
              placeholder={group.accounts.length.toString()}
            />
          </div>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground mb-2">预览选择范围:</div>
          <div className="text-sm">
            序号 {currentStart} - {currentEnd} (共 {selectedCount} 个账号)
          </div>
          <div className="text-xs text-muted-foreground mt-1">总共 {group.accounts.length} 个账号可选</div>
        </div>

        <div className="max-h-40 overflow-y-auto border rounded p-2">
          <div className="text-xs text-muted-foreground mb-2">账号列表预览:</div>
          {group.accounts.slice(currentStart - 1, currentEnd).map((account, index) => (
            <div key={account.id} className="flex items-center space-x-2 py-1 text-sm">
              <span className="text-muted-foreground w-8">#{currentStart + index}</span>
              <div className="flex-1">
                <div className="font-medium">{account.uid}</div>
                <div className="text-xs text-muted-foreground truncate">{account.sixin_st}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-sm text-muted-foreground">将选择 {selectedCount} 个账号</span>
          <Button onClick={handleConfirm} className="bg-primary text-primary-foreground">
            确认选择
          </Button>
        </div>
      </div>
    )
  }

  const getFullTypeName = (typeName: string) => {
    for (const category of attackCategories) {
      const type = category.types.find((t) => t.name === typeName)
      if (type) {
        return `${category.name} > ${type.name}`
      }
    }
    return typeName
  }

  const getAllCategories = () => {
    return attackCategories.map((cat) => cat.name)
  }

  const getFilteredSubTypes = () => {
    if (!categoryFilter) {
      const subtypes: string[] = []
      attackCategories.forEach((category) => {
        category.types.forEach((type) => {
          subtypes.push(type.name)
        })
      })
      return subtypes
    } else {
      const selectedCategory = attackCategories.find((cat) => cat.name === categoryFilter)
      return selectedCategory ? selectedCategory.types.map((type) => type.name) : []
    }
  }

  const handleDrop = (targetId: string) => {
    if (!draggedCase || draggedCase === targetId) return

    setAttackCases((cases) => {
      const draggedIndex = cases.findIndex((case_) => case_.id === draggedCase)
      const targetIndex = cases.findIndex((case_) => case_.id === targetId)

      if (draggedIndex === -1 || targetIndex === -1) return cases

      const newCases = [...cases]
      const [dragged] = newCases.splice(draggedIndex, 1)
      newCases.splice(targetIndex, 0, dragged)

      return newCases
    })
  }

  return (
    <div className="space-y-6 min-w-[1200px]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">攻击用例</h2>
          <p className="text-muted-foreground mt-2">创建和管理蓝军演练攻击用例</p>
        </div>
      </div>

      <Tabs defaultValue="cases" className="space-y-4">
        <div className="flex space-x-4 mb-6">
          <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-muted/30">
            <TabsTrigger
              value="cases"
              className="h-16 flex flex-col items-center justify-center space-y-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-primary/20 hover:bg-muted/50 transition-all duration-200"
            >
              <Target className="h-5 w-5" />
              <span className="text-sm font-medium">用例列表</span>
            </TabsTrigger>
            <TabsTrigger
              value="create"
              className="h-16 flex flex-col items-center justify-center space-y-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-primary/20 hover:bg-muted/50 transition-all duration-200"
            >
              <Plus className="h-5 w-5" />
              <span className="text-sm font-medium">用例创建</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="cases" className="space-y-4 min-h-[600px]">
          <Card className="max-w-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总用例数</p>
                  <p className="text-2xl font-bold text-foreground">{attackCases.length}</p>
                </div>
                <Target className="h-8 w-8 text-chart-1" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Target className="mr-2 h-5 w-5" />
                攻击用例列表
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* 搜索和筛选区域 */}
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Input
                    placeholder="搜索用例名称..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                {selectedCases.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBatchDeleteCases}
                    disabled={selectedCases.length === 0}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    批量删除 ({selectedCases.length})
                  </Button>
                )}
              </div>

              {/* 用例表格 */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedCases.length === paginatedCases.length && paginatedCases.length > 0}
                          onCheckedChange={handleSelectAllCases}
                        />
                      </TableHead>
                      <TableHead className="w-12">序号</TableHead>
                      <TableHead>用例名称</TableHead>
                      <TableHead>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue placeholder="类型" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">全部</SelectItem>
                            <SelectItem value="社交互动">社交互动</SelectItem>
                            <SelectItem value="账号">账号</SelectItem>
                            <SelectItem value="私信服务">私信服务</SelectItem>
                            <SelectItem value="商业化激励">商业化激励</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableHead>
                      <TableHead>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue placeholder="子类型" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">全部</SelectItem>
                            {getFilteredSubTypes().map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableHead>
                      <TableHead>最后执行</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCases.map((case_, index) => {
                      const category = getCategoryByTypeName(case_.type)
                      return (
                        <TableRow
                          key={case_.id}
                          className={draggedCase === case_.id ? "opacity-50 border-2 border-primary" : ""}
                          draggable
                          onDragStart={() => setDraggedCase(case_.id)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => handleDrop(case_.id)}
                          onDragEnd={() => setDraggedCase(null)}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedCases.includes(case_.id)}
                              onCheckedChange={(checked) => handleSelectCase(case_.id, checked as boolean)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                          <TableCell>
                            {editingCase === case_.id ? (
                              <Input
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                onBlur={() => handleSaveEdit(case_.id)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveEdit(case_.id)
                                  if (e.key === "Escape") setEditingCase(null)
                                }}
                                className="h-8"
                                autoFocus
                              />
                            ) : (
                              case_.name
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{category?.name || "未知"}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{case_.type}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{case_.lastExecuted}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditCase(case_.id)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteCase(case_.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* 分页 */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  显示 {Math.min((currentPage - 1) * itemsPerPage + 1, filteredCases.length)} 到{" "}
                  {Math.min(currentPage * itemsPerPage, filteredCases.length)} 条，共 {filteredCases.length} 条
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    上一页
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    下一页
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4 min-h-[600px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Plus className="mr-2 h-5 w-5" />
                  创建攻击用例
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="case-name">用例名称</Label>
                  <Input
                    id="case-name"
                    placeholder="输入攻击用例名称"
                    value={newCase.name}
                    onChange={(e) => setNewCase({ ...newCase, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="case-type">攻击类型</Label>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">选择攻击类别</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {attackCategories.map((category) => (
                          <Button
                            key={category.name}
                            variant={selectedCategory === category.name ? "default" : "outline"}
                            className={`h-12 flex items-center justify-center space-x-2 ${
                              selectedCategory === category.name
                                ? "bg-primary text-primary-foreground"
                                : "bg-transparent hover:bg-muted"
                            }`}
                            onClick={() => {
                              setSelectedCategory(category.name)
                              setSelectedType("")
                              setNewCase({ ...newCase, type: "" })
                              setShowTypeDialog(true)
                            }}
                          >
                            {category.icon}
                            <span className="text-sm font-medium">{category.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {selectedType && (
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {attackCategories.find((cat) => cat.name === selectedCategory)?.icon}
                            <span className="font-medium">{selectedType}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowTypeDialog(true)}
                            className="bg-transparent"
                          >
                            重新选择
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">账号配置</Label>

                  {needsSingleAccountGroup() ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm">选择账号组</Label>
                        <Button
                          variant="outline"
                          className="w-full h-auto p-4 justify-start bg-transparent"
                          onClick={() => setShowSenderDialog(true)}
                        >
                          <div className="flex items-center space-x-3">
                            <Users className="h-5 w-5 text-muted-foreground" />
                            <div className="text-left">
                              <div className="font-medium">
                                {selectedSenderGroup ? selectedSenderGroup.name : "点击选择账号组"}
                              </div>
                              {selectedSenderGroup && (
                                <div className="text-sm text-muted-foreground">
                                  {selectedSenderGroup.description} • {selectedSenderGroup.accounts.length} 个账号
                                  {newCase.senderAccounts.length > 0 && ` • 已选择 ${newCase.senderAccounts.length} 个`}
                                </div>
                              )}
                            </div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label className="text-sm">发信人账号组</Label>
                        <Button
                          variant="outline"
                          className="w-full h-auto p-4 justify-start bg-transparent"
                          onClick={() => setShowSenderDialog(true)}
                        >
                          <div className="flex items-center space-x-3">
                            <Users className="h-5 w-5 text-muted-foreground" />
                            <div className="text-left">
                              <div className="font-medium">
                                {selectedSenderGroup ? selectedSenderGroup.name : "点击选择发信人账号组"}
                              </div>
                              {selectedSenderGroup && (
                                <div className="text-sm text-muted-foreground">
                                  {selectedSenderGroup.description} • {selectedSenderGroup.accounts.length} 个账号
                                  {newCase.senderAccounts.length > 0 && ` • 已选择 ${newCase.senderAccounts.length} 个`}
                                </div>
                              )}
                            </div>
                          </div>
                        </Button>
                      </div>

                      {needsReceiver() && (
                        <div className="space-y-2">
                          <Label className="text-sm">收信人账号组</Label>
                          <Button
                            variant="outline"
                            className="w-full h-auto p-4 justify-start bg-transparent"
                            onClick={() => setShowReceiverDialog(true)}
                          >
                            <div className="flex items-center space-x-3">
                              <Users className="h-5 w-5 text-muted-foreground" />
                              <div className="text-left">
                                <div className="font-medium">
                                  {selectedReceiverGroup ? selectedReceiverGroup.name : "点击选择收信人账号组"}
                                </div>
                                {selectedReceiverGroup && (
                                  <div className="text-sm text-muted-foreground">
                                    {selectedReceiverGroup.description} • {selectedReceiverGroup.accounts.length} 个账号
                                    {newCase.receiverAccounts.length > 0 &&
                                      ` • 已选择 ${newCase.receiverAccounts.length} 个`}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {selectedCategory === "私信服务" && selectedType && (
                  <div className="space-y-4">
                    <Label className="text-base font-medium">消息内容配置</Label>

                    {/* 全局参数 */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="qps" className="text-sm">
                          QPS
                        </Label>
                        <Input
                          id="qps"
                          type="number"
                          placeholder="不设置默认无限制"
                          value={globalParams.qps}
                          onChange={(e) => setGlobalParams({ ...globalParams, qps: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="attack-count" className="text-sm">
                          攻击次数
                        </Label>
                        <Input
                          id="attack-count"
                          type="number"
                          placeholder="默认1次"
                          value={globalParams.attackCount}
                          onChange={(e) => setGlobalParams({ ...globalParams, attackCount: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* 根据消息类型显示不同的配置 */}
                    {getMessageType(selectedType) === "text" && (
                      <div className="space-y-2">
                        <Label htmlFor="text-content">消息内容</Label>
                        <textarea
                          id="text-content"
                          className="w-full p-3 border rounded-md resize-none"
                          rows={4}
                          placeholder="输入文本消息内容..."
                          value={messageContent.text}
                          onChange={(e) => setMessageContent({ ...messageContent, text: e.target.value })}
                        />
                      </div>
                    )}

                    {(getMessageType(selectedType) === "image" || getMessageType(selectedType) === "emoji") && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>图片上传</Label>
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleFileUpload(file, "image")
                              }}
                              className="hidden"
                              id="image-upload"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer">
                              <div className="text-center">
                                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="mt-2 text-sm text-muted-foreground">点击上传图片</p>
                              </div>
                            </label>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="image-url">或手动填入图片链接</Label>
                          <Input
                            id="image-url"
                            placeholder="https://example.com/image.jpg"
                            value={messageContent.imageUrl}
                            onChange={(e) => setMessageContent({ ...messageContent, imageUrl: e.target.value })}
                          />
                        </div>
                      </div>
                    )}

                    {getMessageType(selectedType) === "card" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="card-content">卡片内容</Label>
                          <textarea
                            id="card-content"
                            className="w-full p-3 border rounded-md resize-none"
                            rows={3}
                            placeholder="输入卡片文字内容..."
                            value={messageContent.cardContent}
                            onChange={(e) => setMessageContent({ ...messageContent, cardContent: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="card-image">卡片图片链接</Label>
                          <Input
                            id="card-image"
                            placeholder="https://example.com/card-image.jpg"
                            value={messageContent.cardImageUrl}
                            onChange={(e) => setMessageContent({ ...messageContent, cardImageUrl: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="card-url">卡片网址链接</Label>
                          <Input
                            id="card-url"
                            placeholder="https://example.com"
                            value={messageContent.cardWebUrl}
                            onChange={(e) => setMessageContent({ ...messageContent, cardWebUrl: e.target.value })}
                          />
                        </div>
                      </div>
                    )}

                    {getMessageType(selectedType) === "voice" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>语音上传</Label>
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                            <input
                              type="file"
                              accept="audio/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleFileUpload(file, "voice")
                              }}
                              className="hidden"
                              id="voice-upload"
                            />
                            <label htmlFor="voice-upload" className="cursor-pointer">
                              <div className="text-center">
                                <Mic className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="mt-2 text-sm text-muted-foreground">点击上传语音文件</p>
                              </div>
                            </label>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="voice-url">或手动填入语音链接</Label>
                          <Input
                            id="voice-url"
                            placeholder="https://example.com/voice.mp3"
                            value={messageContent.voiceUrl}
                            onChange={(e) => setMessageContent({ ...messageContent, voiceUrl: e.target.value })}
                          />
                        </div>
                      </div>
                    )}

                    {getMessageType(selectedType) === "video" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>视频上传</Label>
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleFileUpload(file, "video")
                              }}
                              className="hidden"
                              id="video-upload"
                            />
                            <label htmlFor="video-upload" className="cursor-pointer">
                              <div className="text-center">
                                <Video className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="mt-2 text-sm text-muted-foreground">点击上传视频文件</p>
                              </div>
                            </label>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="video-url">或手动填入视频链接</Label>
                          <Input
                            id="video-url"
                            placeholder="https://example.com/video.mp4"
                            value={messageContent.videoUrl}
                            onChange={(e) => setMessageContent({ ...messageContent, videoUrl: e.target.value })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedCategory === "账号" && selectedType && (
                  <div className="space-y-4">
                    <Label className="text-base font-medium">账号参数配置</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="did">设备ID (DID)</Label>
                        <Input
                          id="did"
                          placeholder="输入设备ID"
                          value={newCase.accountParams.did}
                          onChange={(e) =>
                            setNewCase({
                              ...newCase,
                              accountParams: { ...newCase.accountParams, did: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="device-model">设备型号</Label>
                        <Input
                          id="device-model"
                          placeholder="输入设备型号"
                          value={newCase.accountParams.deviceModel}
                          onChange={(e) =>
                            setNewCase({
                              ...newCase,
                              accountParams: { ...newCase.accountParams, deviceModel: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="os-version">系统版本</Label>
                        <Input
                          id="os-version"
                          placeholder="输入系统版本"
                          value={newCase.accountParams.osVersion}
                          onChange={(e) =>
                            setNewCase({
                              ...newCase,
                              accountParams: { ...newCase.accountParams, osVersion: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="app-version">应用版本</Label>
                        <Input
                          id="app-version"
                          placeholder="输入应用版本"
                          value={newCase.accountParams.appVersion}
                          onChange={(e) =>
                            setNewCase({
                              ...newCase,
                              accountParams: { ...newCase.accountParams, appVersion: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                <Button className="w-full bg-primary text-primary-foreground" onClick={handleCreateCase}>
                  <Zap className="mr-2 h-4 w-4" />
                  创建用例
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">用例配置预览</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">用例名称:</span>
                    <span className="font-medium">{newCase.name || "未设置"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">攻击类型:</span>
                    <div className="flex items-center space-x-2">
                      {selectedCategory && attackCategories.find((cat) => cat.name === selectedCategory)?.icon}
                      <span className="font-medium">{selectedType || "未选择"}</span>
                    </div>
                  </div>
                  {needsSingleAccountGroup() ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">账号组:</span>
                        <span>{selectedSenderGroup?.name || "未选择"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">选择账号数:</span>
                        <span>{newCase.senderAccounts.length} 个</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">发信人账号组:</span>
                        <span>{selectedSenderGroup?.name || "未选择"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">发信人账号数:</span>
                        <span>{newCase.senderAccounts.length} 个</span>
                      </div>
                      {needsReceiver() && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">收信人账号组:</span>
                            <span>{selectedReceiverGroup?.name || "未选择"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">收信人账号数:</span>
                            <span>{newCase.receiverAccounts.length} 个</span>
                          </div>
                        </>
                      )}
                    </>
                  )}
                  {selectedCategory === "私信服务" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">QPS:</span>
                        <span>{globalParams.qps || "无限制"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">攻击次数:</span>
                        <span>{globalParams.attackCount || "1"}</span>
                      </div>
                      {getMessageType(selectedType) === "text" && messageContent.text && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">消息内容:</span>
                          <span className="truncate max-w-32">{messageContent.text}</span>
                        </div>
                      )}
                      {(getMessageType(selectedType) === "image" || getMessageType(selectedType) === "emoji") &&
                        messageContent.imageUrl && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">图片链接:</span>
                            <span className="truncate max-w-32">{messageContent.imageUrl}</span>
                          </div>
                        )}
                      {getMessageType(selectedType) === "card" && (
                        <>
                          {messageContent.cardContent && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">卡片内容:</span>
                              <span className="truncate max-w-32">{messageContent.cardContent}</span>
                            </div>
                          )}
                          {messageContent.cardWebUrl && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">卡片链接:</span>
                              <span className="truncate max-w-32">{messageContent.cardWebUrl}</span>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                  {selectedCategory === "账号" && (
                    <>
                      {newCase.accountParams.did && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">设备ID:</span>
                          <span className="truncate max-w-32">{newCase.accountParams.did}</span>
                        </div>
                      )}
                      {newCase.accountParams.deviceModel && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">设备型号:</span>
                          <span className="truncate max-w-32">{newCase.accountParams.deviceModel}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showSenderDialog} onOpenChange={setShowSenderDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>选择发信人账号组</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {accountGroups.map((group) => (
              <Card
                key={group.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => {
                  setSelectedSenderGroup(group)
                  setShowSenderDialog(false)
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{group.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <Users className="mr-1 h-3 w-3" />
                        {group.accountCount} 个账号
                      </div>
                    </div>
                    <div className="ml-4">
                      <Badge variant="outline">{group.accountCount}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showReceiverDialog} onOpenChange={setShowReceiverDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>选择收信人账号组</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {accountGroups.map((group) => (
              <Card
                key={group.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleReceiverGroupSelect(group)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{group.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <Users className="mr-1 h-3 w-3" />
                        {group.accountCount} 个账号
                      </div>
                    </div>
                    <div className="ml-4">
                      <Badge variant="outline">{group.accountCount}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showTypeDialog} onOpenChange={setShowTypeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>选择 {selectedCategory} 的具体类型</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedCategory && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {attackCategories
                    .find((cat) => cat.name === selectedCategory)
                    ?.types.map((type) => (
                      <Card
                        key={type.name}
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedType === type.name ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                        }`}
                        onClick={() => {
                          setSelectedType(type.name)
                          setNewCase({ ...newCase, type: type.name })
                          setShowTypeDialog(false)
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {attackCategories.find((cat) => cat.name === selectedCategory)?.icon}
                              <span className="font-medium">{type.name}</span>
                            </div>
                            {selectedType === type.name && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">命令: {type.command}</div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
