<!-- Pure Upload Dialog Component - 纯净版文件上传对话框 -->
<template>
  <el-dialog
    v-model="dialogVisible"
    title="上传文档"
    width="600px"
    :close-on-click-modal="false"
    custom-class="upload-dialog"
    @closed="handleDialogClosed"
  >
    <!-- 选项卡 -->
    <el-tabs v-model="currentTab" class="upload-tabs">
      <el-tab-pane label="文件" name="file"></el-tab-pane>
      <el-tab-pane label="文件夹" name="folder"></el-tab-pane>
    </el-tabs>

    <!-- 文件上传区域 -->
    <div class="upload-container">
      <el-upload
        ref="uploadRef"
        class="upload-area"
        drag
        :auto-upload="false"
        :multiple="true"
        :show-file-list="false"
        :on-change="handleFileChange"
        :on-drop="handleDrop"
        :before-upload="beforeUpload"
        :accept="getAcceptString()"
        :file-list="files"
      >
        <template #default>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            {{ currentTab === 'folder' ? '点击文件夹至此区域即可上传' : '点击或拖拽文件至此区域即可上传' }}
          </div>
          <div class="el-upload__tip">
            支持{{ currentTab === 'folder' ? '文件夹' : '单次或批量' }}上传，单个文件大小不超过{{ MAX_FILE_SIZE_MB }}MB，最多上传{{ MAX_FILES_COUNT }}份文件。
            <div>支持的文件类型: {{ getAllowedTypesDisplay() }}</div>
          </div>
        </template>
      </el-upload>
    </div>

    <!-- 选择的文件列表 -->
    <div v-if="files.length > 0" class="selected-files">
      <div class="file-list-header">
        <div>已选择 {{ files.length }} 个文件</div>
        <el-button type="text" class="clear-btn" @click="clearFiles">
          清空
        </el-button>
      </div>
      <div class="file-list">
        <div v-for="(file, index) in files" :key="index" class="file-item">
          <div class="file-icon">
            <el-icon><Document /></el-icon>
          </div>
          <div class="file-info">
            <div class="file-name">
              {{ file.name }}
            </div>
            <div class="file-size">
              {{ formatFileSize(file.size) }}
            </div>
          </div>
          <el-icon class="remove-file-btn" @click="removeFile(index)">
            <Delete />
          </el-icon>
        </div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button
          type="primary"
          :disabled="!isFormValid"
          @click="handleConfirm"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 定义类型
type UploadFile = File;

// 上传配置接口
export interface UploadConfig {
  maxFileSize?: number; // MB
  maxFilesCount?: number;
  allowedFileTypes?: {
    documents?: string[];
    spreadsheets?: string[];
    images?: string[];
  };
}

// 定义props
const props = defineProps<{
  visible: boolean;
  config?: UploadConfig;
}>();

// 定义emits - 简化版，只返回文件数组
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'upload', files: File[]): void;
  (e: 'cancel'): void;
}>();

// 内部状态
const dialogVisible = ref<boolean>(false);
const currentTab = ref<'file' | 'folder'>('file');
const files = ref<UploadFile[]>([]);

// 设置默认值和派生值
const MAX_FILE_SIZE_MB = computed(() => props.config?.maxFileSize || 10);
const MAX_FILES_COUNT = computed(() => props.config?.maxFilesCount || 10);
const ALLOWED_FILE_TYPES = computed(() => props.config?.allowedFileTypes || {
  documents: ['.pdf', '.docx', '.pptx', '.txt', '.md', '.json', '.eml', '.html'],
  spreadsheets: ['.xlsx'],
  images: ['.jpeg', '.jpg', '.png', '.tif', '.tiff', '.gif'],
});

// 添加累积结果和计时器变量
const accumulatedResults = reactive({
  validFiles: 0,
  invalidTypeCount: 0,
  oversizedCount: 0,
  duplicateCount: 0,
  rejectedDueToLimitCount: 0,
  limitWasReached: false,
  messageTimer: null as NodeJS.Timeout | null,
});

const uploadRef = ref();

// 获取所有允许的文件类型的扁平数组
const getAllAllowedFileTypes = () => {
  return Object.values(ALLOWED_FILE_TYPES.value).flat();
};

