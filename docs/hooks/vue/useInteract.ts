import type { Ref } from 'vue';
import { ref, onMounted, onUnmounted } from 'vue';
import interact from 'interactjs';

// ===== 类型定义 =====

/**
 * 初始位置策略
 */
export type PositionStrategy = 
  | 'center'           // 窗口居中
  | 'current'          // 保持当前位置
  | 'custom'           // 自定义位置
  | 'viewport-center'; // 视口居中

/**
 * 定位模式
 */
export type PositioningMode = 
  | 'transform'  // 使用 transform (默认)
  | 'absolute'   // 使用 absolute 定位
  | 'fixed';     // 使用 fixed 定位

/**
 * 限制区域
 */
export type RestrictionArea = 
  | 'parent'     // 限制在父元素内
  | 'viewport'   // 限制在视口内
  | HTMLElement  // 限制在指定元素内
  | { x: number; y: number; width: number; height: number }; // 自定义矩形

/**
 * 位置信息
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * 尺寸信息
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * interact.js 功能的配置项
 */
export interface UseInteractOptions {
  // ===== 基础功能 =====
  /** 是否可拖拽 (默认: true) */
  draggable?: boolean;
  /** 是否可缩放 (默认: true) */
  resizable?: boolean;
  
  // ===== 初始位置配置 =====
  /** 初始位置策略 (默认: 'current') */
  initialPosition?: PositionStrategy;
  /** 自定义位置 (仅当 initialPosition='custom' 时生效) */
  customPosition?: Partial<Position>;
  
  // ===== 定位模式 =====
  /** 定位模式 (默认: 'transform') */
  positioningMode?: PositioningMode;
  
  // ===== 尺寸限制 =====
  /** 最小宽度 (默认: 300) */
  minWidth?: number;
  /** 最小高度 (默认: 200) */
  minHeight?: number;
  /** 最大宽度 */
  maxWidth?: number;
  /** 最大高度 */
  maxHeight?: number;
  
  // ===== 拖拽配置 =====
  /** 拖拽手柄选择器 */
  dragHandle?: string;
  /** 限制区域 (默认: 'parent') */
  restrictTo?: RestrictionArea;
  
  // ===== 持久化 =====
  /** 是否持久化位置 (默认: false) */
  persistPosition?: boolean;
  /** localStorage 键名 (默认: 'interact-position-{timestamp}') */
  storageKey?: string;
  
  // ===== 自动初始化 =====
  /** 是否自动初始化 (默认: false) */
  autoInit?: boolean;
  
  // ===== 事件回调 =====
  onDragStart?: (position: Position) => void;
  onDragMove?: (position: Position) => void;
  onDragEnd?: (position: Position) => void;
  onResizeStart?: (size: Size) => void;
  onResizeMove?: (size: Size) => void;
  onResizeEnd?: (size: Size) => void;
  onInitialized?: () => void;
}

/**
 * useInteract 返回值
 */
export interface UseInteractReturn {
  // ===== 初始化和销毁 =====
  initInteract: () => void;
  destroyInteract: () => void;
  
  // ===== 状态 =====
  isInitialized: Ref<boolean>;
  isDragging: Ref<boolean>;
  isResizing: Ref<boolean>;
  
  // ===== 位置和尺寸 =====
  position: Ref<Position>;
  size: Ref<Size>;
  
  // ===== 方法 =====
  resetPosition: () => void;
  setPosition: (position: Partial<Position>) => void;
  setSize: (size: Partial<Size>) => void;
  savePosition: () => void;
  restorePosition: () => void;
}

// ===== 工具函数 =====

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 计算初始位置
 */
function calculateInitialPosition(
  target: HTMLElement,
  strategy: PositionStrategy,
  customPos?: Partial<Position>,
): Position {
  const rect = target.getBoundingClientRect();
  
  switch (strategy) {
    case 'center':
      return {
        x: (window.innerWidth - rect.width) / 2,
        y: (window.innerHeight - rect.height) / 2,
      };
    
    case 'viewport-center':
      return {
        x: (document.documentElement.clientWidth - rect.width) / 2,
        y: (document.documentElement.clientHeight - rect.height) / 2,
      };
    
    case 'custom':
      return {
        x: customPos?.x ?? 0,
        y: customPos?.y ?? 0,
      };
    
    case 'current':
    default:
      // 保持当前位置,不做任何修改
      return { x: 0, y: 0 };
  }
}

/**
 * 应用位置到元素
 */
function applyPosition(
  target: HTMLElement,
  position: Position,
  mode: PositioningMode,
): void {
  switch (mode) {
    case 'transform':
      target.style.transform = `translate(${position.x}px, ${position.y}px)`;
      break;
    case 'absolute':
      target.style.position = 'absolute';
      target.style.left = `${position.x}px`;
      target.style.top = `${position.y}px`;
      break;
    case 'fixed':
      target.style.position = 'fixed';
      target.style.left = `${position.x}px`;
      target.style.top = `${position.y}px`;
      break;
  }
}

