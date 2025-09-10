"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { toast } from "@/hooks/use-toast"
import { dataStore } from "@/lib/data-store"
import type { AttackCase, IMServiceInterface, HTTPServiceInterface } from "@/lib/types"
import { IM_INTERFACES, HTTP_INTERFACES, SIGNATURE_TYPES, URL_TREE, URLTreeNode } from "@/lib/types"
import {
  Plus,
  Target,
  Mail,
  MessageSquare,
  Users,
  Zap,
  Globe,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Settings,
  Eye,
  Play,
  FileText,
  List,
  Folder,
  FolderOpen,
  Link,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export function AttackCaseManagement() {
  const [attackCases, setAttackCases] = useState<AttackCase[]>([])
  const [isChainConfigOpen, setIsChainConfigOpen] = useState(false)
  const [httpHeaders, setHttpHeaders] = useState<string>(JSON.stringify({
    "Content-Type": "application/json",
    "User-Agent": "Attack-Case-Tool/1.0"
  }, null, 2))
  const [httpHeadersError, setHttpHeadersError] = useState("")
  const [httpBody, setHttpBody] = useState("")
  const [httpMethod, setHttpMethod] = useState<"GET" | "POST">("POST")
  const [httpUrl, setHttpUrl] = useState("")
  const [selectedSignature, setSelectedSignature] = useState("none")
  const [customInterfaceName, setCustomInterfaceName] = useState("")
  const [showCustomInterfaceInput, setShowCustomInterfaceInput] = useState(false)
  const [showCustomUrl, setShowCustomUrl] = useState(false)
  const [selectedUrlNode, setSelectedUrlNode] = useState<string>("")
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false)
  
  // 新用例表单状态
  const [newCase, setNewCase] = useState({
    name: "",
    serviceType: "" as "IM" | "HTTP" | "",
    apiInterface: "",
    parameters: "",
    description: "",
    // 链路级配置
    chainConfig: {
      accountGroup: "",
      parameterFile: null as File | null,
      globalVariables: "",
    },
    receiverGroup: "",
    receiverAccounts: [] as string[],
    attackCount: 1,
    qps: 60,
  })

  // 生成账号组的 uid 列表
  const generateUidList = (groupName: string): string => {
    const selectedGroup = accountGroups.find(group => group.name === groupName)
    if (!selectedGroup || !selectedGroup.accounts.length) {
      return "[]"
    }
    
    const uidList = selectedGroup.accounts.map(account => `"${account.uid}"`)
    return `[${uidList.join(", ")}]`
  }

  // 更新全局变量中的 uid 参数
  const updateGlobalVariables = (groupName: string) => {
    const uidList = generateUidList(groupName)
    let globalVars = newCase.chainConfig.globalVariables
    
    try {
      // 尝试解析现有的全局变量
      const parsedVars = globalVars ? JSON.parse(globalVars) : {}
      parsedVars.uid = uidList
      
      // 重新生成格式化的 JSON
      globalVars = JSON.stringify(parsedVars, null, 2)
    } catch {
      // 如果解析失败，创建新的全局变量对象
      const varsObject: any = { uid: uidList }
      globalVars = JSON.stringify(varsObject, null, 2)
    }
    
    return globalVars
  }

  // 列表筛选和分页状态
  const [searchTerm, setSearchTerm] = useState("")
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // 其他UI状态
  const [selectedCases, setSelectedCases] = useState<string[]>([])
  const [editingCase, setEditingCase] = useState<AttackCase | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [caseToDelete, setCaseToDelete] = useState<string | null>(null)
  
  // 编辑用例表单状态
  const [editCase, setEditCase] = useState({
    name: "",
    serviceType: "" as "IM" | "HTTP" | "",
    apiInterface: "",
    parameters: "",
    description: "",
    chainConfig: {
      accountGroup: "",
      parameterFile: null as File | null,
      globalVariables: "",
    },
    receiverGroup: "",
    receiverAccounts: [] as string[],
    attackCount: 1,
    qps: 60,
  })

  // 模拟账号组数据
  const accountGroups: AccountGroup[] = [
    {
      id: "1",
      name: "测试组A",
      description: "主要用于IM服务测试",
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
      description: "用于HTTP服务测试",
      accountCount: 22,
      accounts: [],
      createdAt: "2024-01-21",
    },
    {
      id: "3",
      name: "测试组C",
      description: "综合服务测试组",
      accountCount: 8,
      accounts: [],
      createdAt: "2024-01-22",
    },
  ]

  // 从全局数据存储加载攻击用例
  useEffect(() => {
    const loadAttackCases = () => {
      const cases = dataStore.getAttackCases()
      setAttackCases(cases)
    }
    loadAttackCases()
  }, [])

  // 获取当前选择的服务接口列表
  const getCurrentInterfaces = (): (IMServiceInterface | HTTPServiceInterface)[] => {
    if (newCase.serviceType === "IM") {
      return IM_INTERFACES
    } else if (newCase.serviceType === "HTTP") {
      return HTTP_INTERFACES
    }
    return []
  }

  // 获取接口显示名称（截断长接口名）
  const getInterfaceDisplayName = (interfaceName: string | undefined, maxLength = 10) => {
    if (!interfaceName) {
      return "未设置"
    }
    if (interfaceName.length <= maxLength) {
      return interfaceName
    }
    return interfaceName.substring(0, maxLength) + "..."
  }

  // 筛选和分页
  const filteredCases = attackCases.filter((case_) => {
    // 搜索查询筛选
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const nameMatch = case_.name.toLowerCase().includes(searchLower)
      const interfaceMatch = case_.apiInterface?.toLowerCase().includes(searchLower) || false
      const typeMatch = case_.type?.toLowerCase().includes(searchLower) || false // 兼容旧数据的type字段
      
      if (!nameMatch && !interfaceMatch && !typeMatch) {
        return false
      }
    }

    // 服务类型筛选
    if (serviceTypeFilter && serviceTypeFilter !== "all") {
      // 处理新旧数据格式兼容性
      if (case_.serviceType) {
        if (case_.serviceType !== serviceTypeFilter) {
          return false
        }
      } else {
        // 对于旧数据，根据type字段推断serviceType
        return false // 暂时过滤掉没有serviceType的旧数据
      }
    }

    return true
  })

  const totalPages = Math.ceil(filteredCases.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCases = filteredCases.slice(startIndex, endIndex)

  // 表单验证
  const validateForm = () => {
    if (!newCase.name.trim()) {
      toast({
        title: "创建失败",
        description: "请输入用例名称",
        variant: "destructive",
      })
      return false
    }

    if (!newCase.serviceType) {
      toast({
        title: "创建失败", 
        description: "请选择服务类型",
        variant: "destructive",
      })
      return false
    }

    if (!newCase.apiInterface) {
      toast({
        title: "创建失败",
        description: "请选择API接口",
        variant: "destructive",
      })
      return false
    }

    if (!newCase.parameters.trim()) {
      toast({
        title: "创建失败",
        description: "请输入接口参数",
        variant: "destructive",
      })
      return false
    }

    // 验证JSON格式
    try {
      JSON.parse(newCase.parameters)
    } catch (error) {
      toast({
        title: "创建失败",
        description: "参数格式错误，请输入有效的JSON格式",
        variant: "destructive",
      })
      return false
    }

    if (!newCase.chainConfig.accountGroup) {
      toast({
        title: "创建失败",
        description: "请选择链路账号组",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  // 创建用例
  const handleCreateCase = () => {
    if (!validateForm()) return

    const newAttackCase = {
      name: newCase.name,
      serviceType: newCase.serviceType as "IM" | "HTTP",
      apiInterface: newCase.apiInterface,
      parameters: newCase.parameters,
      description: newCase.description,
      status: "pending" as const,
      chainConfig: newCase.chainConfig,
      receiverGroup: newCase.receiverGroup,
      receiverAccounts: newCase.receiverAccounts,
      attackCount: newCase.attackCount,
      qps: newCase.qps,
    }

    try {
      const createdCase = dataStore.createAttackCase(newAttackCase)
      const updatedCases = dataStore.getAttackCases()
      setAttackCases(updatedCases)

      // 重置表单
      setNewCase({
        name: "",
        serviceType: "",
        apiInterface: "",
        parameters: "",
        description: "",
        chainConfig: {
          accountGroup: "",
          parameterFile: null,
          globalVariables: "",
        },
        receiverGroup: "",
        receiverAccounts: [],
        attackCount: 1,
        qps: 60,
      })
      
      // 重置HTTP配置状态
      setHttpHeaders(JSON.stringify({
        "Content-Type": "application/json",
        "User-Agent": "Attack-Case-Tool/1.0"
      }, null, 2))
      setHttpHeadersError("")
      setHttpBody("")
      setHttpMethod("POST")
      setHttpUrl("")
      setSelectedSignature("none")
      setCustomInterfaceName("")
      setShowCustomInterfaceInput(false)
      setShowCustomUrl(false)
      setSelectedUrlNode("")
      setExpandedNodes(new Set())
      
      toast({
        title: "创建成功",
        description: `攻击用例 "${newCase.name}" 已创建`,
      })
    } catch (error) {
      toast({
        title: "创建失败",
        description: "保存攻击用例时出错，请重试",
        variant: "destructive",
      })
    }
  }

  // 编辑用例
  const handleEditCase = (caseData: AttackCase) => {
    setEditingCase(caseData)
    setEditCase({
      name: caseData.name,
      serviceType: caseData.serviceType,
      apiInterface: caseData.apiInterface || "",
      parameters: caseData.parameters,
      description: caseData.description || "",
      chainConfig: {
        accountGroup: caseData.chainConfig?.accountGroup || "",
        parameterFile: caseData.chainConfig?.parameterFile || null,
        globalVariables: caseData.chainConfig?.globalVariables || "",
      },
      receiverGroup: caseData.receiverGroup || "",
      receiverAccounts: caseData.receiverAccounts || [],
      attackCount: caseData.attackCount,
      qps: caseData.qps,
    })
  }

  // 保存编辑
  const handleSaveEdit = () => {
    if (!editingCase) return

    try {
      // 更新攻击用例数据
      const updatedCase = {
        ...editingCase,
        name: editCase.name,
        serviceType: editCase.serviceType as "IM" | "HTTP",
        apiInterface: editCase.apiInterface,
        parameters: editCase.parameters,
        description: editCase.description,
        chainConfig: editCase.chainConfig,
        receiverGroup: editCase.receiverGroup,
        receiverAccounts: editCase.receiverAccounts,
        attackCount: editCase.attackCount,
        qps: editCase.qps,
      }

      // 在全局数据存储中更新
      dataStore.updateAttackCase(updatedCase.id, updatedCase)
      const updatedCases = dataStore.getAttackCases()
      setAttackCases(updatedCases)

      // 关闭编辑模式
      setEditingCase(null)
      
      toast({
        title: "更新成功",
        description: `攻击用例 "${editCase.name}" 已更新`,
      })
    } catch (error) {
      toast({
        title: "更新失败",
        description: "保存攻击用例时出错，请重试",
        variant: "destructive",
      })
    }
  }

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingCase(null)
  }

  // 验证JSON格式
  const validateHttpHeaders = (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString)
      setHttpHeadersError("")
      return true
    } catch (error) {
      setHttpHeadersError("请输入有效的JSON格式")
      return false
    }
  }

  // 处理请求头变化
  const handleHttpHeadersChange = (value: string) => {
    setHttpHeaders(value)
    validateHttpHeaders(value)
    
    // 如果JSON有效，更新参数
    if (validateHttpHeaders(value)) {
      updateParametersWithHeaders(value)
    }
  }

  // 更新参数中的请求头
  const updateParametersWithHeaders = (headersJson: string) => {
    try {
      const headersObj = JSON.parse(headersJson)
      setNewCase({
        ...newCase,
        parameters: JSON.stringify({
          url: httpUrl,
          method: httpMethod,
          headers: headersObj,
          body: httpBody,
          signature: selectedSignature
        }, null, 2)
      })
    } catch (error) {
      // JSON无效时不更新参数
    }
  }

  // 处理签名选择变化
  const handleSignatureChange = (signature: string) => {
    setSelectedSignature(signature)
    try {
      const headersObj = JSON.parse(httpHeaders)
      setNewCase({
        ...newCase,
        parameters: JSON.stringify({
          url: httpUrl,
          method: httpMethod,
          headers: headersObj,
          body: httpBody,
          signature: signature
        }, null, 2)
      })
    } catch (error) {
      // JSON格式错误时不更新参数
    }
  }

  // 处理平台接口选择
  const handlePlatformInterfaceSelect = (interfaceName: string) => {
    // 处理自定义接口
    if (interfaceName === "自定义接口") {
      setShowCustomInterfaceInput(true)
      setNewCase({
        ...newCase,
        apiInterface: "",
        parameters: ""
      })
      return
    }

    setShowCustomInterfaceInput(false)
    setCustomInterfaceName("")
    
    const selectedInterface = HTTP_INTERFACES.find(i => i.name === interfaceName)
    if (selectedInterface) {
      // 自动填充请求方法
      const method = selectedInterface.method === "PUT" || selectedInterface.method === "DELETE" ? "POST" : selectedInterface.method as "GET" | "POST"
      setHttpMethod(method)
      
      let bodyContent = ""
      // 自动填充请求体模板（仅对POST请求）
      if (selectedInterface.method === "POST" && selectedInterface.requiredParams.length > 0) {
        const bodyTemplate: Record<string, string> = {}
        selectedInterface.requiredParams.forEach(param => {
          bodyTemplate[param] = `\${${param}}`
        })
        bodyContent = JSON.stringify(bodyTemplate, null, 2)
        setHttpBody(bodyContent)
      } else {
        setHttpBody("")
      }
      
      // 解析当前请求头
      let headersObj = {}
      try {
        headersObj = JSON.parse(httpHeaders)
      } catch (error) {
        headersObj = {}
      }
      
      // 更新参数字段，包含HTTP配置
      setNewCase({
        ...newCase,
        apiInterface: interfaceName,
        parameters: JSON.stringify({
          url: httpUrl,
          method: method,
          headers: headersObj,
          body: bodyContent,
          signature: selectedSignature,
          requiredParams: selectedInterface.requiredParams
        }, null, 2)
      })
    }
  }

  // 处理自定义接口名称变化
  const handleCustomInterfaceNameChange = (value: string) => {
    setCustomInterfaceName(value)
    if (value.trim()) {
      // 解析当前请求头
      let headersObj = {}
      try {
        headersObj = JSON.parse(httpHeaders)
      } catch (error) {
        headersObj = {}
      }

      setNewCase({
        ...newCase,
        apiInterface: value,
        parameters: JSON.stringify({
          url: httpUrl,
          method: httpMethod,
          headers: headersObj,
          body: httpBody,
          signature: selectedSignature,
          isCustomInterface: true
        }, null, 2)
      })
    }
  }

  // 查找URL树节点
  const findUrlNode = (nodes: URLTreeNode[], nodeId: string): URLTreeNode | null => {
    for (const node of nodes) {
      if (node.id === nodeId) {
        return node
      }
      if (node.children) {
        const found = findUrlNode(node.children, nodeId)
        if (found) return found
      }
    }
    return null
  }

  // 处理URL节点选择
  const handleUrlNodeSelect = (nodeId: string) => {
    setSelectedUrlNode(nodeId)
    const node = findUrlNode(URL_TREE, nodeId)
    
    if (node && node.url) {
      // 设置URL
      setHttpUrl(node.url)
      
      // 设置请求方法
      if (node.method) {
        setHttpMethod(node.method)
      }
      
      // 设置请求头
      if (node.headers) {
        const headersJson = JSON.stringify(node.headers, null, 2)
        setHttpHeaders(headersJson)
        setHttpHeadersError("")
      }
      
      // 设置请求体
      if (node.body && node.method === "POST") {
        setHttpBody(node.body)
      } else if (node.method === "GET") {
        setHttpBody("")
      }
      
      // 更新接口名称
      setNewCase({
        ...newCase,
        apiInterface: node.name,
        parameters: JSON.stringify({
          url: node.url,
          method: node.method || httpMethod,
          headers: node.headers || {},
          body: (node.method === "POST" && node.body) ? node.body : "",
          signature: selectedSignature
        }, null, 2)
      })
      
      // 关闭弹窗
      setIsUrlDialogOpen(false)
    }
  }

  // 切换节点展开状态
  const toggleNodeExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  // 获取树中所有节点（用于查找）
  const findAllNodes = (node: URLTreeNode): URLTreeNode[] => {
    const nodes = [node]
    if (node.children) {
      node.children.forEach(child => {
        nodes.push(...findAllNodes(child))
      })
    }
    return nodes
  }

  // 渲染树状列表节点
  const renderTreeNode = (node: URLTreeNode, depth = 0): JSX.Element => {
    const isExpanded = expandedNodes.has(node.id)
    const hasChildren = node.children && node.children.length > 0
    const isLeaf = !!node.url
    const isSelected = selectedUrlNode === node.id

    return (
      <div key={node.id} className="w-full">
        <div
          className={`flex items-center py-2 px-2 hover:bg-muted/50 cursor-pointer rounded-md transition-colors ${
            isSelected ? 'bg-primary/10 border border-primary/20' : ''
          }`}
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
          onClick={() => {
            if (isLeaf) {
              handleUrlNodeSelect(node.id)
            } else if (hasChildren) {
              toggleNodeExpanded(node.id)
            }
          }}
        >
          {/* 展开/收起图标 */}
          {hasChildren && (
            <div className="mr-2 flex-shrink-0">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          )}
          
          {/* 文件夹/接口图标 */}
          <div className="mr-2 flex-shrink-0">
            {isLeaf ? (
              <Link className="h-4 w-4 text-blue-500" />
            ) : hasChildren ? (
              isExpanded ? (
                <FolderOpen className="h-4 w-4 text-yellow-500" />
              ) : (
                <Folder className="h-4 w-4 text-yellow-500" />
              )
            ) : null}
          </div>
          
          {/* 节点名称 */}
          <span className={`flex-1 text-sm ${isLeaf ? 'text-foreground' : 'text-muted-foreground font-medium'}`}>
            {node.name}
          </span>
          
          {/* 请求方法标识 */}
          {isLeaf && node.method && (
            <Badge variant="outline" className="ml-2 text-xs">
              {node.method}
            </Badge>
          )}
        </div>
        
        {/* 子节点 */}
        {hasChildren && isExpanded && (
          <div className="ml-0">
            {node.children!.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  // 删除用例
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

  // 批量操作
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

  const handleBatchDeleteCases = () => {
    if (selectedCases.length === 0) return

    setAttackCases((cases) => cases.filter((case_) => !selectedCases.includes(case_.id)))
    setSelectedCases([])
    toast({
      title: "批量删除成功",
      description: `已删除 ${selectedCases.length} 个攻击用例`,
    })
  }

  // 服务类型图标
  const getServiceTypeIcon = (serviceType: "IM" | "HTTP") => {
    return serviceType === "IM" ? 
      <MessageSquare className="h-4 w-4" /> : 
      <Globe className="h-4 w-4" />
  }

  // 状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default"
      case "pending": return "secondary"
      case "paused": return "outline"
      case "completed": return "secondary"
      case "draft": return "outline"
      default: return "secondary"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">攻击用例管理</h1>
        <p className="text-muted-foreground">创建和管理IM服务和HTTP服务的攻击测试用例</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <Target className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">总用例</p>
              <p className="text-2xl font-bold">{attackCases.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <MessageSquare className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">IM服务</p>
              <p className="text-2xl font-bold">
                {attackCases.filter(case_ => case_.serviceType === "IM").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Globe className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">HTTP服务</p>
              <p className="text-2xl font-bold">
                {attackCases.filter(case_ => case_.serviceType === "HTTP").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 主要内容区域 - 标签页 */}
      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            创建用例
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            用例列表
          </TabsTrigger>
        </TabsList>

        {/* 创建用例标签页 */}
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>创建新的攻击用例</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 基本信息 */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="case-name">用例名称</Label>
                  <Input
                    id="case-name"
                    placeholder="输入用例名称"
                    value={newCase.name}
                    onChange={(e) => setNewCase({ ...newCase, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="case-description">用例描述</Label>
                  <Textarea
                    id="case-description"
                    placeholder="输入用例描述（可选）"
                    value={newCase.description}
                    onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                  />
                </div>
              </div>

              {/* 链路级配置 */}
              <Collapsible open={isChainConfigOpen} onOpenChange={setIsChainConfigOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      链路级配置
                    </span>
                    {isChainConfigOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div className="border rounded-lg p-4 space-y-4">
                    {/* 账号组选择 */}
                    <div className="space-y-2">
                      <Label>链路账号组</Label>
                      <Select 
                        value={newCase.chainConfig.accountGroup} 
                        onValueChange={(value) => {
                          const updatedGlobalVars = updateGlobalVariables(value)
                          setNewCase({ 
                            ...newCase, 
                            chainConfig: { 
                              ...newCase.chainConfig, 
                              accountGroup: value,
                              globalVariables: updatedGlobalVars
                            }
                          })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择链路账号组" />
                        </SelectTrigger>
                        <SelectContent>
                          {accountGroups.map((group) => (
                            <SelectItem key={group.id} value={group.name}>
                              {group.name} ({group.accountCount}个账号)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {newCase.chainConfig.accountGroup && (
                        <div className="text-sm text-blue-600">
                          已自动生成 uid 参数：{generateUidList(newCase.chainConfig.accountGroup)}
                        </div>
                      )}
                    </div>

                    {/* 参数文件上传 */}
                    <div className="space-y-2">
                      <Label htmlFor="parameter-file">参数文件</Label>
                      <Input
                        id="parameter-file"
                        type="file"
                        accept=".json,.csv,.txt"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          setNewCase({ 
                            ...newCase, 
                            chainConfig: { ...newCase.chainConfig, parameterFile: file }
                          })
                        }}
                      />
                      <div className="text-xs text-muted-foreground">
                        支持JSON、CSV、TXT格式文件，用于提供额外参数
                      </div>
                      {newCase.chainConfig.parameterFile && (
                        <div className="text-sm text-green-600">
                          已选择文件: {newCase.chainConfig.parameterFile.name}
                        </div>
                      )}
                    </div>

                    {/* 全局变量定义 */}
                    <div className="space-y-2">
                      <Label htmlFor="global-variables">全局变量</Label>
                      <Textarea
                        id="global-variables"
                        placeholder='全局变量会自动包含uid参数，您可以添加其他变量，例如: {"baseUrl": "https://api.example.com", "timeout": 5000}'
                        value={newCase.chainConfig.globalVariables}
                        onChange={(e) => setNewCase({ 
                          ...newCase, 
                          chainConfig: { ...newCase.chainConfig, globalVariables: e.target.value }
                        })}
                        className="font-mono text-sm"
                        rows={6}
                      />
                      <div className="text-xs text-muted-foreground">
                        选择账号组后会自动生成 uid 参数（Python列表格式），在接口参数中可使用 ${"{uid}"} 引用该列表
                      </div>
                    </div>

                    {/* 攻击次数和QPS */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="attack-count">攻击次数</Label>
                        <Input
                          id="attack-count"
                          type="number"
                          min="1"
                          value={newCase.attackCount}
                          onChange={(e) => setNewCase({ ...newCase, attackCount: parseInt(e.target.value) || 1 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="qps">QPS</Label>
                        <Input
                          id="qps"
                          type="number"
                          min="1"
                          value={newCase.qps}
                          onChange={(e) => setNewCase({ ...newCase, qps: parseInt(e.target.value) || 60 })}
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* 服务类型选择 */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>服务类型</Label>
                  <Select 
                    value={newCase.serviceType} 
                    onValueChange={(value) => setNewCase({ ...newCase, serviceType: value as "IM" | "HTTP", apiInterface: "" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择服务类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IM">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="h-4 w-4" />
                          <span>IM服务</span>
                          <span className="text-xs text-muted-foreground">即时通讯相关接口</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="HTTP">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <span>HTTP服务</span>
                          <span className="text-xs text-muted-foreground">HTTP API接口</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* IM服务的API接口选择 */}
                {newCase.serviceType === "IM" && (
                  <div className="space-y-2">
                    <Label>API接口</Label>
                    <Select 
                      value={newCase.apiInterface} 
                      onValueChange={(value) => setNewCase({ ...newCase, apiInterface: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择IM接口" />
                      </SelectTrigger>
                      <SelectContent>
                        {IM_INTERFACES.map((interface_) => (
                          <SelectItem key={interface_.id} value={interface_.name}>
                            <div className="flex items-center space-x-2">
                              <span>{interface_.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ({interface_.description})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* HTTP服务配置 */}
                {newCase.serviceType === "HTTP" && (
                  <div className="space-y-6 p-4 border rounded-lg bg-muted/30">
                    <h3 className="text-lg font-medium">HTTP接口配置</h3>
                    
                    {/* URL选择方式 */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Label>URL配置方式</Label>
                        <div className="flex space-x-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              checked={!showCustomUrl}
                              onChange={() => setShowCustomUrl(false)}
                              className="form-radio"
                            />
                            <span className="text-sm">从预设选择</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              checked={showCustomUrl}
                              onChange={() => setShowCustomUrl(true)}
                              className="form-radio"
                            />
                            <span className="text-sm">自定义URL</span>
                          </label>
                        </div>
                      </div>

                      {/* 预设URL树状选择 */}
                      {!showCustomUrl && (
                        <div className="space-y-2">
                          <Label>选择接口</Label>
                          <div className="border rounded-md p-2 bg-background max-h-64 overflow-y-auto">
                            {selectedUrlNode ? (
                              <div className="mb-2 p-2 bg-primary/10 border border-primary/20 rounded-md">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">
                                    已选择: {URL_TREE.flatMap(node => findAllNodes(node)).find(n => n.id === selectedUrlNode)?.name}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedUrlNode("")
                                      setHttpUrl("")
                                      setNewCase({ ...newCase, apiInterface: "" })
                                    }}
                                  >
                                    清除选择
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="mb-2 text-sm text-muted-foreground">
                                点击下方展开文件夹并选择接口
                              </div>
                            )}
                            <div className="space-y-1">
                              {URL_TREE.map(node => renderTreeNode(node))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* URL和方法配置 */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-3 space-y-2">
                        <Label htmlFor="http-url">接口URL</Label>
                        <Input
                          id="http-url"
                          placeholder="https://api.example.com/endpoint"
                          value={httpUrl}
                          onChange={(e) => {
                            setHttpUrl(e.target.value)
                            try {
                              const headersObj = JSON.parse(httpHeaders)
                              setNewCase({
                                ...newCase,
                                parameters: JSON.stringify({
                                  url: e.target.value,
                                  method: httpMethod,
                                  headers: headersObj,
                                  body: httpBody,
                                  signature: selectedSignature
                                }, null, 2)
                              })
                            } catch (error) {
                              // JSON格式错误时不更新参数
                            }
                          }}
                          disabled={!showCustomUrl && !selectedUrlNode}
                        />
                        {!showCustomUrl && !selectedUrlNode && (
                          <div className="text-xs text-muted-foreground">
                            请先从上方选择预设接口，或切换到自定义URL模式
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="http-method">请求方法</Label>
                        <Select value={httpMethod} onValueChange={(value) => {
                          setHttpMethod(value as "GET" | "POST")
                          if (value === "GET") {
                            setHttpBody("")
                          }
                          try {
                            const headersObj = JSON.parse(httpHeaders)
                            setNewCase({
                              ...newCase,
                              parameters: JSON.stringify({
                                url: httpUrl,
                                method: value,
                                headers: headersObj,
                                body: value === "GET" ? "" : httpBody,
                                signature: selectedSignature
                              }, null, 2)
                            })
                          } catch (error) {
                            // JSON格式错误时不更新参数
                          }
                        }}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="POST">POST</SelectItem>
                            <SelectItem value="GET">GET</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* 请求头配置 */}
                    <div className="space-y-2">
                      <Label htmlFor="http-headers">请求头配置 (JSON格式)</Label>
                      <Textarea
                        id="http-headers"
                        value={httpHeaders}
                        onChange={(e) => handleHttpHeadersChange(e.target.value)}
                        placeholder='{"Content-Type": "application/json", "Authorization": "Bearer token"}'
                        className="font-mono text-sm"
                        rows={6}
                      />
                      {httpHeadersError && (
                        <div className="text-xs text-red-600">
                          {httpHeadersError}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        请输入有效的JSON格式，例如: {`{"Content-Type": "application/json", "User-Agent": "MyApp/1.0"}`}
                      </div>
                    </div>

                    {/* 请求体配置 */}
                    {httpMethod === "POST" && (
                      <div className="space-y-2">
                        <Label htmlFor="http-body">请求体 (JSON格式)</Label>
                        <Textarea
                          id="http-body"
                          value={httpBody}
                          onChange={(e) => {
                            setHttpBody(e.target.value)
                            try {
                              const headersObj = JSON.parse(httpHeaders)
                              setNewCase({
                                ...newCase,
                                parameters: JSON.stringify({
                                  url: httpUrl,
                                  method: httpMethod,
                                  headers: headersObj,
                                  body: e.target.value,
                                  signature: selectedSignature
                                }, null, 2)
                              })
                            } catch (error) {
                              // JSON格式错误时不更新参数
                            }
                          }}
                          placeholder='例如: {"username": "${username}", "password": "${password}"}'
                          className="font-mono text-sm"
                          rows={6}
                        />
                        <div className="text-xs text-muted-foreground">
                          支持JSON格式，可以使用变量引用如 ${"{uid}"}。选择平台接口时会自动填充模板。
                        </div>
                      </div>
                    )}

                    {/* 签名选项配置 */}
                    <div className="space-y-2">
                      <Label htmlFor="signature-select">签名选项</Label>
                      <Select value={selectedSignature} onValueChange={handleSignatureChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择签名类型（可选）" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">无签名</SelectItem>
                          <SelectItem value="sig">sig</SelectItem>
                          <SelectItem value="sig3">sig3</SelectItem>
                          <SelectItem value="NStokensig">NStokensig</SelectItem>
                          <SelectItem value="kuaishou">快手验签</SelectItem>
                          <SelectItem value="custom">自定义验签</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-xs text-muted-foreground">
                        选择接口签名验证方式，用于安全认证
                      </div>
                    </div>

                    {/* 自定义接口模板提示 */}
                    {!newCase.apiInterface && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                        <div className="text-sm font-medium text-blue-800 mb-2">自定义接口模板参考</div>
                        <div className="text-xs text-blue-600 space-y-1">
                          <div><strong>URL示例:</strong> https://api.example.com/login</div>
                          <div><strong>请求头示例:</strong> Content-Type: application/json, Authorization: Bearer token</div>
                          <div><strong>请求体示例:</strong> {`{"username": "\${username}", "password": "\${password}"}`}</div>
                          <div><strong>签名示例:</strong> 选择适合的签名类型进行接口验证</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* IM服务参数输入 */}
                {newCase.serviceType === "IM" && (
                  <div className="space-y-2">
                    <Label htmlFor="case-parameters">接口参数 (JSON格式)</Label>
                    <Textarea
                      id="case-parameters"
                      placeholder={newCase.apiInterface ? '例如: {"userId": "123", "message": "测试消息"}' : '请先选择API接口后输入参数'}
                      value={newCase.parameters}
                      onChange={(e) => setNewCase({ ...newCase, parameters: e.target.value })}
                      className="font-mono text-sm"
                      rows={6}
                      disabled={!newCase.apiInterface}
                    />
                    <div className="text-xs text-muted-foreground">
                      {newCase.apiInterface ? "请输入有效的JSON格式参数" : "选择API接口后可输入相应的参数"}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={handleCreateCase} className="gap-2">
                  <Plus className="h-4 w-4" />
                  创建用例
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 用例列表标签页 */}
        <TabsContent value="list">
          {editingCase ? (
            // 编辑模式
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>编辑攻击用例</CardTitle>
                <div className="space-x-2">
                  <Button variant="outline" onClick={handleCancelEdit}>
                    取消
                  </Button>
                  <Button onClick={handleSaveEdit}>
                    保存
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 基本信息 */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-case-name">用例名称</Label>
                    <Input
                      id="edit-case-name"
                      placeholder="输入用例名称"
                      value={editCase.name}
                      onChange={(e) => setEditCase({ ...editCase, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-case-description">用例描述</Label>
                    <Textarea
                      id="edit-case-description"
                      placeholder="输入用例描述（可选）"
                      value={editCase.description}
                      onChange={(e) => setEditCase({ ...editCase, description: e.target.value })}
                    />
                  </div>
                </div>

                {/* 链路级配置 */}
                <Collapsible defaultOpen>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        链路级配置
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-4">
                    <div className="border rounded-lg p-4 space-y-4">
                      {/* 账号组选择 */}
                      <div className="space-y-2">
                        <Label>链路账号组</Label>
                        <Select 
                          value={editCase.chainConfig.accountGroup} 
                          onValueChange={(value) => {
                            const updatedGlobalVars = updateGlobalVariables(value)
                            setEditCase({ 
                              ...editCase, 
                              chainConfig: { 
                                ...editCase.chainConfig, 
                                accountGroup: value,
                                globalVariables: updatedGlobalVars
                              }
                            })
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="选择链路账号组" />
                          </SelectTrigger>
                          <SelectContent>
                            {accountGroups.map((group) => (
                              <SelectItem key={group.id} value={group.name}>
                                {group.name} ({group.accountCount}个账号)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {editCase.chainConfig.accountGroup && (
                          <div className="text-sm text-blue-600">
                            已自动生成 uid 参数：{generateUidList(editCase.chainConfig.accountGroup)}
                          </div>
                        )}
                      </div>

                      {/* 参数文件上传 */}
                      <div className="space-y-2">
                        <Label htmlFor="edit-parameter-file">参数文件</Label>
                        <Input
                          id="edit-parameter-file"
                          type="file"
                          accept=".json,.csv,.txt"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            setEditCase({ 
                              ...editCase, 
                              chainConfig: { ...editCase.chainConfig, parameterFile: file }
                            })
                          }}
                        />
                        <div className="text-xs text-muted-foreground">
                          支持JSON、CSV、TXT格式文件，用于提供额外参数
                        </div>
                        {editCase.chainConfig.parameterFile && (
                          <div className="text-sm text-green-600">
                            已选择文件: {editCase.chainConfig.parameterFile.name}
                          </div>
                        )}
                      </div>

                      {/* 全局变量定义 */}
                      <div className="space-y-2">
                        <Label htmlFor="edit-global-variables">全局变量</Label>
                        <Textarea
                          id="edit-global-variables"
                          placeholder='全局变量会自动包含uid参数，您可以添加其他变量，例如: {"baseUrl": "https://api.example.com", "timeout": 5000}'
                          value={editCase.chainConfig.globalVariables}
                          onChange={(e) => setEditCase({ 
                            ...editCase, 
                            chainConfig: { ...editCase.chainConfig, globalVariables: e.target.value }
                          })}
                          className="font-mono text-sm"
                          rows={6}
                        />
                        <div className="text-xs text-muted-foreground">
                          选择账号组后会自动生成 uid 参数（Python列表格式），在接口参数中可使用 ${"uid"} 引用该列表
                        </div>
                      </div>

                      {/* 攻击次数和QPS */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-attack-count">攻击次数</Label>
                          <Input
                            id="edit-attack-count"
                            type="number"
                            min="1"
                            value={editCase.attackCount}
                            onChange={(e) => setEditCase({ ...editCase, attackCount: parseInt(e.target.value) || 1 })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-qps">QPS</Label>
                          <Input
                            id="edit-qps"
                            type="number"
                            min="1"
                            value={editCase.qps}
                            onChange={(e) => setEditCase({ ...editCase, qps: parseInt(e.target.value) || 60 })}
                          />
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* 服务类型选择 */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>服务类型</Label>
                    <Select 
                      value={editCase.serviceType} 
                      onValueChange={(value) => setEditCase({ ...editCase, serviceType: value as "IM" | "HTTP", apiInterface: "" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择服务类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IM">
                          <div className="flex items-center space-x-2">
                            <MessageSquare className="h-4 w-4" />
                            <span>IM服务</span>
                            <span className="text-xs text-muted-foreground">即时通讯相关接口</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="HTTP">
                          <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4" />
                            <span>HTTP服务</span>
                            <span className="text-xs text-muted-foreground">HTTP API接口</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* API接口选择 */}
                  <div className="space-y-2">
                    <Label>API接口</Label>
                    <Select 
                      value={editCase.apiInterface} 
                      onValueChange={(value) => setEditCase({ ...editCase, apiInterface: value })}
                      disabled={!editCase.serviceType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={editCase.serviceType ? "选择API接口" : "请先选择服务类型"} />
                      </SelectTrigger>
                      <SelectContent>
                        {(editCase.serviceType === "IM" ? IM_INTERFACES : HTTP_INTERFACES).map((interface_) => (
                          <SelectItem key={interface_.id} value={interface_.name}>
                            <div className="flex items-center space-x-2">
                              <span>{interface_.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ({interface_.description})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!editCase.serviceType && (
                      <div className="text-xs text-muted-foreground">
                        请先选择服务类型以查看可用的API接口
                      </div>
                    )}
                  </div>

                  {/* 参数输入 */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-case-parameters">接口参数 (JSON格式)</Label>
                    <Textarea
                      id="edit-case-parameters"
                      placeholder={editCase.apiInterface ? '例如: {"userId": "123", "message": "测试消息"}' : '请先选择API接口后输入参数'}
                      value={editCase.parameters}
                      onChange={(e) => setEditCase({ ...editCase, parameters: e.target.value })}
                      className="font-mono text-sm"
                      rows={6}
                      disabled={!editCase.apiInterface}
                    />
                    <div className="text-xs text-muted-foreground">
                      {editCase.apiInterface ? "请输入有效的JSON格式参数" : "选择API接口后可输入相应的参数"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
          <div className="space-y-6">
            {/* 搜索和筛选 */}
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="搜索用例名称或接口名..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="筛选服务类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="IM">IM服务</SelectItem>
                  <SelectItem value="HTTP">HTTP服务</SelectItem>
                </SelectContent>
              </Select>
              {selectedCases.length > 0 && (
                <Button variant="outline" onClick={handleBatchDeleteCases}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  删除选中 ({selectedCases.length})
                </Button>
              )}
            </div>

            {/* 用例列表 */}
            <Card>
              <CardHeader>
                <CardTitle>攻击用例列表</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedCases.length === paginatedCases.length && paginatedCases.length > 0}
                          onCheckedChange={handleSelectAllCases}
                        />
                      </TableHead>
                      <TableHead>用例名称</TableHead>
                      <TableHead>服务类型</TableHead>
                      <TableHead>API接口</TableHead>
                      <TableHead>QPS</TableHead>
                      <TableHead>创建时间</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCases.map((case_) => (
                      <TableRow key={case_.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedCases.includes(case_.id)}
                            onCheckedChange={(checked) => handleSelectCase(case_.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{case_.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {case_.serviceType ? getServiceTypeIcon(case_.serviceType) : <Target className="h-4 w-4" />}
                            <span>{case_.serviceType || "旧格式"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span title={case_.apiInterface}>
                            {getInterfaceDisplayName(case_.apiInterface)}
                          </span>
                        </TableCell>
                        <TableCell>{case_.qps}</TableCell>
                        <TableCell>{case_.createdAt}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditCase(case_)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteCase(case_.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* 分页 */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      显示 {startIndex + 1}-{Math.min(endIndex, filteredCases.length)} 条，共 {filteredCases.length} 条
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm">
                        {currentPage} / {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 删除确认对话框 */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <p>您确定要删除这个攻击用例吗？此操作无法撤销。</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              删除
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}