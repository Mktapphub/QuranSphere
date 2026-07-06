import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Moon, Sun } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function SettingsDialog() {
  const { settings, updateSettings } = useAppContext();

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="ghost" size="icon" className="rounded-full" />}>
        <SettingsIcon className="h-5 w-5 text-primary" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium leading-none">Theme</label>
              <div className="flex items-center space-x-2">
                <Button 
                  variant={settings.theme === 'light' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => updateSettings({ theme: 'light' })}
                >
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                </Button>
                <Button 
                  variant={settings.theme === 'dark' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => updateSettings({ theme: 'dark' })}
                >
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium leading-none">Show English Translation</label>
              <Switch 
                checked={settings.showTranslation}
                onCheckedChange={(checked) => updateSettings({ showTranslation: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium leading-none">Show Bangla Translation</label>
              <Switch 
                checked={settings.showBanglaTranslation}
                onCheckedChange={(checked) => updateSettings({ showBanglaTranslation: checked })}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none">Arabic Font Size</label>
                <span className="text-sm text-muted-foreground">{settings.fontSize}px</span>
              </div>
              <Slider
                value={[settings.fontSize]}
                min={24}
                max={64}
                step={2}
                onValueChange={(value) => updateSettings({ fontSize: Array.isArray(value) ? value[0] : (value as number) })}
              />
            </div>
            
            <div className="pt-4 border-t border-border/50">
              <p className="text-center font-arabic" style={{ fontSize: `${settings.fontSize}px`, lineHeight: 2.2 }}>
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
