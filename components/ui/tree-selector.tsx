"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight, Globe, Folder, FileText } from "lucide-react"
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

interface TreeNodeProps {
  node: URLTreeNode
  level: number
  onSelect: (node: URLTreeNode) => void
  selectedId?: string
}

function TreeNode({ node, level, onSelect, selectedId }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasChildren = node.children && node.children.length > 0
  const isEndpoint = !hasChildren && node.url
  const isSelected = selectedId === node.id

  const handleToggle = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded)
    }
  }

  const handleSelect = () => {
    if (isEndpoint) {
      onSelect(node)
    }
  }

  const indentLevel = level * 16

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-2 px-2 py-1.5 rounded-sm cursor-pointer hover:bg-muted/50 transition-colors ${
          isSelected ? "bg-primary/10 text-primary" : ""
        }`}
        style={{ paddingLeft: `${8 + indentLevel}px` }}
        onClick={isEndpoint ? handleSelect : handleToggle}
      >
        {/* 展开/折叠图标 */}
        {hasChildren && (
          <div className="flex-shrink-0">
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </div>
        )}
        
        {/* 节点图标 */}
        <div className="flex-shrink-0">
          {hasChildren ? (
            <Folder className="h-4 w-4 text-blue-500" />
          ) : isEndpoint ? (
            <FileText className="h-4 w-4 text-green-500" />
          ) : (
            <Globe className="h-4 w-4 text-gray-500" />
          )}
        </div>

        {/* 节点名称 */}
        <span className={`flex-1 text-sm ${isEndpoint ? "font-medium" : ""}`}>
          {node.name}
        </span>

        {/* HTTP方法标记 */}
        {isEndpoint && node.method && (
          <Badge variant="outline" className="text-xs">
            {node.method}
          </Badge>
        )}
      </div>

      {/* 子节点 */}
      {hasChildren && isExpanded && (
        <div className="ml-0">
          {node.children?.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function TreeSelector({ nodes, value, onSelect, placeholder = "选择一个接口" }: TreeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedNode, setSelectedNode] = useState<URLTreeNode | null>(null)

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
              <FileText className="h-4 w-4 text-green-500 flex-shrink-0" />
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
      <PopoverContent className="w-[400px] p-0" align="start">
        <div className="border-b px-3 py-2">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="font-medium text-sm">选择API接口</span>
          </div>
        </div>
        <ScrollArea className="h-[300px]">
          <div className="p-1">
            {nodes.map((node) => (
              <TreeNode
                key={node.id}
                node={node}
                level={0}
                onSelect={handleSelect}
                selectedId={selectedNode?.id}
              />
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}