// 获取用于显示的允许文件类型字符串
const getAllowedTypesDisplay = () => {
  return getAllAllowedFileTypes().join(', ');
};

// 获取用于accept属性的字符串
const getAcceptString = () => {
  return getAllAllowedFileTypes().join(',');
};

// 检查文件类型是否允许
const isFileTypeAllowed = (fileName: string): boolean => {
  if (!fileName || typeof fileName !== 'string') return false;
  const lastDotIndex = fileName.lastIndexOf('.');

  if (lastDotIndex < 0 || (lastDotIndex === 0 && fileName.length <= 1) || lastDotIndex >= fileName.length - 1) {
    return false;
  }
  const extension = fileName.substring(lastDotIndex).toLowerCase();
  return getAllAllowedFileTypes().includes(extension);
};

// 提取公共函数设置input元素属性
const setupInputElement = () => {
  nextTick(() => {
    setTimeout(() => {
      const inputEl = uploadRef.value?.$el?.querySelector('input[type=file]');
      if (inputEl) {
        if (currentTab.value === 'folder') {
          inputEl.setAttribute('webkitdirectory', '');
          inputEl.setAttribute('directory', '');
          inputEl.setAttribute('mozdirectory', '');
        } else {
          inputEl.removeAttribute('webkitdirectory');
          inputEl.removeAttribute('directory');
          inputEl.removeAttribute('mozdirectory');
        }
      }
    }, 100);
  });
};

// 监听 currentTab 变化
watch(() => currentTab.value, () => {
  setupInputElement();
});

// 监听visible prop变化
watch(() => props.visible, (newVal: boolean) => {
  dialogVisible.value = newVal;
});

// 监听dialogVisible变化，同步回父组件
watch(dialogVisible, (newVal: boolean) => {
  emit('update:visible', newVal);

  if (newVal) {
    setupInputElement();

    // 重置累积结果
    accumulatedResults.validFiles = 0;
    accumulatedResults.invalidTypeCount = 0;
    accumulatedResults.oversizedCount = 0;
    accumulatedResults.duplicateCount = 0;
    accumulatedResults.rejectedDueToLimitCount = 0;
    accumulatedResults.limitWasReached = false;

    // 清除可能存在的计时器
    if (accumulatedResults.messageTimer) {
      clearTimeout(accumulatedResults.messageTimer);
      accumulatedResults.messageTimer = null;
    }
  }
});

// 组件挂载时初始化
onMounted(() => {
  setupInputElement();
});

// 表单验证
const isFormValid = computed<boolean>(() => {
  return files.value.length > 0;
});

/**
 * 关闭对话框
 */
const handleDialogClosed = (): void => {
  currentTab.value = 'file';
  files.value = [];

  uploadRef.value?.clearFiles();

  if (accumulatedResults.messageTimer) {
    clearTimeout(accumulatedResults.messageTimer);
    accumulatedResults.messageTimer = null;
  }

  // 重置累积结果
  accumulatedResults.validFiles = 0;
  accumulatedResults.invalidTypeCount = 0;
  accumulatedResults.oversizedCount = 0;
  accumulatedResults.duplicateCount = 0;
  accumulatedResults.rejectedDueToLimitCount = 0;
  accumulatedResults.limitWasReached = false;
};

/**
 * 从文件条目获取文件
 */
const getFileFromEntry = (fileEntry: FileSystemFileEntry): Promise<File> => {
  return new Promise((resolve, reject) => {
    fileEntry.file(
      (file) => resolve(file),
      (error) => reject(error),
    );
  });
};

const removeFile = (index: number): void => {
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    files.value.splice(index, 1);
  });
};

/**
 * 清空文件
 */
const clearFiles = (): void => {
  ElMessageBox.confirm('确定要清空吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    files.value = [];
  });
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / k ** i).toFixed(2)) + ' ' + sizes[i];
};

const handleCancel = (): void => {
  emit('cancel');

  uploadRef.value?.clearFiles();

  if (accumulatedResults.messageTimer) {
    clearTimeout(accumulatedResults.messageTimer);
    accumulatedResults.messageTimer = null;
  }

  dialogVisible.value = false;
};

/**
 * 确定上传，抛出上传结果 - 简化版，只返回文件数组
 */
