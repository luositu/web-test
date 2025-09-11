"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Trash2, Plus, Play, FileText, Settings, Globe, Code } from "lucide-react"
import type { CustomHTTPInterface, URLTreeNode } from "@/lib/types"
import { SIGNATURE_TYPES, HTTP_INTERFACES, URL_TREE } from "@/lib/types"
import { TreeSelector } from "@/components/ui/tree-selector"

interface HTTPInterfaceConfigProps {
  onSave: (config: CustomHTTPInterface) => void
  initialConfig?: Partial<CustomHTTPInterface>
}

export function HTTPInterfaceConfig({ onSave, initialConfig }: HTTPInterfaceConfigProps) {
  const [interfaceType, setInterfaceType] = useState<"platform" | "custom">("custom")
  const [selectedPlatformInterface, setSelectedPlatformInterface] = useState("")
  const [selectedTreeNode, setSelectedTreeNode] = useState<URLTreeNode | null>(null)
  
  const [config, setConfig] = useState<CustomHTTPInterface>({
    id: initialConfig?.id || "",
    name: initialConfig?.name || "",
    serviceUnderTest: initialConfig?.serviceUnderTest || "",
    url: initialConfig?.url || "",
    method: initialConfig?.method || "POST",
    headers: initialConfig?.headers || {
      "Content-Type": "application/json",
      "User-Agent": "Attack-Case-Tool/1.0"
    },
    body: initialConfig?.body || "",
    signature: initialConfig?.signature || {
      type: "none",
      config: {}
    },
    assertions: initialConfig?.assertions || {
      statusCode: 200,
      responseBodyPattern: "",
      maxResponseTime: 5000
    },
    businessCode: initialConfig?.businessCode || ""
  })

  const [newHeaderKey, setNewHeaderKey] = useState("")
  const [newHeaderValue, setNewHeaderValue] = useState("")

  // 添加请求头
  const addHeader = () => {
    if (newHeaderKey && newHeaderValue) {
      setConfig({
        ...config,
        headers: {
          ...config.headers,
          [newHeaderKey]: newHeaderValue
        }
      })
      setNewHeaderKey("")
      setNewHeaderValue("")
    }
  }

  // 删除请求头
  const removeHeader = (key: string) => {
    const newHeaders = { ...config.headers }
    delete newHeaders[key]
    setConfig({
      ...config,
      headers: newHeaders
    })
  }

  // 更新请求头值
  const updateHeaderValue = (key: string, value: string) => {
    setConfig({
      ...config,
      headers: {
        ...config.headers,
        [key]: value
      }
    })
  }

  // 保存配置
  const handleSave = () => {
    if (interfaceType === "platform" && selectedPlatformInterface) {
      const platformInterface = HTTP_INTERFACES.find(i => i.id === selectedPlatformInterface)
      if (platformInterface) {
        const platformConfig: CustomHTTPInterface = {
          id: platformInterface.id,
          name: platformInterface.name,
          serviceUnderTest: config.serviceUnderTest,
          url: config.url,
          method: platformInterface.method === "PUT" || platformInterface.method === "DELETE" ? "POST" : platformInterface.method as "GET" | "POST",
          headers: config.headers,
          body: config.body,
          signature: config.signature,
          assertions: config.assertions,
          businessCode: config.businessCode
        }
        onSave(platformConfig)
        return
      }
    }
    
    onSave(config)
  }

  // 测试接口
  const testInterface = () => {
    // 模拟接口测试
    console.log("Testing interface:", config)
    alert("接口测试功能将在后续版本中实现")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          HTTP接口配置
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">基本信息</TabsTrigger>
            <TabsTrigger value="headers">请求头</TabsTrigger>
            <TabsTrigger value="body">请求体</TabsTrigger>
            <TabsTrigger value="assertions">出参断言</TabsTrigger>
            <TabsTrigger value="testing">接口调试</TabsTrigger>
          </TabsList>

          {/* 基本信息标签页 */}
          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-4">
              {/* 接口类型选择 */}
              <div className="space-y-3">
                <Label>接口类型</Label>
                <RadioGroup value={interfaceType} onValueChange={(value) => setInterfaceType(value as "platform" | "custom")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="platform" id="platform" />
                    <Label htmlFor="platform">平台提供的接口</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom">自定义HTTP接口</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* 平台接口选择 */}
              {interfaceType === "platform" && (
                <div className="space-y-2">
                  <Label>选择平台接口</Label>
                  <TreeSelector
                    nodes={URL_TREE}
                    value={selectedTreeNode?.id}
                    onSelect={(node) => {
                      setSelectedTreeNode(node)
                      setSelectedPlatformInterface(node.id)
                      // 自动填充URL和其他配置
                      if (node.url) {
                        setConfig({
                          ...config,
                          url: node.url,
                          method: (node.method as "GET" | "POST") || "POST",
                          headers: { ...config.headers, ...node.headers },
                          body: node.body || config.body
                        })
                      }
                    }}
                    placeholder="选择一个API接口"
                  />
                  
                  {/* 显示选中接口的详细信息 */}
                  {selectedTreeNode && selectedTreeNode.url && (
                    <div className="mt-3 p-3 bg-muted/30 rounded-md">
                      <h4 className="text-sm font-medium mb-2">接口预览</h4>
                      <div className="space-y-1 text-xs">
                        <div><strong>接口名称:</strong> {selectedTreeNode.name}</div>
                        <div><strong>请求方法:</strong> {selectedTreeNode.method}</div>
                        <div><strong>接口地址:</strong> {selectedTreeNode.url}</div>
                        {selectedTreeNode.headers && (
                          <div><strong>默认请求头:</strong> {Object.keys(selectedTreeNode.headers).join(", ")}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 自定义接口配置 */}
              {interfaceType === "custom" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="interface-name">
                        接口名称 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="interface-name"
                        placeholder="接口名称1"
                        value={config.name}
                        onChange={(e) => setConfig({ ...config, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service-under-test">
                        被压服务 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="service-under-test"
                        placeholder="点击选择被压服务"
                        value={config.serviceUnderTest}
                        onChange={(e) => setConfig({ ...config, serviceUnderTest: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="url">
                      URL <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="url"
                      placeholder="请输入接口URL"
                      value={config.url}
                      onChange={(e) => setConfig({ ...config, url: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="protocol-method">
                        协议方法 <span className="text-red-500">*</span>
                      </Label>
                      <Select value={config.method} onValueChange={(value) => setConfig({ ...config, method: value as "GET" | "POST" })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="GET">GET</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signature">接口验签</Label>
                      <Select 
                        value={config.signature?.type} 
                        onValueChange={(value) => setConfig({ 
                          ...config, 
                          signature: { type: value as "none" | "kuaishou" | "custom", config: {} }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SIGNATURE_TYPES.map((sigType) => (
                            <SelectItem key={sigType.id} value={sigType.id}>
                              {sigType.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {config.signature?.type !== "none" && (
                        <div className="text-xs text-blue-600">
                          验签如果失败，<span className="underline cursor-pointer">查看如何排查</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-code">业务码</Label>
                      <Input
                        id="business-code"
                        placeholder="形如 $.result"
                        value={config.businessCode}
                        onChange={(e) => setConfig({ ...config, businessCode: e.target.value })}
                      />
                      <div className="text-xs text-gray-500">
                        覆盖默认的业务码
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          {/* 请求头标签页 */}
          <TabsContent value="headers" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">HTTP请求头</h3>
                <Badge variant="secondary">{Object.keys(config.headers).length} 个请求头</Badge>
              </div>
              
              {/* 现有请求头列表 */}
              <div className="space-y-2">
                {Object.entries(config.headers).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 p-2 border rounded">
                    <Input
                      value={key}
                      onChange={(e) => {
                        const newHeaders = { ...config.headers }
                        delete newHeaders[key]
                        newHeaders[e.target.value] = value
                        setConfig({ ...config, headers: newHeaders })
                      }}
                      className="flex-1"
                      placeholder="请求头名称"
                    />
                    <span>:</span>
                    <Input
                      value={value}
                      onChange={(e) => updateHeaderValue(key, e.target.value)}
                      className="flex-1"
                      placeholder="请求头值"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeHeader(key)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* 添加新请求头 */}
              <div className="flex items-center gap-2 p-4 border-2 border-dashed rounded">
                <Input
                  value={newHeaderKey}
                  onChange={(e) => setNewHeaderKey(e.target.value)}
                  placeholder="请求头名称"
                  className="flex-1"
                />
                <span>:</span>
                <Input
                  value={newHeaderValue}
                  onChange={(e) => setNewHeaderValue(e.target.value)}
                  placeholder="请求头值"
                  className="flex-1"
                />
                <Button onClick={addHeader} disabled={!newHeaderKey || !newHeaderValue}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* 请求体标签页 */}
          <TabsContent value="body" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">HTTP请求体</h3>
                <Badge variant="secondary">{config.method === "GET" ? "GET请求无需请求体" : "POST请求体"}</Badge>
              </div>
              
              {config.method === "POST" && (
                <div className="space-y-2">
                  <Label htmlFor="request-body">请求体内容</Label>
                  <Textarea
                    id="request-body"
                    value={config.body}
                    onChange={(e) => setConfig({ ...config, body: e.target.value })}
                    placeholder='请输入JSON格式的请求体，例如: {"username": "test", "password": "123456"}'
                    className="font-mono text-sm"
                    rows={10}
                  />
                  <div className="text-xs text-muted-foreground">
                    支持JSON格式，可以使用变量引用如 ${"{uid}"}
                  </div>
                </div>
              )}

              {config.method === "GET" && (
                <div className="text-center py-8 text-muted-foreground">
                  <Code className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>GET请求不需要请求体</p>
                  <p className="text-sm">参数应该添加到URL查询字符串中</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* 出参断言标签页 */}
          <TabsContent value="assertions" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">响应断言配置</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status-code">期望状态码</Label>
                  <Input
                    id="status-code"
                    type="number"
                    value={config.assertions.statusCode}
                    onChange={(e) => setConfig({
                      ...config,
                      assertions: {
                        ...config.assertions,
                        statusCode: parseInt(e.target.value) || 200
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-response-time">最大响应时间(ms)</Label>
                  <Input
                    id="max-response-time"
                    type="number"
                    value={config.assertions.maxResponseTime}
                    onChange={(e) => setConfig({
                      ...config,
                      assertions: {
                        ...config.assertions,
                        maxResponseTime: parseInt(e.target.value) || 5000
                      }
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="response-pattern">响应体匹配模式(可选)</Label>
                <Input
                  id="response-pattern"
                  value={config.assertions.responseBodyPattern || ""}
                  onChange={(e) => setConfig({
                    ...config,
                    assertions: {
                      ...config.assertions,
                      responseBodyPattern: e.target.value
                    }
                  })}
                  placeholder="例如: success|成功"
                />
                <div className="text-xs text-muted-foreground">
                  支持正则表达式，用于验证响应体内容
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 接口调试标签页 */}
          <TabsContent value="testing" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">接口调试</h3>
              
              <div className="p-4 border rounded bg-muted/30">
                <h4 className="font-medium mb-2">当前配置预览</h4>
                <div className="space-y-1 text-sm">
                  <div><strong>接口名称:</strong> {config.name || "未设置"}</div>
                  <div><strong>请求方法:</strong> {config.method}</div>
                  <div><strong>请求URL:</strong> {config.url || "未设置"}</div>
                  <div><strong>请求头数量:</strong> {Object.keys(config.headers).length}</div>
                  <div><strong>验签方式:</strong> {SIGNATURE_TYPES.find(s => s.id === config.signature?.type)?.name}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={testInterface} className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  测试接口
                </Button>
                <Button variant="outline" onClick={handleSave} className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  保存配置
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                点击"测试接口"可以验证当前配置是否正确，点击"保存配置"将配置应用到攻击用例中。
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}