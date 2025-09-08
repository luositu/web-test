"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Plus,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  User,
  FileSpreadsheet,
  UserPlus,
  Users,
  FolderPlus,
  CheckSquare,
  Square,
  ChevronDown,
  LogIn,
  Key,
  MessageSquare,
} from "lucide-react"

interface Account {
  id: string
  uid: string
  sixin_st: string
  salt: string
  did: string
  createdAt: string
  groupId: string
}

interface AccountGroup {
  id: string
  name: string
  description: string
  accountCount: number
  createdAt: string
}

export function AccountManagement() {
  const [accountGroups, setAccountGroups] = useState<AccountGroup[]>([
    {
      id: "group1",
      name: "测试组A",
      description: "主要测试账号组",
      accountCount: 2,
      createdAt: "2024-01-10",
    },
    {
      id: "group2",
      name: "测试组B",
      description: "备用测试账号组",
      accountCount: 1,
      createdAt: "2024-01-12",
    },
    {
      id: "group3",
      name: "演练组C",
      description: "专项演练账号组",
      accountCount: 0,
      createdAt: "2024-01-15",
    },
  ])

  const [selectedGroupId, setSelectedGroupId] = useState<string>("group1")
  const [showGroupForm, setShowGroupForm] = useState(false)
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
  })

  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: "1",
      uid: "4683494726",
      sixin_st: "ChrdWFpc2hvdS5zaXhpbi5sb2dpbi5zZXJ2aWNlLkFuZHJvaWRMb2dpblNlcnZpY2U=",
      salt: "ANDROID_2d0298105c3618d6",
      did: "ANDROID_2d0298105c3618d6",
      createdAt: "2024-01-10 09:00",
      groupId: "group1",
    },
    {
      id: "2",
      uid: "2766034668",
      sixin_st: "_mt_1Nv_e3YPq63d4fwtrYWp7etWFBap ds0jLSTYtKUHI0exPuajjw==",
      salt: "ANDROID_eeeeeeee000sixin",
      did: "ANDROID_eeeeeeee000sixin",
      createdAt: "2024-01-12 11:20",
      groupId: "group1",
    },
    {
      id: "3",
      uid: "2766034669",
      sixin_st: "_mt_1Nv_e3YPq63d4fwtrYWp7etWFBap C97XyC1qhhfRFOcCQyVp5g==",
      salt: "ANDROID_eeeeeeee001sixin",
      did: "ANDROID_eeeeeeee001sixin",
      createdAt: "2024-01-08 15:30",
      groupId: "group2",
    },
  ])

  const filteredAccounts = accounts.filter((account) => account.groupId === selectedGroupId)
  const selectedGroup = accountGroups.find((group) => group.id === selectedGroupId)

  const [importMode, setImportMode] = useState<"single" | "xlsx" | "login">("single")
  const [xlsxFile, setXlsxFile] = useState<File | null>(null)
  const [loginMode, setLoginMode] = useState<"password" | "sms">("password")
  const [loginAccount, setLoginAccount] = useState({
    phone: "",
    password: "",
    smsCode: "",
  })

  const [newAccount, setNewAccount] = useState({
    uid: "",
    sixin_st: "",
    salt: "",
    did: "",
  })

  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [editingAccount, setEditingAccount] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    uid: "",
    sixin_st: "",
    salt: "",
    did: "",
  })

  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [dragOverItem, setDragOverItem] = useState<string | null>(null)
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false)

  const { toast } = useToast()

  const handleCreateGroup = () => {
    if (newGroup.name.trim()) {
      const group: AccountGroup = {
        id: `group${Date.now()}`,
        name: newGroup.name,
        description: newGroup.description,
        accountCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setAccountGroups([...accountGroups, group])
      setNewGroup({ name: "", description: "" })
      setShowGroupForm(false)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAccounts(filteredAccounts.map((account) => account.id))
    } else {
      setSelectedAccounts([])
    }
  }

  const handleSelectAccount = (accountId: string, checked: boolean) => {
    if (checked) {
      setSelectedAccounts([...selectedAccounts, accountId])
    } else {
      setSelectedAccounts(selectedAccounts.filter((id) => id !== accountId))
    }
  }

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account.id)
    setEditForm({
      uid: account.uid,
      sixin_st: account.sixin_st,
      salt: account.salt,
      did: account.did,
    })
  }

  const handleSaveEdit = () => {
    if (editingAccount) {
      setAccounts(accounts.map((account) => (account.id === editingAccount ? { ...account, ...editForm } : account)))
      setEditingAccount(null)
      setEditForm({ uid: "", sixin_st: "", salt: "", did: "" })
    }
  }

  const handleCancelEdit = () => {
    setEditingAccount(null)
    setEditForm({ uid: "", sixin_st: "", salt: "", did: "" })
  }

  const handleDeleteAccount = (accountId: string) => {
    setAccounts(accounts.filter((account) => account.id !== accountId))
    setSelectedAccounts(selectedAccounts.filter((id) => id !== accountId))
  }

  const handleBatchDelete = () => {
    if (selectedAccounts.length === 0) {
      toast({
        title: "删除失败",
        description: "请先选择要删除的账号",
        variant: "destructive",
      })
      return
    }

    const confirmDelete = window.confirm(`确定要删除选中的 ${selectedAccounts.length} 个账号吗？此操作不可撤销。`)

    if (confirmDelete) {
      const deletedCount = selectedAccounts.length
      setAccounts(accounts.filter((account) => !selectedAccounts.includes(account.id)))

      setAccountGroups(
        accountGroups.map((group) =>
          group.id === selectedGroupId
            ? { ...group, accountCount: Math.max(0, group.accountCount - deletedCount) }
            : group,
        ),
      )

      setSelectedAccounts([])

      toast({
        title: "删除成功",
        description: `已成功删除 ${deletedCount} 个账号`,
      })
    }
  }

  const handleSingleUserImport = async () => {
    if (!newAccount.uid.trim() || !newAccount.sixin_st.trim() || !newAccount.salt.trim() || !newAccount.did.trim()) {
      toast({
        title: "添加失败",
        description: "请填写所有必填字段",
        variant: "destructive",
      })
      return
    }

    try {
      const accountToAdd: Account = {
        id: `account_${Date.now()}`,
        uid: newAccount.uid.trim(),
        sixin_st: newAccount.sixin_st.trim(),
        salt: newAccount.salt.trim(),
        did: newAccount.did.trim(),
        createdAt: new Date().toLocaleString("zh-CN"),
        groupId: selectedGroupId,
      }

      setAccounts([...accounts, accountToAdd])
      setAccountGroups(
        accountGroups.map((group) =>
          group.id === selectedGroupId ? { ...group, accountCount: group.accountCount + 1 } : group,
        ),
      )

      setNewAccount({
        uid: "",
        sixin_st: "",
        salt: "",
        did: "",
      })

      toast({
        title: "添加成功",
        description: `账号已成功添加到 ${selectedGroup?.name}`,
      })
    } catch (error) {
      toast({
        title: "添加失败",
        description: "添加账号时发生错误，请重试",
        variant: "destructive",
      })
    }
  }

  const handleXlsxImport = async () => {
    if (!xlsxFile) {
      toast({
        title: "导入失败",
        description: "请先选择XLSX文件",
        variant: "destructive",
      })
      return
    }

    try {
      toast({
        title: "导入成功",
        description: `XLSX文件已成功导入到 ${selectedGroup?.name}`,
      })

      setXlsxFile(null)
    } catch (error) {
      toast({
        title: "导入失败",
        description: "导入XLSX文件时发生错误，请检查文件格式",
        variant: "destructive",
      })
    }
  }

  const handleLoginImport = async () => {
    if (loginMode === "password") {
      if (!loginAccount.phone.trim() || !loginAccount.password.trim()) {
        toast({
          title: "登录失败",
          description: "请填写手机号和密码",
          variant: "destructive",
        })
        return
      }
    } else {
      if (!loginAccount.phone.trim() || !loginAccount.smsCode.trim()) {
        toast({
          title: "登录失败",
          description: "请填写手机号和验证码",
          variant: "destructive",
        })
        return
      }
    }

    try {
      const accountToAdd: Account = {
        id: `account_${Date.now()}`,
        uid: `${Date.now()}`,
        sixin_st: `login_token_${Date.now()}`,
        salt: `salt_${Math.random().toString(36).substr(2, 9)}`,
        did: `ANDROID_${Math.random().toString(36).substr(2, 16)}`,
        createdAt: new Date().toLocaleString("zh-CN"),
        groupId: selectedGroupId,
      }

      setAccounts([...accounts, accountToAdd])
      setAccountGroups(
        accountGroups.map((group) =>
          group.id === selectedGroupId ? { ...group, accountCount: group.accountCount + 1 } : group,
        ),
      )

      setLoginAccount({
        phone: "",
        password: "",
        smsCode: "",
      })

      toast({
        title: "登录成功",
        description: `账号已成功添加到 ${selectedGroup?.name}`,
      })
    } catch (error) {
      toast({
        title: "登录失败",
        description: "登录时发生错误，请重试",
        variant: "destructive",
      })
    }
  }

  const handleSendSmsCode = async () => {
    if (!loginAccount.phone.trim()) {
      toast({
        title: "发送失败",
        description: "请先输入手机号",
        variant: "destructive",
      })
      return
    }

    try {
      toast({
        title: "发送成功",
        description: "验证码已发送到您的手机",
      })
    } catch (error) {
      toast({
        title: "发送失败",
        description: "发送验证码失败，请重试",
        variant: "destructive",
      })
    }
  }

  const handleDragStart = (e: React.DragEvent, accountId: string) => {
    setDraggedItem(accountId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, accountId: string) => {
    e.preventDefault()
    setDragOverItem(accountId)
  }

  const handleDragLeave = () => {
    setDragOverItem(null)
  }

  const handleDrop = (e: React.DragEvent, targetAccountId: string) => {
    e.preventDefault()

    if (draggedItem && draggedItem !== targetAccountId) {
      const draggedIndex = filteredAccounts.findIndex((acc) => acc.id === draggedItem)
      const targetIndex = filteredAccounts.findIndex((acc) => acc.id === targetAccountId)

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newAccounts = [...accounts]
        const allFilteredAccounts = [...filteredAccounts]

        const [draggedAccount] = allFilteredAccounts.splice(draggedIndex, 1)
        allFilteredAccounts.splice(targetIndex, 0, draggedAccount)

        const otherAccounts = newAccounts.filter((acc) => acc.groupId !== selectedGroupId)
        const reorderedAccounts = [...otherAccounts, ...allFilteredAccounts]

        setAccounts(reorderedAccounts)
      }
    }

    setDraggedItem(null)
    setDragOverItem(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverItem(null)
  }

  return (
    <div className="space-y-6 min-w-[1200px]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">账号管理</h2>
          <p className="text-muted-foreground mt-2">管理演练测试账号和配置信息</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Users className="mr-2 h-5 w-5" />
            账号组管理
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Label htmlFor="group-select" className="text-sm font-medium">
                当前账号组：
              </Label>
              <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-64 justify-between bg-transparent">
                    <span>{selectedGroup?.name || "选择账号组"}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>选择账号组</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {accountGroups.map((group) => (
                      <div
                        key={group.id}
                        className={`
                          p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                          ${
                            selectedGroupId === group.id
                              ? "border-primary bg-primary/10 shadow-md"
                              : "border-border bg-background hover:border-primary/50 hover:bg-primary/5"
                          }
                        `}
                        onClick={() => {
                          setSelectedGroupId(group.id)
                          setIsGroupDialogOpen(false)
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`
                                  w-4 h-4 rounded-full border-2 flex items-center justify-center
                                  ${
                                    selectedGroupId === group.id
                                      ? "border-primary bg-primary"
                                      : "border-muted-foreground"
                                  }
                                `}
                              >
                                {selectedGroupId === group.id && <div className="w-2 h-2 bg-white rounded-full" />}
                              </div>
                              <div>
                                <h4 className="font-medium text-foreground">{group.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-sm text-muted-foreground">账号数量</div>
                            <div className="text-lg font-bold text-primary">{group.accountCount}</div>
                            <div className="text-xs text-muted-foreground">创建于 {group.createdAt}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowGroupForm(!showGroupForm)}>
              <FolderPlus className="mr-2 h-4 w-4" />
              新建账号组
            </Button>
          </div>

          {selectedGroup && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">{selectedGroup.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedGroup.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">账号数量</div>
                  <div className="text-2xl font-bold text-primary">{filteredAccounts.length}</div>
                </div>
              </div>
            </div>
          )}

          {showGroupForm && (
            <div className="mt-4 p-4 border rounded-lg space-y-4">
              <h4 className="font-medium text-foreground">创建新账号组</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="group-name">组名称</Label>
                  <Input
                    id="group-name"
                    placeholder="输入账号组名称"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="group-desc">组描述</Label>
                  <Input
                    id="group-desc"
                    placeholder="输入账号组描述"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleCreateGroup}>
                  <Plus className="mr-2 h-4 w-4" />
                  创建
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowGroupForm(false)}>
                  取消
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 h-12 p-1 bg-muted/50 rounded-lg border">
          <TabsTrigger
            value="accounts"
            className="h-10 px-6 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-primary/20 hover:bg-white/50 hover:text-foreground"
          >
            <User className="mr-2 h-4 w-4" />
            账号列表
          </TabsTrigger>
          <TabsTrigger
            value="import"
            className="h-10 px-6 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-primary/20 hover:bg-white/50 hover:text-foreground"
          >
            <Upload className="mr-2 h-4 w-4" />
            账号添加
          </TabsTrigger>
          <TabsTrigger
            value="export"
            className="h-10 px-6 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-primary/20 hover:bg-white/50 hover:text-foreground"
          >
            <Download className="mr-2 h-4 w-4" />
            配置导出
          </TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4 min-h-[600px]">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-foreground">
                  <User className="mr-2 h-5 w-5" />
                  {selectedGroup?.name} - 测试账号列表
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBatchDelete}
                    disabled={selectedAccounts.length === 0}
                    className={`${
                      selectedAccounts.length === 0
                        ? "opacity-50 cursor-not-allowed"
                        : "text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent border-destructive/20"
                    }`}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    批量删除 {selectedAccounts.length > 0 && `(${selectedAccounts.length})`}
                  </Button>
                  {selectedAccounts.length > 0 && (
                    <Button variant="outline" size="sm" onClick={() => setSelectedAccounts([])}>
                      取消选择
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16 text-center">序号</TableHead>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={filteredAccounts.length > 0 && selectedAccounts.length === filteredAccounts.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="w-32">UID</TableHead>
                      <TableHead className="w-80">Sixin_ST</TableHead>
                      <TableHead className="w-60">Salt</TableHead>
                      <TableHead className="w-60">DID</TableHead>
                      <TableHead className="w-32">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.map((account, index) => (
                      <TableRow
                        key={account.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, account.id)}
                        onDragOver={(e) => handleDragOver(e, account.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, account.id)}
                        onDragEnd={handleDragEnd}
                        className={`
                          cursor-move transition-all duration-200
                          ${draggedItem === account.id ? "opacity-50" : ""}
                          ${dragOverItem === account.id ? "bg-primary/10 border-primary/20" : ""}
                          hover:bg-muted/50
                        `}
                      >
                        <TableCell className="w-16 text-center font-medium text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell className="w-12">
                          <Checkbox
                            checked={selectedAccounts.includes(account.id)}
                            onCheckedChange={(checked) => handleSelectAccount(account.id, checked as boolean)}
                          />
                        </TableCell>
                        {editingAccount === account.id ? (
                          <>
                            <TableCell className="w-32">
                              <Input
                                value={editForm.uid}
                                onChange={(e) => setEditForm({ ...editForm, uid: e.target.value })}
                                className="h-8"
                              />
                            </TableCell>
                            <TableCell className="w-80">
                              <Textarea
                                value={editForm.sixin_st}
                                onChange={(e) => setEditForm({ ...editForm, sixin_st: e.target.value })}
                                className="h-8 resize-none"
                                rows={1}
                              />
                            </TableCell>
                            <TableCell className="w-60">
                              <Input
                                value={editForm.salt}
                                onChange={(e) => setEditForm({ ...editForm, salt: e.target.value })}
                                className="h-8"
                              />
                            </TableCell>
                            <TableCell className="w-60">
                              <Input
                                value={editForm.did}
                                onChange={(e) => setEditForm({ ...editForm, did: e.target.value })}
                                className="h-8"
                              />
                            </TableCell>
                            <TableCell className="w-32">
                              <div className="flex items-center space-x-1">
                                <Button variant="ghost" size="sm" onClick={handleSaveEdit}>
                                  <CheckSquare className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                                  <Square className="h-4 w-4 text-gray-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="font-medium w-32">{account.uid}</TableCell>
                            <TableCell className="w-80 truncate" title={account.sixin_st}>
                              {account.sixin_st}
                            </TableCell>
                            <TableCell className="w-60 truncate" title={account.salt}>
                              {account.salt}
                            </TableCell>
                            <TableCell className="w-60 truncate" title={account.did}>
                              {account.did}
                            </TableCell>
                            <TableCell className="w-32">
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleEditAccount(account)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteAccount(account.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                    {filteredAccounts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          当前账号组暂无账号，请通过账号添加功能添加账号
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 text-sm text-muted-foreground text-center">
                💡 提示：可以拖拽表格行来调整账号顺序
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-4 min-h-[600px]">
          <div className="w-full">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Upload className="mr-2 h-5 w-5" />
                  账号添加
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    <Label className="text-sm font-medium text-foreground">导入到账号组：</Label>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-64 justify-between bg-transparent">
                          <span>{selectedGroup?.name || "选择目标账号组"}</span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>选择目标账号组</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {accountGroups.map((group) => (
                            <div
                              key={group.id}
                              className={`
                                p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                                ${
                                  selectedGroupId === group.id
                                    ? "border-primary bg-primary/10 shadow-md"
                                    : "border-border bg-background hover:border-primary/50 hover:bg-primary/5"
                                }
                              `}
                              onClick={() => setSelectedGroupId(group.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3">
                                    <div
                                      className={`
                                        w-4 h-4 rounded-full border-2 flex items-center justify-center
                                        ${
                                          selectedGroupId === group.id
                                            ? "border-primary bg-primary"
                                            : "border-muted-foreground"
                                        }
                                      `}
                                    >
                                      {selectedGroupId === group.id && (
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                      )}
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-foreground">{group.name}</h4>
                                      <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right ml-4">
                                  <div className="text-sm text-muted-foreground">账号数量</div>
                                  <div className="text-lg font-bold text-primary">{group.accountCount}</div>
                                  <div className="text-xs text-muted-foreground">创建于 {group.createdAt}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-foreground">导入模式：</span>
                    <div className="flex items-center space-x-4">
                      <div
                        className={`
                          relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 min-w-[140px]
                          ${
                            importMode === "single"
                              ? "border-primary bg-primary/10 shadow-md"
                              : "border-border bg-background hover:border-primary/50 hover:bg-primary/5"
                          }
                        `}
                        onClick={() => setImportMode("single")}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <UserPlus
                            className={`h-6 w-6 ${importMode === "single" ? "text-primary" : "text-muted-foreground"}`}
                          />
                          <span
                            className={`text-sm font-medium ${importMode === "single" ? "text-primary" : "text-foreground"}`}
                          >
                            单用户导入
                          </span>
                        </div>
                        {importMode === "single" && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <CheckSquare className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>

                      <div
                        className={`
                          relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 min-w-[140px]
                          ${
                            importMode === "xlsx"
                              ? "border-primary bg-primary/10 shadow-md"
                              : "border-border bg-background hover:border-primary/50 hover:bg-primary/5"
                          }
                        `}
                        onClick={() => setImportMode("xlsx")}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <FileSpreadsheet
                            className={`h-6 w-6 ${importMode === "xlsx" ? "text-primary" : "text-muted-foreground"}`}
                          />
                          <span
                            className={`text-sm font-medium ${importMode === "xlsx" ? "text-primary" : "text-foreground"}`}
                          >
                            XLSX文件导入
                          </span>
                        </div>
                        {importMode === "xlsx" && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <CheckSquare className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>

                      <div
                        className={`
                          relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 min-w-[140px]
                          ${
                            importMode === "login"
                              ? "border-primary bg-primary/10 shadow-md"
                              : "border-border bg-background hover:border-primary/50 hover:bg-primary/5"
                          }
                        `}
                        onClick={() => setImportMode("login")}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <LogIn
                            className={`h-6 w-6 ${importMode === "login" ? "text-primary" : "text-muted-foreground"}`}
                          />
                          <span
                            className={`text-sm font-medium ${importMode === "login" ? "text-primary" : "text-foreground"}`}
                          >
                            登录导入
                          </span>
                        </div>
                        {importMode === "login" && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <CheckSquare className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {importMode === "login" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-foreground">
                          <LogIn className="mr-2 h-5 w-5" />
                          登录导入
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-4">
                          <span className="text-sm font-medium text-foreground">登录方式：</span>
                          <div className="flex items-center space-x-4">
                            <div
                              className={`
                                relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 min-w-[120px]
                                ${
                                  loginMode === "password"
                                    ? "border-primary bg-primary/10 shadow-md"
                                    : "border-border bg-background hover:border-primary/50 hover:bg-primary/5"
                                }
                              `}
                              onClick={() => setLoginMode("password")}
                            >
                              <div className="flex flex-col items-center space-y-1">
                                <Key
                                  className={`h-5 w-5 ${loginMode === "password" ? "text-primary" : "text-muted-foreground"}`}
                                />
                                <span
                                  className={`text-xs font-medium ${loginMode === "password" ? "text-primary" : "text-foreground"}`}
                                >
                                  账密登录
                                </span>
                              </div>
                              {loginMode === "password" && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                  <CheckSquare className="h-3 w-3 text-white" />
                                </div>
                              )}
                            </div>

                            <div
                              className={`
                                relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 min-w-[120px]
                                ${
                                  loginMode === "sms"
                                    ? "border-primary bg-primary/10 shadow-md"
                                    : "border-border bg-background hover:border-primary/50 hover:bg-primary/5"
                                }
                              `}
                              onClick={() => setLoginMode("sms")}
                            >
                              <div className="flex flex-col items-center space-y-1">
                                <MessageSquare
                                  className={`h-5 w-5 ${loginMode === "sms" ? "text-primary" : "text-muted-foreground"}`}
                                />
                                <span
                                  className={`text-xs font-medium ${loginMode === "sms" ? "text-primary" : "text-foreground"}`}
                                >
                                  短信验证码
                                </span>
                              </div>
                              {loginMode === "sms" && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                  <CheckSquare className="h-3 w-3 text-white" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="login-phone">手机号</Label>
                          <Input
                            id="login-phone"
                            placeholder="输入手机号"
                            value={loginAccount.phone}
                            onChange={(e) => setLoginAccount({ ...loginAccount, phone: e.target.value })}
                          />
                        </div>

                        {loginMode === "password" && (
                          <div className="space-y-2">
                            <Label htmlFor="login-password">密码</Label>
                            <Input
                              id="login-password"
                              type="password"
                              placeholder="输入密码"
                              value={loginAccount.password}
                              onChange={(e) => setLoginAccount({ ...loginAccount, password: e.target.value })}
                            />
                          </div>
                        )}

                        {loginMode === "sms" && (
                          <div className="space-y-2">
                            <Label htmlFor="login-sms">验证码</Label>
                            <div className="flex space-x-2">
                              <Input
                                id="login-sms"
                                placeholder="输入验证码"
                                value={loginAccount.smsCode}
                                onChange={(e) => setLoginAccount({ ...loginAccount, smsCode: e.target.value })}
                                className="flex-1"
                              />
                              <Button variant="outline" onClick={handleSendSmsCode}>
                                发送验证码
                              </Button>
                            </div>
                          </div>
                        )}

                        <Button className="w-full bg-primary text-primary-foreground" onClick={handleLoginImport}>
                          <LogIn className="mr-2 h-4 w-4" />
                          登录并添加到 {selectedGroup?.name}
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-foreground">登录预览</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">登录方式:</span>
                            <span className="text-sm text-foreground">
                              {loginMode === "password" ? "账密登录" : "短信验证码登录"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">手机号:</span>
                            <span className="text-sm text-foreground">{loginAccount.phone || "未填写"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">目标账号组:</span>
                            <span className="text-sm text-foreground">{selectedGroup?.name}</span>
                          </div>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">
                            登录成功后将自动获取账号信息并添加到选定的账号组中
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {importMode === "single" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-foreground">
                          <UserPlus className="mr-2 h-5 w-5" />
                          单用户导入
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="account-uid">UID</Label>
                          <Input
                            id="account-uid"
                            placeholder="输入UID"
                            value={newAccount.uid}
                            onChange={(e) => setNewAccount({ ...newAccount, uid: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="account-sixin-st">Sixin_ST</Label>
                          <Textarea
                            id="account-sixin-st"
                            placeholder="输入Sixin_ST"
                            value={newAccount.sixin_st}
                            onChange={(e) => setNewAccount({ ...newAccount, sixin_st: e.target.value })}
                            className="resize-none"
                            rows={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="account-salt">Salt</Label>
                          <Input
                            id="account-salt"
                            placeholder="输入Salt"
                            value={newAccount.salt}
                            onChange={(e) => setNewAccount({ ...newAccount, salt: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="account-did">DID</Label>
                          <Input
                            id="account-did"
                            placeholder="输入DID"
                            value={newAccount.did}
                            onChange={(e) => setNewAccount({ ...newAccount, did: e.target.value })}
                          />
                        </div>
                        <Button className="w-full bg-primary text-primary-foreground" onClick={handleSingleUserImport}>
                          <Plus className="mr-2 h-4 w-4" />
                          添加到 {selectedGroup?.name}
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-foreground">账号预览</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">UID:</span>
                            <span className="text-sm text-foreground">{newAccount.uid || "未填写"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Sixin_ST:</span>
                            <span className="text-sm text-foreground">{newAccount.sixin_st || "未填写"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Salt:</span>
                            <span className="text-sm text-foreground">{newAccount.salt || "未填写"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">DID:</span>
                            <span className="text-sm text-foreground">{newAccount.did || "未填写"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">目标账号组:</span>
                            <span className="text-sm text-foreground">{selectedGroup?.name}</span>
                          </div>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">
                            请仔细核对账号信息，确保准确无误后再添加到账号组
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {importMode === "xlsx" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-foreground">
                          <FileSpreadsheet className="mr-2 h-5 w-5" />
                          XLSX文件导入
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="xlsx-file">选择XLSX文件</Label>
                          <Input
                            id="xlsx-file"
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={(e) => setXlsxFile(e.target.files?.[0] || null)}
                          />
                        </div>
                        <Button className="w-full bg-primary text-primary-foreground" onClick={handleXlsxImport}>
                          <Upload className="mr-2 h-4 w-4" />
                          导入到 {selectedGroup?.name}
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-foreground">文件预览</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">文件名:</span>
                            <span className="text-sm text-foreground">{xlsxFile?.name || "未选择"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">文件大小:</span>
                            <span className="text-sm text-foreground">
                              {xlsxFile ? (xlsxFile.size / 1024).toFixed(2) + " KB" : "0 KB"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">目标账号组:</span>
                            <span className="text-sm text-foreground">{selectedGroup?.name}</span>
                          </div>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">
                            请确保XLSX文件格式正确，包含UID、Sixin_ST、Salt、DID等列
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="export" className="space-y-4 min-h-[600px]">
          <div className="w-full">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Download className="mr-2 h-5 w-5" />
                  配置导出
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Label className="text-sm font-medium text-foreground">导出账号组：</Label>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-64 justify-between bg-transparent">
                          <span>
                            {selectedGroupId === "all" ? "全部账号组" : selectedGroup?.name || "选择要导出的账号组"}
                          </span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>选择要导出的账号组</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          <div
                            className={`
                              p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                              ${
                                selectedGroupId === "all"
                                  ? "border-primary bg-primary/10 shadow-md"
                                  : "border-border bg-background hover:border-primary/50 hover:bg-primary/5"
                              }
                            `}
                            onClick={() => setSelectedGroupId("all")}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <div
                                    className={`
                                      w-4 h-4 rounded-full border-2 flex items-center justify-center
                                      ${
                                        selectedGroupId === "all"
                                          ? "border-primary bg-primary"
                                          : "border-muted-foreground"
                                      }
                                    `}
                                  >
                                    {selectedGroupId === "all" && <div className="w-2 h-2 bg-white rounded-full" />}
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-foreground">全部账号组</h4>
                                    <p className="text-sm text-muted-foreground mt-1">导出所有账号组的数据</p>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <div className="text-sm text-muted-foreground">总账号数</div>
                                <div className="text-lg font-bold text-primary">
                                  {accountGroups.reduce((sum, group) => sum + group.accountCount, 0)}
                                </div>
                              </div>
                            </div>
                          </div>
                          {accountGroups.map((group) => (
                            <div
                              key={group.id}
                              className={`
                                p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                                ${
                                  selectedGroupId === group.id
                                    ? "border-primary bg-primary/10 shadow-md"
                                    : "border-border bg-background hover:border-primary/50 hover:bg-primary/5"
                                }
                              `}
                              onClick={() => setSelectedGroupId(group.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3">
                                    <div
                                      className={`
                                        w-4 h-4 rounded-full border-2 flex items-center justify-center
                                        ${
                                          selectedGroupId === group.id
                                            ? "border-primary bg-primary"
                                            : "border-muted-foreground"
                                        }
                                      `}
                                    >
                                      {selectedGroupId === group.id && (
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                      )}
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-foreground">{group.name}</h4>
                                      <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right ml-4">
                                  <div className="text-sm text-muted-foreground">账号数量</div>
                                  <div className="text-lg font-bold text-primary">{group.accountCount}</div>
                                  <div className="text-xs text-muted-foreground">创建于 {group.createdAt}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">导出选项</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">包含用户名和邮箱</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">包含密码信息</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">包含平台信息</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">包含使用记录</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">导出格式</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="format" className="rounded" defaultChecked />
                        <span className="text-sm">JSON 格式</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="format" className="rounded" />
                        <span className="text-sm">CSV 格式</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="format" className="rounded" />
                        <span className="text-sm">Excel 格式</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button className="bg-primary text-primary-foreground">
                    <Download className="mr-2 h-4 w-4" />
                    导出 {selectedGroupId === "all" ? "全部账号" : selectedGroup?.name}
                  </Button>
                  <Button variant="outline" className="bg-transparent">
                    导出选中账号
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