const handleConfirm = (): void => {
  emit('upload', files.value);

  uploadRef.value?.clearFiles();

  dialogVisible.value = false;
};

/**
 * 上传文件前的校验
 */
const beforeUpload = (file: File) => {
  if (currentTab.value === 'file') {
    if (file.type === '' && file.size === 0) {
      ElMessage.error('文件模式下不能上传文件夹，请切换到文件夹模式');
      return false;
    }
  }

  if (!isFileTypeAllowed(file.name)) {
    ElMessage.error(`不支持的文件类型: ${file.name}`);
    return false;
  }

  const isLt10M = file.size <= MAX_FILE_SIZE_MB.value * 1024 * 1024;
  if (!isLt10M) {
    ElMessage.error(`文件大小不能超过 ${MAX_FILE_SIZE_MB.value}MB!`);
    return false;
  }

  return true;
};

// 处理文件的核心函数 - 验证、去重、限制检查
const processFiles = (newPotentialFiles: File[], existingFiles: File[]) => {
  let invalidTypeCount = 0;
  let oversizedCount = 0;
  let duplicateCount = 0;
  let rejectedDueToLimitCount = 0;
  let limitWasReached = false;

  console.log(`processFiles: 尝试处理 ${newPotentialFiles.length} 个新文件，已有 ${existingFiles.length} 个文件。`);

  // 创建现有文件的名称集合，用于检查重复
  const allExistingIdentifiers = new Set(existingFiles.map((f) => {
    const identifier = (f as any).webkitRelativePath || f.name;
    return identifier;
  }));

  // 确保在同一批新文件中也检测重复
  const processedInThisBatchIdentifiers = new Set<string>();

  // 过滤文件类型、大小和重复
  const validatedNewFiles: File[] = [];
  newPotentialFiles.forEach((file) => {
    const fileIdentifier = (file as any).webkitRelativePath || file.name;

    // 检查是否已存在
    const existsPreviously = allExistingIdentifiers.has(fileIdentifier);
    const existsInThisBatch = processedInThisBatchIdentifiers.has(fileIdentifier);

    if (existsPreviously || existsInThisBatch) {
      duplicateCount++;
      return;
    }

    // 检查文件类型
    const isValidType = isFileTypeAllowed(file.name);
    if (!isValidType) {
      invalidTypeCount++;
      return;
    }

    // 检查文件大小
    const isValidSize = file.size <= MAX_FILE_SIZE_MB.value * 1024 * 1024;
    if (!isValidSize) {
      oversizedCount++;
      return;
    }

    processedInThisBatchIdentifiers.add(fileIdentifier);
    validatedNewFiles.push(file);
  });

  console.log(`processFiles: 校验后得到 ${validatedNewFiles.length} 个有效新文件。重复: ${duplicateCount}, 类型不支持: ${invalidTypeCount}, 超大: ${oversizedCount}`);

  // 检查文件总数限制
  const availableSlots = MAX_FILES_COUNT.value - existingFiles.length;
  let filesActuallyAdded: File[] = [];

  if (availableSlots <= 0 && validatedNewFiles.length > 0) {
    limitWasReached = true;
    rejectedDueToLimitCount = validatedNewFiles.length;
    filesActuallyAdded = [];
  } else if (validatedNewFiles.length > availableSlots) {
    filesActuallyAdded = validatedNewFiles.slice(0, availableSlots);
    rejectedDueToLimitCount = validatedNewFiles.length - filesActuallyAdded.length;
    limitWasReached = true;
  } else {
    filesActuallyAdded = validatedNewFiles;
    if (availableSlots === 0 && validatedNewFiles.length === 0 && MAX_FILES_COUNT.value === existingFiles.length) {
      limitWasReached = true;
    }
  }

  return {
    filesActuallyAdded,
    invalidTypeCount,
    oversizedCount,
    duplicateCount,
    rejectedDueToLimitCount,
    limitWasReached,
  };
};

