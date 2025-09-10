# Next.js Application - Account Management Dashboard

## Overview
This is a Next.js application with TypeScript and React that appears to be an account management dashboard. It includes features for managing accounts, attack cases, and tasks. The application uses modern UI components from Radix UI and is styled with Tailwind CSS.

## Recent Changes (September 10, 2025)
- **HTTP接口配置优化**: 将HTTP接口配置直接集成到主表单中，移除了弹窗式的"高级配置"界面
- **请求头JSON格式**: 改进请求头配置为JSON格式输入，简化编辑流程并提供格式验证
- **树状URL选择器**: 移除HTTP服务的API接口选择器，改为树状URL选择功能，支持预设接口和自定义URL两种模式
- **弹窗式接口选择**: 将树状接口列表改为弹窗模式，提供更清晰的选择界面和更大的浏览空间
- **URL路径中心选择**: 重新设计接口选择为基于URL路径的层级结构，用户直接通过URL路径来选择接口
- **界面简化**: 移除HTTP接口配置中所有框外提示小字，提供更加清爽简洁的用户界面
- **可展开树状列表**: 实现点击展开的文件夹式界面，支持分层浏览预设接口，提供直观的视觉导航体验
- **智能图标系统**: 为不同类型节点提供专用图标（文件夹、展开文件夹、接口链接），增强界面识别度
- **模板自动填充**: 选择预设URL时自动填充对应的请求方法、请求头和请求体模板，显著提高配置效率
- **双模式配置**: 支持"从预设选择"和"自定义URL"两种配置方式，灵活适应不同使用场景
- **实时选择状态**: 显示当前已选择的接口，支持一键清除选择，优化用户操作体验
- **实时JSON验证**: 添加JSON格式验证，实时显示错误提示，确保配置正确性
- **签名选项扩展**: 新增sig、sig3、NStokensig等多种签名验证方式，支持不同安全认证需求
- **智能状态管理**: 改进HTTP配置状态管理，确保选择预设URL时所有相关配置自动同步
- **表单重置优化**: 创建用例后自动重置所有HTTP配置状态，包括URL选择模式和展开状态
- **用户体验提升**: 统一界面风格，减少操作步骤，提高配置效率

### 之前的更新
- **HTTP接口高级配置**: 实现了完整的HTTP接口配置功能，支持自定义接口和平台提供的接口选择
- **标签页界面**: 添加了基本信息、请求头、请求体、出参断言、接口调试五个标签页的完整配置界面
- **请求体配置**: 支持JSON格式的请求体编辑，支持变量引用如${uid}
- **协议方法选择**: 支持POST和GET方法选择，GET请求自动禁用请求体配置
- **接口签名功能**: 实现了多种签名方式包括无验签、快手验签和自定义验签
- **出参断言**: 支持状态码、响应时间和响应体模式匹配的断言配置
- **类型系统扩展**: 扩展了HTTP接口类型定义，支持CustomHTTPInterface和SignatureType

## Previous Changes (September 9, 2025)
- **Attack Case Management Overhaul**: Completely redesigned attack case system with IM and HTTP service types
- **Two-Level Interface Selection**: Implemented service type -> specific API interface selection workflow
- **JSON Parameter Input**: Added JSON format parameter input for attack case configuration
- **Interface Name Truncation**: Added smart truncation for long interface names in list display
- **Data Structure Migration**: Updated type definitions and data storage for new attack case format
- **Backward Compatibility**: Ensured existing data continues to work with new system
- **QPS Time Chart**: Added QPS-Time 2D chart visualization for real-time performance monitoring
- **Task Details Page**: Created comprehensive task execution status page with real-time monitoring
- **Navigation Enhancement**: Added navigation from task list run buttons to detailed task pages
- **Manual Task Control**: Tasks now require manual start instead of auto-execution
- **Data Synchronization**: Implemented centralized data storage system using lib/data-store.ts
- **Architecture Update**: Replaced isolated component states with global data sharing
- **Attack Case Management**: Updated to use shared data store for creating and managing attack cases
- **Task Management**: Enhanced to load attack cases from global data store for consistency
- **Type System**: Unified attack case types across all components for better type safety
- **Bug Fixes**: Resolved critical data sync issues where attack cases weren't appearing across modules
- **Chain Configuration**: Implemented chain-level configuration with account groups, parameter files, and global variables
- **Collapsible UI**: Added expandable/collapsible chain configuration section positioned above service type selection
- **Enhanced Workflow**: Reorganized creation flow with chain configuration as primary configuration point
- **Attack Case Grouped Execution Logs**: Reorganized execution logs by attack case titles with collapsible sections for improved navigation
- **Enhanced Log Statistics**: Added comprehensive statistics for each attack case including execution counts, success rates, and average response times
- **Smart Log Organization**: Implemented expandable/collapsible log groups with visual status indicators and filtering capabilities

## Previous Changes (September 8, 2025)
- **Project Setup**: Configured the application to run in the Replit environment  
- **Dependencies**: Installed all npm packages successfully
- **Configuration**: Modified Next.js config to work with Replit's proxy system
- **Workflow**: Set up development server to run on 0.0.0.0:5000
- **Deployment**: Configured for autoscale deployment with proper build and start commands

## Project Architecture
- **Framework**: Next.js 14.2.16 with App Router
- **Language**: TypeScript
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS
- **Theme**: Dark theme by default with next-themes
- **Analytics**: Vercel Analytics integration
- **Fonts**: Geist Sans and Mono fonts

### Key Features
- Account Management (`/accounts`)
- Attack Case Management (`/attack-cases`) with tabbed interface for creating and managing attack cases
  - Enhanced HTTP interface configuration with 5-tab detailed setup
  - Support for custom and platform-provided HTTP interfaces
  - Request headers, body, signature, and assertion configuration
  - Advanced testing and debugging capabilities
- Task Management (`/tasks`) with synchronized attack case data and detailed execution monitoring
- Task Details Pages (`/tasks/[id]`) with real-time status monitoring, QPS monitoring charts, and task control
- Unified data sharing between components via lib/data-store.ts
- API routes for data management
- Modern UI with dark theme
- Responsive design

### Development Configuration
- **Host**: 0.0.0.0 (configured for Replit proxy)
- **Port**: 5000
- **Dev Command**: `npm run dev`
- **Build Command**: `npm run build` 
- **Start Command**: `npm start`

### File Structure
- `app/` - Next.js App Router pages and API routes
  - `tasks/[id]/page.tsx` - Dynamic task details page with real-time monitoring
- `components/` - Reusable UI components including Radix UI primitives
  - `attack-case-management.tsx` - Attack case creation and management with global data integration and HTTP interface configuration
  - `http-interface-config.tsx` - Advanced HTTP interface configuration component with tabbed interface
  - `task-management.tsx` - Task creation and management with shared attack case data and navigation
- `lib/` - Utility functions, type definitions, and global data storage
  - `data-store.ts` - Centralized data store for cross-component data sharing
  - `types.ts` - Unified type definitions for attack cases and other data structures
- `hooks/` - Custom React hooks
- `public/` - Static assets and images  
- `styles/` - Global CSS styles

The application is fully configured and ready for development in the Replit environment.