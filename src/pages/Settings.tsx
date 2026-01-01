import { useRef, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Maximize,
  Moon,
  Download,
  Upload,
  Trash2,
  Info,
  FolderOpen,
} from 'lucide-react';

const Settings = () => {
  const { data, updateSettings, exportData, importData } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleExport = async () => {
    const jsonData = exportData();
    const blob = new Blob([jsonData], { type: 'application/json' });
    
    // Try to use File System Access API for folder selection
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: `novel-companion-backup-${new Date().toISOString().split('T')[0]}.json`,
          types: [{
            description: 'JSON Files',
            accept: { 'application/json': ['.json'] },
          }],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        toast.success('Data exported successfully!');
        return;
      } catch (err) {
        // User cancelled or API not fully supported
        if ((err as Error).name !== 'AbortError') {
          console.error('File save error:', err);
        }
      }
    }
    
    // Fallback to download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `novel-companion-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Data exported! Check your downloads folder.');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importData(content);
      
      if (success) {
        toast.success('Data imported successfully!');
      } else {
        toast.error('Failed to import data. Invalid file format.');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    e.target.value = '';
  };

  const handleClearData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Settings" />

      <main className="page-container space-y-4">
        {/* Display Settings */}
        <section>
          <h2 className="font-serif font-semibold text-lg mb-3">Display</h2>
          <Card className="divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Maximize className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="fullscreen" className="font-medium">Fullscreen Mode</Label>
                  <p className="text-xs text-muted-foreground">Hide system UI for immersive reading</p>
                </div>
              </div>
              <Switch
                id="fullscreen"
                checked={data.settings.fullscreenMode}
                onCheckedChange={(checked) => updateSettings({ fullscreenMode: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label className="font-medium">Theme</Label>
                  <p className="text-xs text-muted-foreground">Choose your preferred appearance</p>
                </div>
              </div>
              <Select
                value={data.settings.theme}
                onValueChange={(value: 'light' | 'dark' | 'system') => updateSettings({ theme: value })}
              >
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        </section>

        {/* Data Management */}
        <section>
          <h2 className="font-serif font-semibold text-lg mb-3">Data Management</h2>
          <Card className="divide-y divide-border">
            <button
              onClick={handleExport}
              className="flex items-center gap-3 w-full p-4 text-left hover:bg-muted/50 transition-colors"
            >
              <Download className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">Export Data</p>
                <p className="text-xs text-muted-foreground">Save all your data as a JSON file</p>
              </div>
              <FolderOpen className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-3 w-full p-4 text-left hover:bg-muted/50 transition-colors"
            >
              <Upload className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">Import Data</p>
                <p className="text-xs text-muted-foreground">Restore from a backup file</p>
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-3 w-full p-4 text-left hover:bg-destructive/10 transition-colors text-destructive"
            >
              <Trash2 className="w-5 h-5" />
              <div className="flex-1">
                <p className="font-medium">Clear All Data</p>
                <p className="text-xs opacity-70">Delete all novels, characters, and notes</p>
              </div>
            </button>
          </Card>
        </section>

        {/* About */}
        <section>
          <h2 className="font-serif font-semibold text-lg mb-3">About</h2>
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Novel Companion</p>
                <p className="text-sm text-muted-foreground mt-1">
                  A character database app for novel readers. Track characters, places, and important notes with Wikipedia-style linking.
                </p>
                <p className="text-xs text-muted-foreground mt-2">Version 1.0.0</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Stats */}
        <section>
          <h2 className="font-serif font-semibold text-lg mb-3">Statistics</h2>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{data.novels.length}</p>
              <p className="text-xs text-muted-foreground">Novels</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{data.characters.length}</p>
              <p className="text-xs text-muted-foreground">Characters</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{data.places.length}</p>
              <p className="text-xs text-muted-foreground">Places</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{data.notes.length}</p>
              <p className="text-xs text-muted-foreground">Notes</p>
            </Card>
          </div>
        </section>
      </main>

      <BottomNav />

      <ConfirmDialog
        open={showClearConfirm}
        onOpenChange={setShowClearConfirm}
        title="Clear All Data?"
        description="This will permanently delete all your novels, characters, places, and notes. This cannot be undone. Make sure to export your data first!"
        confirmLabel="Clear All"
        onConfirm={handleClearData}
        destructive
      />
    </div>
  );
};

export default Settings;