// 显示累积的消息提示
const showAccumulatedMessage = () => {
  let message = '';
  if (accumulatedResults.validFiles > 0) {
    message = `成功添加${accumulatedResults.validFiles}个文件`;
  } else if (accumulatedResults.invalidTypeCount > 0 || accumulatedResults.oversizedCount > 0
    || accumulatedResults.duplicateCount > 0 || accumulatedResults.rejectedDueToLimitCount > 0) {
    message = '未能添加文件';
  } else {
    return;
  }

  // 添加警告信息
  const warnings = [];
  if (accumulatedResults.oversizedCount > 0) {
    warnings.push(`${accumulatedResults.oversizedCount}个文件超过${MAX_FILE_SIZE_MB.value}MB限制`);
  }
  if (accumulatedResults.invalidTypeCount > 0) {
    warnings.push(`${accumulatedResults.invalidTypeCount}个文件类型不支持`);
  }
  if (accumulatedResults.limitWasReached && accumulatedResults.rejectedDueToLimitCount > 0) {
    warnings.push(`因数量超出上限(${MAX_FILES_COUNT.value}个文件)部分文件未添加`);
  } else if (accumulatedResults.limitWasReached && accumulatedResults.rejectedDueToLimitCount === 0 && accumulatedResults.validFiles === 0) {
    warnings.push(`已达到文件数量上限(${MAX_FILES_COUNT.value}个)`);
  }

  if (warnings.length > 0) {
    message += `，${warnings.join('，')}`;
  }

  // 根据是否有成功添加来决定消息类型
  if (accumulatedResults.validFiles > 0) {
    ElMessage.success(message);
  } else if (warnings.length > 0) {
    ElMessage.warning(message);
  }

  // 重置累积结果
  accumulatedResults.validFiles = 0;
  accumulatedResults.invalidTypeCount = 0;
  accumulatedResults.oversizedCount = 0;
  accumulatedResults.duplicateCount = 0;
  accumulatedResults.rejectedDueToLimitCount = 0;
  accumulatedResults.limitWasReached = false;
};

// 显示处理结果消息（带防抖）
const showProcessResultMessage = (result: {
  filesActuallyAdded: File[],
  invalidTypeCount: number,
  oversizedCount: number,
  duplicateCount?: number,
  rejectedDueToLimitCount: number,
  limitWasReached: boolean,
}) => {
  // 累积结果
  accumulatedResults.validFiles += result.filesActuallyAdded.length;
  accumulatedResults.invalidTypeCount += result.invalidTypeCount;
  accumulatedResults.oversizedCount += result.oversizedCount;
  accumulatedResults.duplicateCount += (result.duplicateCount || 0);
  accumulatedResults.rejectedDueToLimitCount += result.rejectedDueToLimitCount;
  accumulatedResults.limitWasReached = accumulatedResults.limitWasReached || result.limitWasReached;

  // 清除之前的计时器
  if (accumulatedResults.messageTimer) {
    clearTimeout(accumulatedResults.messageTimer);
    accumulatedResults.messageTimer = null;
  }

  // 设置新的计时器，延迟显示结果
  accumulatedResults.messageTimer = setTimeout(() => {
    showAccumulatedMessage();
    accumulatedResults.messageTimer = null;
  }, 300);
};

// 处理并显示结果的公共函数
const processAndShowResult = (newFiles: File[]) => {
  if (!newFiles || newFiles.length === 0) {
    return;
  }
  const result = processFiles(newFiles, files.value);

  if (result.filesActuallyAdded.length > 0) {
    files.value = [...files.value, ...result.filesActuallyAdded];
  }

  showProcessResultMessage(result);
};

