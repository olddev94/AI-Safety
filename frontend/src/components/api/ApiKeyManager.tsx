import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Copy, Eye, EyeOff, Plus, Trash2, Key, Calendar, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ApiKey {
    id: string;
    name: string;
    key: string;
    createdAt: string;
    lastUsed?: string;
    usageCount: number;
    status: 'active' | 'revoked';
}

export function ApiKeyManager() {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [newKeyName, setNewKeyName] = useState('');
    const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        loadApiKeys();
    }, []);

    const loadApiKeys = () => {
        try {
            const stored = localStorage.getItem('apiKeys');
            if (stored) {
                setApiKeys(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Error loading API keys:', error);
        }
    };

    const saveApiKeys = (keys: ApiKey[]) => {
        localStorage.setItem('apiKeys', JSON.stringify(keys));
        setApiKeys(keys);
    };

    const generateApiKey = (): string => {
        const prefix = 'aik_'; // AI Incident Key prefix
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = prefix;
        for (let i = 0; i < 32; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const createApiKey = async () => {
        if (!newKeyName.trim()) {
            toast.error('Please enter a name for the API key');
            return;
        }

        setIsCreating(true);
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newKey: ApiKey = {
                id: Date.now().toString(),
                name: newKeyName.trim(),
                key: generateApiKey(),
                createdAt: new Date().toISOString(),
                usageCount: 0,
                status: 'active'
            };

            const updatedKeys = [...apiKeys, newKey];
            saveApiKeys(updatedKeys);
            setNewKeyName('');
            toast.success('API key created successfully!');
        } catch (error) {
            toast.error('Failed to create API key');
        } finally {
            setIsCreating(false);
        }
    };

    const revokeApiKey = (keyId: string) => {
        const updatedKeys = apiKeys.map(key =>
            key.id === keyId ? { ...key, status: 'revoked' as const } : key
        );
        saveApiKeys(updatedKeys);
        toast.success('API key revoked successfully');
    };

    const deleteApiKey = (keyId: string) => {
        const updatedKeys = apiKeys.filter(key => key.id !== keyId);
        saveApiKeys(updatedKeys);
        toast.success('API key deleted successfully');
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const toggleKeyVisibility = (keyId: string) => {
        const newVisibleKeys = new Set(visibleKeys);
        if (newVisibleKeys.has(keyId)) {
            newVisibleKeys.delete(keyId);
        } else {
            newVisibleKeys.add(keyId);
        }
        setVisibleKeys(newVisibleKeys);
    };

    const maskKey = (key: string): string => {
        if (key.length <= 8) return key;
        return key.substring(0, 8) + '•'.repeat(key.length - 12) + key.substring(key.length - 4);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Key className="w-6 h-6" />
                        API Key Management
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Create and manage API keys for programmatic access to the incident data
                    </p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Create New Key
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New API Key</DialogTitle>
                            <DialogDescription>
                                Give your API key a descriptive name to help you identify its purpose.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Input
                                    placeholder="e.g., Production Dashboard, Mobile App, etc."
                                    value={newKeyName}
                                    onChange={(e) => setNewKeyName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && createApiKey()}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <DialogTrigger asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogTrigger>
                                <Button onClick={createApiKey} disabled={isCreating}>
                                    {isCreating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create Key
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* API Keys List */}
            {apiKeys.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No API Keys Yet</h3>
                        <p className="text-muted-foreground mb-4">
                            Create your first API key to start accessing the incident data programmatically.
                        </p>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Your First Key
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create New API Key</DialogTitle>
                                    <DialogDescription>
                                        Give your API key a descriptive name to help you identify its purpose.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Input
                                            placeholder="e.g., Production Dashboard, Mobile App, etc."
                                            value={newKeyName}
                                            onChange={(e) => setNewKeyName(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && createApiKey()}
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <DialogTrigger asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogTrigger>
                                        <Button onClick={createApiKey} disabled={isCreating}>
                                            {isCreating ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                    Creating...
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Create Key
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {apiKeys.map((apiKey) => (
                        <Card key={apiKey.id}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold">{apiKey.name}</h3>
                                            <Badge variant={apiKey.status === 'active' ? 'default' : 'secondary'}>
                                                {apiKey.status}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center gap-2 mb-3">
                                            <code className="bg-muted px-3 py-1 rounded font-mono text-sm">
                                                {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                                            </code>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => toggleKeyVisibility(apiKey.id)}
                                            >
                                                {visibleKeys.has(apiKey.id) ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => copyToClipboard(apiKey.key)}
                                            >
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                Created {format(new Date(apiKey.createdAt), 'MMM d, yyyy')}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Activity className="w-4 h-4" />
                                                {apiKey.usageCount} requests
                                            </div>
                                            {apiKey.lastUsed && (
                                                <div>
                                                    Last used {format(new Date(apiKey.lastUsed), 'MMM d, yyyy')}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {apiKey.status === 'active' && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => revokeApiKey(apiKey.id)}
                                            >
                                                Revoke
                                            </Button>
                                        )}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="sm" variant="destructive">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete the API key "{apiKey.name}"?
                                                        This action cannot be undone and will immediately stop all requests using this key.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => deleteApiKey(apiKey.id)}
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    >
                                                        Delete Key
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Usage Information */}
            <Card>
                <CardHeader>
                    <CardTitle>API Usage Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Authentication</h4>
                        <p className="text-sm text-muted-foreground">
                            Include your API key in the request header: <code className="bg-muted px-1 rounded">Authorization: Bearer YOUR_API_KEY</code>
                        </p>
                    </div>
                    <Separator />
                    <div>
                        <h4 className="font-semibold mb-2">Rate Limits</h4>
                        <p className="text-sm text-muted-foreground">
                            Currently no rate limits are enforced, but please use the API responsibly to ensure service quality for all users.
                        </p>
                    </div>
                    <Separator />
                    <div>
                        <h4 className="font-semibold mb-2">Security</h4>
                        <p className="text-sm text-muted-foreground">
                            Keep your API keys secure and never expose them in client-side code. Revoke keys immediately if compromised.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
