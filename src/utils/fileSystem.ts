import { db } from '../db';

export interface SaveConfig {
    autoSaveEnabled: boolean;
    lastSaveTime?: number;
}

const CONFIG_KEY = 'auto_save_config';
const HANDLE_KEY = 'save_dir_handle';

/**
 * Request permission to access a directory
 */
export async function selectSaveFolder(): Promise<FileSystemDirectoryHandle | null> {
    try {
        if (!('showDirectoryPicker' in window)) {
            alert('您的浏览器不支持文件夹访问功能。');
            return null;
        }

        const dirHandle = await window.showDirectoryPicker({
            mode: 'readwrite',
            startIn: 'documents'
        });

        if (dirHandle) {
            await db.settings.put({ key: HANDLE_KEY, value: dirHandle });
            return dirHandle;
        }

        return null;
    } catch (error) {
        if ((error as Error).name !== 'AbortError') {
            console.error('Failed to select folder:', error);
        }
        return null;
    }
}

/**
 * Get stored directory handle
 */
export async function getStoredDirectoryHandle(): Promise<FileSystemDirectoryHandle | null> {
    try {
        const record = await db.settings.get(HANDLE_KEY);
        return record?.value || null;
    } catch (error) {
        console.error('Failed to get stored handle:', error);
        return null;
    }
}

/**
 * Verify permission for the handle
 */
export async function verifyPermission(handle: FileSystemDirectoryHandle, readWrite = true): Promise<boolean> {
    const options: FileSystemHandlePermissionDescriptor = {
        mode: readWrite ? 'readwrite' : 'read'
    };

    if ((await handle.queryPermission(options)) === 'granted') {
        return true;
    }

    if ((await handle.requestPermission(options)) === 'granted') {
        return true;
    }

    return false;
}

/**
 * Save data to a file in the directory
 */
export async function saveToFolder(
    dirHandle: FileSystemDirectoryHandle,
    filename: string,
    data: string
): Promise<boolean> {
    try {
        // Create or get the file
        const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(data);
        await writable.close();

        return true;
    } catch (error) {
        console.error('Failed to save file:', error);
        return false;
    }
}

/**
 * Save configuration
 */
export async function saveSaveConfig(config: SaveConfig): Promise<void> {
    await db.settings.put({ key: CONFIG_KEY, value: config });
}

/**
 * Load configuration
 */
export async function loadSaveConfig(): Promise<SaveConfig> {
    try {
        const record = await db.settings.get(CONFIG_KEY);
        return record?.value || { autoSaveEnabled: false };
    } catch {
        return { autoSaveEnabled: false };
    }
}

/**
 * Auto-save posts data
 */
export async function autoSavePosts(
    posts: unknown[]
): Promise<boolean> {
    const config = await loadSaveConfig();
    if (!config.autoSaveEnabled) return false;

    const dirHandle = await getStoredDirectoryHandle();
    if (!dirHandle) return false;

    // Check permission without prompting if possible, but for auto-save we might fail silently if permission is gone
    // We only try to verify if we have the handle. If queryPermission is not granted, we skip to avoid prompts during auto-save
    // except if the user explicitly triggered it (which is handled by UI). 
    // Here we assume "auto" means background. If permission is lost, we just fail silently or log.
    // However, verifyPermission(..., true) WILL prompt if not granted. 
    // For true "auto" save, we should check queryPermission first.

    const options: FileSystemHandlePermissionDescriptor = { mode: 'readwrite' };
    const permissionStatus = await dirHandle.queryPermission(options);

    if (permissionStatus !== 'granted') {
        console.warn('Auto-save skipped: Permission not granted');
        return false;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `diary-backup-${timestamp}.json`;
    const dataStr = JSON.stringify(posts, null, 2);

    const success = await saveToFolder(dirHandle, filename, dataStr);

    if (success) {
        await saveSaveConfig({
            ...config,
            lastSaveTime: Date.now()
        });
    }

    return success;
}
