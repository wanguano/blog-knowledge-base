<template>
  <div class="demo-interact-container">
    <div 
      ref="windowRef" 
      class="draggable-window"
      :class="{ dragging: isDragging, resizing: isResizing }"
    >
      <div class="drag-handle">
        <span class="title">🎯 可拖拽和缩放的窗口 (v2.0)</span>
        <button class="reset-btn" @click="resetPosition">重置位置</button>
      </div>
      <div class="content">
        <h3>useInteract Hook v2.0 演示</h3>
        
        <div class="status-grid">
          <div class="status-item">
            <span class="label">位置:</span>
            <span class="value">{{ position.x.toFixed(0) }}, {{ position.y.toFixed(0) }}</span>
          </div>
          <div class="status-item">
            <span class="label">尺寸:</span>
            <span class="value">{{ size.width.toFixed(0) }} × {{ size.height.toFixed(0) }}</span>
          </div>
          <div class="status-item">
            <span class="label">拖拽中:</span>
            <span class="value" :class="{ active: isDragging }">{{ isDragging ? '是' : '否' }}</span>
          </div>
          <div class="status-item">
            <span class="label">缩放中:</span>
            <span class="value" :class="{ active: isResizing }">{{ isResizing ? '是' : '否' }}</span>
          </div>
        </div>

        <div class="features">
          <h4>✨ v2.0 新特性</h4>
          <ul>
            <li>✅ 响应式位置和尺寸状态</li>
            <li>✅ 位置持久化 (刷新页面位置保持)</li>
            <li>✅ 拖拽和缩放状态追踪</li>
            <li>✅ 自动初始化和清理</li>
            <li>✅ 事件回调 (查看控制台)</li>
          </ul>
        </div>
        
        <div class="info">
          <p><strong>操作提示:</strong></p>
          <ul>
            <li>拖动顶部标题栏可移动窗口</li>
            <li>拖动窗口边缘或四角可调整大小</li>
            <li>点击"重置位置"恢复到中心</li>
            <li>刷新页面位置会自动恢复</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDraggableAndResizable } from '../../../hooks/vue/useInteract';

const windowRef = ref<HTMLElement | null>(null);

const { 
  initInteract, 
  destroyInteract,
  position,
  size,
  isDragging,
  isResizing,
  resetPosition,
} = useDraggableAndResizable(windowRef, {
  initialPosition: 'center',
  draggable: true,
  resizable: true,
  minWidth: 600,
  minHeight: 400,
  dragHandle: '.drag-handle',
  autoInit: true, // 自动初始化和清理
  persistPosition: true,
  storageKey: 'demo-interact-position',
  onDragStart: () => {
    console.log('开始拖拽');
  },
  onDragEnd: () => {
    console.log('拖拽结束,位置已保存');
  },
  onResizeEnd: () => {
    console.log('缩放结束');
  },
});
</script>

<style scoped>
.demo-interact-container {
  position: relative;
  width: 100%;
  height: 700px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  overflow: hidden;
  margin: 20px 0;
}

.draggable-window {
  position: absolute;
  background: white;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  touch-action: none; /* 禁用触摸默认行为,interact.js 需要 */
  transition: box-shadow 0.2s;
}

.draggable-window.dragging {
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
}

.draggable-window.resizing {
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.35);
}

.drag-handle {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 20px;
  cursor: move;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.drag-handle .title {
  font-weight: 600;
  font-size: 16px;
}

.reset-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.content {
  padding: 24px;
  color: #333;
}

.content h3 {
  margin-top: 0;
  color: #667eea;
  font-size: 20px;
  margin-bottom: 16px;
}

.content h4 {
  color: #667eea;
  font-size: 16px;
  margin: 16px 0 8px 0;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f7f9fc;
  border-radius: 6px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-item .label {
  font-weight: 500;
  color: #666;
  font-size: 13px;
}

.status-item .value {
  font-weight: 600;
  color: #333;
  font-size: 13px;
  font-family: 'Courier New', monospace;
}

.status-item .value.active {
  color: #667eea;
}

.features {
  margin-bottom: 20px;
}

.features ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
}

.features li {
  margin: 4px 0;
  font-size: 13px;
  color: #666;
}

.info {
  padding: 16px;
  background: #fff9e6;
  border-radius: 6px;
  border-left: 4px solid #ffc107;
}

.info strong {
  color: #f57c00;
}

.info ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
}

.info li {
  margin: 4px 0;
  font-size: 13px;
  color: #666;
}
</style>