/**
 * 获取限制配置
 */
function getRestrictionConfig(restrictTo: RestrictionArea) {
  if (typeof restrictTo === 'string') {
    return { restriction: restrictTo };
  } if (restrictTo instanceof HTMLElement) {
    return { restriction: restrictTo };
  }
  // 自定义矩形需要转换为 interact.js 的 Rect 格式
  return { 
    restriction: {
      top: restrictTo.y,
      left: restrictTo.x,
      bottom: restrictTo.y + restrictTo.height,
      right: restrictTo.x + restrictTo.width,
    },
  };
}

// ===== 主函数 =====

/**
 * 一个封装了 interact.js 拖拽和缩放功能的 Vue Composable 函数。
 * 
 * @param targetRef - 一个指向目标 DOM 元素的 Vue ref 对象
 * @param options - 控制启用哪些交互功能的配置项
 * @returns 包含初始化方法、状态和控制方法的对象
 * 
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue';
 * import { useDraggableAndResizable } from './useInteract';
 * 
 * const dialogRef = ref(null);
 * const { initInteract, destroyInteract, position, isDragging } = useDraggableAndResizable(dialogRef, {
 *   initialPosition: 'center',
 *   draggable: true,
 *   resizable: true,
 * });
 * 
 * onMounted(() => {
 *   initInteract();
 * });
 * 
 * onUnmounted(() => {
 *   destroyInteract();
 * });
 * </script>
 * ```
 */