// 处理文件变化
const handleFileChange = (uploadFile: any, uploadFilesProvidedByComponent: any[]) => {
  console.log('handleFileChange - 当前原始文件:', uploadFile.raw?.name, '组件维护的文件列表长度:', uploadFilesProvidedByComponent.length);

  // 限制上传文件名长度
  if (uploadFile.raw?.name.length >= 120) {
    ElMessage.warning('文件名不能超过120个字符');
    return;
  }

  try {
    if (currentTab.value === 'file') {
      let filesToProcess: File[] = [];
      const isDirectory = uploadFile.raw.type === '' && uploadFile.raw.size === 0;
      if (isDirectory) {
        ElMessage.error('文件模式下不能上传文件夹，请切换到文件夹模式');
        return;
      }
      const existingFileNames = new Set(files.value.map((f) => {
        const identifier = (f as any).webkitRelativePath || f.name;
        return identifier;
      }));
      const fileIdentifier = (uploadFile.raw as any).webkitRelativePath || uploadFile.raw.name;
      if (!existingFileNames.has(fileIdentifier)) {
        filesToProcess = [uploadFile.raw];
      }
      if (filesToProcess.length > 0) {
        processAndShowResult(filesToProcess);
      } else {
        console.log('文件模式: 文件已存在或无效 - ', fileIdentifier);
      }
    } else {
      // 文件夹模式
      const inputEl = uploadRef.value?.$el?.querySelector('input[type=file]');
      if (inputEl && inputEl.files && inputEl.files.length > 0) {
        const filesFromInput = Array.from(inputEl.files as FileList);
        console.log(`文件夹模式: 从 input 读取到 ${filesFromInput.length} 个文件。`);
        if (filesFromInput.length > 0) {
          processAndShowResult(filesFromInput);
        }
      } else {
        console.log('文件夹模式: input.files 为空或未找到 input 元素。');
      }
    }
  } finally {
    // 无特定清理逻辑
  }
};

// 处理拖拽上传
const handleDrop = async (e: DragEvent) => {
  e.preventDefault();
  try {
    if (currentTab.value === 'folder') {
      try {
        if (!e.dataTransfer?.items?.[0]?.webkitGetAsEntry) {
          if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
            const droppedFiles = Array.from(e.dataTransfer.files);
            processAndShowResult(droppedFiles);
          }
          return;
        }
        const items = Array.from(e.dataTransfer.items);
        const allFiles: File[] = [];
        let hasProcessedItems = false;
        const processingPromises: Promise<void>[] = [];
        for (const item of items) {
          if (item.kind === 'file') {
            const entry = item.webkitGetAsEntry();
            if (entry) {
              hasProcessedItems = true;
              if (entry.isDirectory) {
                const promise = (async () => {
                  try {
                    const filesFromDirectory = await readDirectoryContents(entry as FileSystemDirectoryEntry);
                    allFiles.push(...filesFromDirectory);
                  } catch (err) {
                    console.error('读取目录错误:', err);
                  }
                })();
                processingPromises.push(promise);
              } else if (entry.isFile) {
                const promise = (async () => {
                  try {
                    const file = await getFileFromEntry(entry as FileSystemFileEntry);
                    if (file) allFiles.push(file);
                  } catch (err) {
                    console.error('读取文件错误:', err);
                  }
                })();
                processingPromises.push(promise);
              }
            }
          }
        }
        await Promise.all(processingPromises);
        if (!hasProcessedItems && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          const droppedFiles = Array.from(e.dataTransfer.files);
          processAndShowResult(droppedFiles);
          return;
        }
        if (allFiles.length > 0) {
          processAndShowResult(allFiles);
        } else {
          ElMessage.info('未检测到有效文件');
        }
      } catch (error) {
        console.error('处理拖放文件错误:', error);
        ElMessage.error('处理文件时出错');
      }
    } else if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      processAndShowResult(droppedFiles);
    }
  } finally {
    // 无特定清理逻辑
  }
};

// 递归读取目录内容
const readDirectoryContents = async (directoryEntry: FileSystemDirectoryEntry): Promise<File[]> => {
  const collectedEntriesInDirectory: File[] = [];
  console.log(`开始读取文件夹: ${directoryEntry.name}`);
  const folderPath = directoryEntry.fullPath || directoryEntry.name;

  const readEntriesRecursive = (dirReader: FileSystemDirectoryReader): Promise<FileSystemEntry[]> => {
    return new Promise((resolve, reject) => {
      const entriesAccumulator: FileSystemEntry[] = [];
      const readBatch = () => {
        dirReader.readEntries(
          (results) => {
            if (results.length > 0) {
              entriesAccumulator.push(...results);
              readBatch();
            } else {
              resolve(entriesAccumulator);
            }
          },
          (error) => {
            console.error('读取目录条目错误:', error);
            reject(error);
          },
        );
      };
      readBatch();
    });
  };

  const queue: FileSystemEntry[] = [directoryEntry];
  let totalFiles = 0;
  let processedEntriesCount = 0;

  while (queue.length > 0) {
    const entry = queue.shift()!;
    processedEntriesCount++;

    if (entry.isFile) {
      try {
        const file = await getFileFromEntry(entry as FileSystemFileEntry);
        if (file) {
          if (!(file as any).webkitRelativePath && entry.fullPath) {
            Object.defineProperty(file, 'webkitRelativePath', {
              value: entry.fullPath.startsWith('/') ? entry.fullPath.substring(1) : entry.fullPath,
              writable: false,
            });
          }
          collectedEntriesInDirectory.push(file);
          totalFiles++;
        }
      } catch (err) {
        console.error(`获取文件错误: ${entry.name}`, err);
      }
    } else if (entry.isDirectory) {
      try {
        const dirReader = (entry as FileSystemDirectoryEntry).createReader();
        const newEntries = await readEntriesRecursive(dirReader);
        console.log(`从目录 ${entry.fullPath || entry.name} 读取到 ${newEntries.length} 个条目`);
        queue.push(...newEntries);
      } catch (err) {
        console.error(`读取子目录错误: ${entry.name}`, err);
      }
    }
  }
  console.log(`文件夹 ${folderPath} 读取完成: 处理了 ${processedEntriesCount} 个条目，找到 ${totalFiles} 个文件`);
  return collectedEntriesInDirectory;
};

