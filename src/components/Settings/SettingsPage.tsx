import { useState, useRef, type ChangeEvent } from 'react';
import { db } from '../../db';
import { Download, Upload, Trash2, Info, AlertTriangle, CheckCircle, FolderOpen, Save, Activity } from 'lucide-react';
import {
    selectSaveFolder,
    loadSaveConfig,
    saveSaveConfig,
    getStoredDirectoryHandle,
    verifyPermission,
    type SaveConfig
} from '../../utils/fileSystem';
import { useEffect } from 'react';
import { cn } from '../../lib/utils';

export function SettingsPage() {
    const [importing, setImporting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [saveConfig, setSaveConfig] = useState<SaveConfig>({ autoSaveEnabled: false });
    const [folderName, setFolderName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        const config = await loadSaveConfig();
        setSaveConfig(config);

        const handle = await getStoredDirectoryHandle();
        if (handle) {
            setFolderName(handle.name);
            const hasPermission = await verifyPermission(handle, false);
            if (!hasPermission) {
                // We won't prompt here on load
            }
        }
    };

    const handleSelectFolder = async () => {
        const handle = await selectSaveFolder();
        if (handle) {
            setFolderName(handle.name);
            const newConfig = { ...saveConfig, autoSaveEnabled: true };
            await saveSaveConfig(newConfig);
            setSaveConfig(newConfig);
            setMessage({ type: 'success', text: `TARGET_DIR_SET: ${handle.name}` });

            await verifyPermission(handle, true);
        }
    };

    const handleToggleAutoSave = async () => {
        if (!saveConfig.autoSaveEnabled) {
            const handle = await getStoredDirectoryHandle();
            if (!handle) {
                handleSelectFolder();
                return;
            }

            const hasPermission = await verifyPermission(handle, true);
            if (!hasPermission) {
                setMessage({ type: 'error', text: 'PERMISSION_DENIED: WRITE_ACCESS_REQUIRED' });
                return;
            }
        }

        const newConfig = { ...saveConfig, autoSaveEnabled: !saveConfig.autoSaveEnabled };
        await saveSaveConfig(newConfig);
        setSaveConfig(newConfig);
    };

    const handleManualSave = async () => {
        const handle = await getStoredDirectoryHandle();
        if (!handle) {
            handleSelectFolder();
            return;
        }

        const hasPermission = await verifyPermission(handle, true);
        if (!hasPermission) {
            setMessage({ type: 'error', text: 'ACCESS_DENIED: NO_WRITE_PERMISSION' });
            return;
        }

        try {
            const allPosts = await db.posts.toArray();
            const { saveToFolder } = await import('../../utils/fileSystem');

            const timestamp = new Date().toISOString().split('T')[0];
            const filename = `diary-backup-${timestamp}.json`;
            const dataStr = JSON.stringify(allPosts, null, 2);

            await saveToFolder(handle, filename, dataStr);

            setMessage({ type: 'success', text: 'MANUAL_BACKUP: SUCCESSFUL' });

            const config = await loadSaveConfig();
            await saveSaveConfig({ ...config, lastSaveTime: Date.now() });
            setSaveConfig({ ...config, lastSaveTime: Date.now() });

        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'BACKUP_FAILED: SYSTEM_ERROR' });
        }
    };


    const handleExport = async () => {
        try {
            const allPosts = await db.posts.toArray();
            const dataStr = JSON.stringify(allPosts, null, 2);
            const blob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `diary-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setMessage({ type: 'success', text: 'EXPORT_COMPLETE: DATA_DOWNLOADED' });
        } catch (error) {
            console.error('Export failed:', error);
            setMessage({ type: 'error', text: 'EXPORT_FAILED: RETRY_REQUIRED' });
        }
    };

    const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (confirm('WARNING: IMPORT will MERGE data. Continue?')) {
            setImporting(true);
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const json = JSON.parse(event.target?.result as string);
                    if (!Array.isArray(json)) throw new Error('INVALID_FORMAT_DETECTED');

                    if (json.length > 0 && !json[0].createdAt) {
                        throw new Error('INVALID_SCHEMA_DETECTED');
                    }

                    await db.posts.bulkPut(json);
                    setMessage({ type: 'success', text: `IMPORT_SUCCESS: ${json.length} ENTRIES INTEGRATED` });
                    setTimeout(() => window.location.reload(), 1500);
                } catch (error) {
                    console.error('Import failed:', error);
                    setMessage({ type: 'error', text: 'IMPORT_FAILED: CORRUPT_DATA' });
                } finally {
                    setImporting(false);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                }
            };
            reader.readAsText(file);
        }
    };

    const handleClearData = async () => {
        if (confirm('CRITICAL WARNING: PERMANENT DATA DELETION.\n\nPROCEED?')) {
            if (confirm('CONFIRM DELETION: THIS CANNOT BE UNDONE.')) {
                try {
                    await db.posts.clear();
                    setMessage({ type: 'success', text: 'SYSTEM_WIPE: COMPLETED' });
                    setTimeout(() => window.location.reload(), 1500);
                } catch (error) {
                    setMessage({ type: 'error', text: 'WIPE_FAILED: SYSTEM_ERROR' });
                }
            }
        }
    };

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md p-4 border-b border-white/10">
                <h2 className="text-xl font-orbitron font-bold text-neon-blue tracking-widest flex items-center gap-2">
                    <Activity className="h-5 w-5 animate-pulse" />
                    SYSTEM_CONFIG
                </h2>
            </div>

            <div className="p-4 space-y-8 max-w-3xl mx-auto mt-4">
                {/* Status Message */}
                {message && (
                    <div className={cn(
                        "p-4 border backdrop-blur-md animate-in slide-in-from-top-2",
                        message.type === 'success'
                            ? "bg-neon-green/10 border-neon-green/30 text-neon-green"
                            : "bg-red-500/10 border-red-500/30 text-red-500"
                    )}>
                        <div className="flex items-center gap-3">
                            {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                            <p className="font-mono text-sm font-bold tracking-wide uppercase">{message.text}</p>
                        </div>
                    </div>
                )}

                {/* Auto Backup Section */}
                <section className="space-y-4">
                    <h3 className="text-xs font-mono text-neon-blue/70 uppercase tracking-widest pl-1 border-l-2 border-neon-blue px-2">
                        AUTO_BACKUP_MODULE
                    </h3>

                    <div className="glass-panel p-6 space-y-6">
                        {/* Folder Selection */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded bg-secondary/10 border border-white/5 hover:border-neon-blue/30 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-neon-purple/10 text-neon-purple rounded-none border border-neon-purple/20 group-hover:bg-neon-purple/20 transition-colors">
                                    <FolderOpen className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-orbitron text-sm font-bold tracking-wide text-foreground/90">TARGET_DIRECTORY</h4>
                                    <p className="font-mono text-xs text-muted-foreground mt-1">
                                        {folderName ? <span className="text-neon-blue">{folderName}</span> : 'NO_DIRECTORY_SELECTED'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleSelectFolder}
                                className="px-4 py-2 bg-transparent border border-neon-blue/30 text-neon-blue font-mono text-xs hover:bg-neon-blue/10 hover:border-neon-blue transition-all uppercase tracking-wider"
                            >
                                {folderName ? 'CHANGE_DIR' : 'SELECT_DIR'}
                            </button>
                        </div>

                        {/* Auto Save Toggle */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded bg-secondary/10 border border-white/5 hover:border-neon-blue/30 transition-colors highlight-group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-neon-green/10 text-neon-green rounded-none border border-neon-green/20">
                                    <Save className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-orbitron text-sm font-bold tracking-wide text-foreground/90">AUTO_SAVE_PROTOCOL</h4>
                                    <div className="flex flex-col">
                                        <p className="font-mono text-xs text-muted-foreground mt-1">
                                            STATUS: {saveConfig.autoSaveEnabled ? <span className="text-neon-green">ACTIVE</span> : <span className="text-white/30">INACTIVE</span>}
                                        </p>
                                        {saveConfig.lastSaveTime && (
                                            <p className="font-mono text-[10px] text-white/30 mt-1">
                                                LAST_SYNC: {new Date(saveConfig.lastSaveTime).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {folderName && (
                                    <button
                                        onClick={handleManualSave}
                                        className="px-3 py-2 bg-white/5 hover:bg-white/10 text-xs font-mono text-white/70 border border-white/10 hover:border-white/30 transition-all uppercase"
                                    >
                                        FORCE_SYNC
                                    </button>
                                )}
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={saveConfig.autoSaveEnabled}
                                        onChange={handleToggleAutoSave}
                                        disabled={!folderName}
                                    />
                                    <div className="w-11 h-6 bg-gray-700/50 border border-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-neon-blue rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/50 after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-blue/20 peer-checked:after:bg-neon-blue peer-checked:after:border-neon-blue peer-checked:border-neon-blue/50"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Data Management Section */}
                <section className="space-y-4">
                    <h3 className="text-xs font-mono text-neon-blue/70 uppercase tracking-widest pl-1 border-l-2 border-neon-blue px-2">
                        DATA_MANAGEMENT
                    </h3>

                    <div className="glass-panel p-6 space-y-4">
                        {/* Export */}
                        <div className="p-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-500/10 text-blue-400">
                                    <Download className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-orbitron text-sm">EXPORT_DATA</h4>
                                    <p className="font-mono text-xs text-muted-foreground">JSON_DUMP</p>
                                </div>
                            </div>
                            <button
                                onClick={handleExport}
                                className="px-4 py-2 border border-white/10 hover:border-neon-blue/50 hover:text-neon-blue text-xs font-mono uppercase tracking-wider transition-all"
                            >
                                EXECUTE
                            </button>
                        </div>

                        {/* Import */}
                        <div className="p-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-green-500/10 text-green-400">
                                    <Upload className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-orbitron text-sm">IMPORT_DATA</h4>
                                    <p className="font-mono text-xs text-muted-foreground">RESTORE_FROM_BACKUP</p>
                                </div>
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={importing}
                                className="px-4 py-2 border border-white/10 hover:border-neon-green/50 hover:text-neon-green text-xs font-mono uppercase tracking-wider transition-all disabled:opacity-50"
                            >
                                {importing ? 'PROCESSING...' : 'INITIATE'}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".json"
                                onChange={handleImport}
                            />
                        </div>

                        {/* Clear Data */}
                        <div className="p-4 flex items-center justify-between hover:bg-red-500/5 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-red-500/10 text-red-500">
                                    <Trash2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-orbitron text-sm text-red-400 group-hover:text-red-500 transition-colors">PURGE_DATABASE</h4>
                                    <p className="font-mono text-xs text-muted-foreground">IRREVERSIBLE_ACTION</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClearData}
                                className="px-4 py-2 border border-red-500/30 text-red-500/70 hover:bg-red-500/20 hover:text-red-500 rounded-none text-xs font-mono uppercase tracking-widest transition-all"
                            >
                                PURGE
                            </button>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="space-y-4">
                    <h3 className="text-xs font-mono text-neon-blue/70 uppercase tracking-widest pl-1 border-l-2 border-neon-blue px-2">
                        SYSTEM_INFO
                    </h3>

                    <div className="glass-panel p-4 flex items-center gap-4">
                        <div className="p-2 bg-neon-purple/10 text-neon-purple">
                            <Info className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="font-orbitron font-bold text-sm tracking-wide">DIARY-X</h4>
                            <p className="font-mono text-xs text-muted-foreground">BUILD: 0.1.0 // LOCAL_CORE</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