export function useDraggableAndResizable(
  targetRef: Ref<HTMLElement | null>,
  options: UseInteractOptions = {},
): UseInteractReturn {
  // 解构配置项
  const {
    draggable = true,
    resizable = true,
    initialPosition = 'current',
    customPosition,
    positioningMode = 'transform',
    minWidth = 300,
    minHeight = 200,
    maxWidth,
    maxHeight,
    dragHandle,
    restrictTo = 'parent',
    persistPosition = false,
    storageKey,
    autoInit = false,
    onDragStart,
    onDragMove,
    onDragEnd,
    onResizeStart,
    onResizeMove,
    onResizeEnd,
    onInitialized,
  } = options;

  // ===== 状态管理 =====
  const isInitialized = ref(false);
  const isDragging = ref(false);
  const isResizing = ref(false);
  const position = ref<Position>({ x: 0, y: 0 });
  const size = ref<Size>({ width: 0, height: 0 });

  // 存储初始位置
  let initialPos: Position = { x: 0, y: 0 };
  
  // 生成存储键名
  const finalStorageKey = storageKey || `interact-position-${generateId()}`;

  // ===== 持久化方法 =====
  
  /**
   * 保存位置到 localStorage
   */
  const savePosition = () => {
    if (!persistPosition) return;
    try {
      localStorage.setItem(finalStorageKey, JSON.stringify(position.value));
    } catch (error) {
      console.warn('Failed to save position:', error);
    }
  };

  /**
   * 从 localStorage 恢复位置
   */
  const restorePosition = () => {
    if (!persistPosition) return;
    try {
      const saved = localStorage.getItem(finalStorageKey);
      if (saved) {
        const pos = JSON.parse(saved) as Position;
        setPosition(pos);
      }
    } catch (error) {
      console.warn('Failed to restore position:', error);
    }
  };

  // ===== 位置和尺寸控制方法 =====
  
  /**
   * 设置位置
   */
  const setPosition = (newPosition: Partial<Position>) => {
    const target = targetRef.value;
    if (!target) return;

    position.value = {
      x: newPosition.x ?? position.value.x,
      y: newPosition.y ?? position.value.y,
    };

    applyPosition(target, position.value, positioningMode);
    
    // 更新 data 属性 (用于 interact.js)
    target.setAttribute('data-x', String(position.value.x));
    target.setAttribute('data-y', String(position.value.y));

    if (persistPosition) {
      savePosition();
    }
  };

  /**
   * 设置尺寸
   */
  const setSize = (newSize: Partial<Size>) => {
    const target = targetRef.value;
    if (!target) return;

    size.value = {
      width: newSize.width ?? size.value.width,
      height: newSize.height ?? size.value.height,
    };

    target.style.width = `${size.value.width}px`;
    target.style.height = `${size.value.height}px`;
  };

  /**
   * 重置到初始位置
   */
  const resetPosition = () => {
    setPosition(initialPos);
  };

  // ===== 初始化和销毁 =====
  
  /**
   * 初始化 interact.js 的监听器
   */
  const initInteract = () => {
    const target = targetRef.value;
    if (!target || isInitialized.value) return;

    // 获取当前尺寸
    const rect = target.getBoundingClientRect();
    size.value = {
      width: rect.width,
      height: rect.height,
    };

    // 尝试从 localStorage 恢复位置
    if (persistPosition) {
      restorePosition();
    }

    // 如果没有恢复到位置,则计算初始位置
    if (position.value.x === 0 && position.value.y === 0) {
      initialPos = calculateInitialPosition(target, initialPosition, customPosition);
      position.value = { ...initialPos };

      // 只有在非 'current' 策略时才应用位置
      if (initialPosition !== 'current') {
        // 对于 transform 模式,需要设置 left 和 top 为 0
        if (positioningMode === 'transform') {
          target.style.left = '0px';
          target.style.top = '0px';
        }
        applyPosition(target, position.value, positioningMode);
      }
    }

    // 设置 data 属性
    target.setAttribute('data-x', String(position.value.x));
    target.setAttribute('data-y', String(position.value.y));

    const instance = interact(target);

    // ===== 配置拖拽 =====
    if (draggable) {
      instance.draggable({
        allowFrom: dragHandle,
        modifiers: [
          interact.modifiers.restrictRect({
            ...getRestrictionConfig(restrictTo),
            endOnly: true,
          }),
        ],
        listeners: {
          start() {
            isDragging.value = true;
            if (onDragStart) {
              onDragStart(position.value);
            }
          },
          move(event) {
            const x = (parseFloat(event.target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(event.target.getAttribute('data-y')) || 0) + event.dy;

            position.value = { x, y };

            // 更新元素的 transform 样式和 data-* 属性
            applyPosition(event.target, position.value, positioningMode);
            event.target.setAttribute('data-x', String(x));
            event.target.setAttribute('data-y', String(y));

            if (onDragMove) {
              onDragMove(position.value);
            }
          },
          end() {
            isDragging.value = false;
            if (onDragEnd) {
              onDragEnd(position.value);
            }
            if (persistPosition) {
              savePosition();
            }
          },
        },
      });
    }

    // ===== 配置缩放 =====
    if (resizable) {
      const sizeModifiers = [];
      
      // 添加尺寸限制
      sizeModifiers.push(
        interact.modifiers.restrictSize({
          min: { width: minWidth, height: minHeight },
          max: maxWidth && maxHeight ? { width: maxWidth, height: maxHeight } : undefined,
        }),
      );

      instance.resizable({
        edges: {
          left: true,
          right: true,
          bottom: true,
          top: true,
        },
        listeners: {
          start() {
            isResizing.value = true;
            if (onResizeStart) {
              onResizeStart(size.value);
            }
          },
          move(event) {
            const { rect, target: eventTarget } = event;

            let x = parseFloat(eventTarget.getAttribute('data-x')) || 0;
            let y = parseFloat(eventTarget.getAttribute('data-y')) || 0;

            // 更新尺寸
            size.value = {
              width: rect.width,
              height: rect.height,
            };

            eventTarget.style.width = `${rect.width}px`;
            eventTarget.style.height = `${rect.height}px`;

            // 当从顶部或左侧边缘缩放时,需要平移元素以保持位置不变
            x += event.deltaRect.left;
            y += event.deltaRect.top;

            position.value = { x, y };

            // 更新 transform 和 data-* 属性
            applyPosition(eventTarget, position.value, positioningMode);
            eventTarget.setAttribute('data-x', String(x));
            eventTarget.setAttribute('data-y', String(y));

            if (onResizeMove) {
              onResizeMove(size.value);
            }
          },
          end() {
            isResizing.value = false;
            if (onResizeEnd) {
              onResizeEnd(size.value);
            }
          },
        },
        modifiers: sizeModifiers,
      });
    }

    isInitialized.value = true;
    
    if (onInitialized) {
      onInitialized();
    }
  };

  /**
   * 销毁 interact.js 实例,清理事件监听器
   */
  const destroyInteract = () => {
    const target = targetRef.value;
    if (target && isInitialized.value) {
      interact(target).unset();
      isInitialized.value = false;
      isDragging.value = false;
      isResizing.value = false;
    }
  };

  // ===== 自动初始化 =====
  if (autoInit) {
    onMounted(() => {
      initInteract();
    });

    onUnmounted(() => {
      destroyInteract();
    });
  }

  return {
    // 初始化和销毁
    initInteract,
    destroyInteract,
    
    // 状态
    isInitialized,
    isDragging,
    isResizing,
    
    // 位置和尺寸
    position,
    size,
    
    // 方法
    resetPosition,
    setPosition,
    setSize,
    savePosition,
    restorePosition,
  };
}