</script>

<style lang="scss" scoped>
// 颜色变量
$primary-color: var(--el-color-primary);
$danger-color: var(--el-color-danger);
$text-color: var(--el-text-color-primary);
$text-secondary: var(--el-text-color-secondary);
$border-color: var(--el-border-color);
$border-color-light: var(--el-border-color-lighter);
$bg-color: var(--el-bg-color);

// 尺寸变量
$border-radius: 4px;
$spacing-sm: 8px;
$spacing-md: 10px;
$spacing-lg: 16px;
$spacing-xl: 20px;

.upload-tabs {
  margin-bottom: $spacing-lg;
}

// 上传区域样式
:deep(.upload-area) {
  .el-upload {
    width: 100%;

    .el-upload-dragger {
      width: 100%;
      height: 200px;
      border: 2px dashed var(--el-border-color);

      &:hover {
        border-color: var(--el-color-primary);
      }

      .el-icon--upload {
        margin-top: 40px;
        color: var(--el-text-color-secondary);
        font-size: 48px;
      }

      .el-upload__text {
        margin-top: 20px;
        color: var(--el-text-color-regular);

        em {
          color: var(--el-color-primary);
          font-style: normal;
        }
      }
    }
  }

  .el-upload__tip {
    margin-top: 10px;
    color: var(--el-text-color-secondary);
    font-size: 12px;
    line-height: 1.4;
  }

  .el-upload-list {
    margin-top: 20px;
  }
}

// 文件列表样式
:deep(.el-upload-list) {
  .el-upload-list__item {
    transition: none;

    &:hover {
      background-color: var(--el-fill-color-lighter);
    }

    .el-upload-list__item-name {
      color: var(--el-text-color-regular);

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
}

// 对话框内容样式
:deep(.el-dialog__body) {
  padding: 20px;
}

// 上传容器
.upload-container {
  margin: 20px 0;
}

// 选中的文件列表
.selected-files {
  overflow-y: auto;
  max-height: 200px;
  margin-bottom: $spacing-xl;
  border: 1px solid $border-color-light;
  border-radius: $border-radius;

  .file-list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-md;
    border-bottom: 1px solid $border-color-light;
    background-color: $bg-color;

    .clear-btn {
      margin: 0;
      padding: 0;
    }
  }

  .file-list {
    padding: $spacing-md;

    .file-item {
      display: flex;
      align-items: center;
      padding: $spacing-sm;
      border-bottom: 1px solid $border-color-light;

      .file-icon {
        margin-right: $spacing-md;
        color: $primary-color;
      }

      .file-info {
        flex-grow: 1;

        .file-name {
          overflow: hidden;
          max-width: 350px;
          color: $text-color;
          font-size: 14px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .file-size {
          color: $text-secondary;
          font-size: 12px;
        }
      }

      .remove-file-btn {
        margin: 0;
        padding: 0;
        cursor: pointer;
      }
    }
  }
}
</style>

<style lang="scss">
.upload-dialog {
  .el-dialog__body {
    overflow-y: hidden;
  }
}
</style>
