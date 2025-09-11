"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight, Globe, Folder, FolderOpen, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { URLTreeNode } from "@/lib/types"

interface TreeSelectorProps {
  nodes: URLTreeNode[]
  value?: string
  onSelect: (node: URLTreeNode) => void
  placeholder?: string
}

export function TreeSelector({ nodes, value, onSelect, placeholder = "选择一个接口" }: TreeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedNode, setSelectedNode] = useState<URLTreeNode | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  // 根据value查找对应的节点
  const findNodeById = (nodes: URLTreeNode[], id: string): URLTreeNode | null => {
    for (const node of nodes) {
      if (node.id === id) {
        return node
      }
      if (node.children) {
        const found = findNodeById(node.children, id)
        if (found) return found
      }
    }
    return null
  }

  // 切换节点展开状态
  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  // 当value变化时更新selectedNode
  useEffect(() => {
    if (value) {
      const node = findNodeById(nodes, value)
      setSelectedNode(node)
    }
  }, [value, nodes])

  const handleSelect = (node: URLTreeNode) => {
    setSelectedNode(node)
    onSelect(node)
    setIsOpen(false)
  }

  // 递归渲染树节点
  const renderTreeNode = (node: URLTreeNode, level: number = 0): JSX.Element => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expandedNodes.has(node.id)
    const isEndpoint = !hasChildren && node.url
    const isSelected = selectedNode?.id === node.id
    const indentLevel = level * 20

    return (
      <div key={node.id} className="w-full">
        <div
          className={`flex items-center gap-2 px-2 py-2 rounded-sm cursor-pointer hover:bg-muted/50 transition-colors select-none ${
            isSelected ? "bg-primary/10 text-primary border border-primary/20" : ""
          }`}
          style={{ paddingLeft: `${8 + indentLevel}px` }}
        >
          {/* 展开/折叠按钮 */}
          {hasChildren && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleNode(node.id)
              }}
              className="flex-shrink-0 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              )}
            </button>
          )}
          
          {/* 节点内容区域 */}
          <div
            className="flex items-center gap-2 flex-1 min-w-0"
            onClick={() => {
              if (isEndpoint) {
                handleSelect(node)
              } else if (hasChildren) {
                toggleNode(node.id)
              }
            }}
          >
            {/* 节点图标 */}
            <div className="flex-shrink-0">
              {hasChildren ? (
                isExpanded ? (
                  <FolderOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Folder className="h-4 w-4 text-blue-500 dark:text-blue-500" />
                )
              ) : isEndpoint ? (
                <Link className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <Globe className="h-4 w-4 text-gray-500" />
              )}
            </div>

            {/* 节点名称 */}
            <span className={`flex-1 text-sm truncate ${isEndpoint ? "font-medium" : ""} ${
              hasChildren ? "text-blue-700 dark:text-blue-300" : ""
            }`}>
              {node.name}
            </span>

            {/* HTTP方法标记 */}
            {isEndpoint && node.method && (
              <Badge 
                variant="outline" 
                className={`text-xs px-2 py-0.5 font-mono font-medium flex-shrink-0 ${
                  node.method === 'GET' ? 'border-green-500 text-green-700 dark:text-green-400' :
                  node.method === 'POST' ? 'border-blue-500 text-blue-700 dark:text-blue-400' :
                  node.method === 'PUT' ? 'border-orange-500 text-orange-700 dark:text-orange-400' :
                  node.method === 'DELETE' ? 'border-red-500 text-red-700 dark:text-red-400' :
                  'border-gray-500 text-gray-700 dark:text-gray-400'
                }`}
              >
                {node.method}
              </Badge>
            )}
          </div>
        </div>

        {/* 子节点 */}
        {hasChildren && isExpanded && (
          <div className="ml-0">
            {node.children?.map((child) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between text-left font-normal"
        >
          {selectedNode ? (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Link className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="truncate">{selectedNode.name}</span>
              {selectedNode.method && (
                <Badge variant="outline" className="text-xs">
                  {selectedNode.method}
                </Badge>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[450px] p-0" align="start">
        <div className="border-b px-3 py-2 bg-muted/30">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="font-medium text-sm">选择API接口</span>
          </div>
        </div>
        <ScrollArea className="h-[350px]">
          <div className="p-2">
            {nodes.map((node) => renderTreeNode(node, 0))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}