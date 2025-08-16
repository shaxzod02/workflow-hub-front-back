import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRealtimeStore } from '@/store/realtimeStore';

const getUpdateIcon = (type: string) => {
  switch (type) {
    case 'task_updated':
      return <div className="w-2 h-2 bg-primary rounded-full" />;
    case 'project_created':
      return <div className="w-2 h-2 bg-success rounded-full" />;
    case 'user_joined':
      return <div className="w-2 h-2 bg-warning rounded-full" />;
    case 'comment_added':
      return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
    default:
      return <div className="w-2 h-2 bg-muted-foreground rounded-full" />;
  }
};

const getUpdateColor = (type: string) => {
  switch (type) {
    case 'task_updated': return 'bg-primary/10 text-primary';
    case 'project_created': return 'bg-success/10 text-success';
    case 'user_joined': return 'bg-warning/10 text-warning';
    case 'comment_added': return 'bg-blue-500/10 text-blue-500';
    default: return 'bg-muted text-muted-foreground';
  }
};

export const LiveUpdates = () => {
  const { liveUpdates } = useRealtimeStore();

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Live Updates</CardTitle>
        <CardDescription>Real-time activity from your team</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin">
          {liveUpdates.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent updates
            </p>
          ) : (
            liveUpdates.map((update) => (
              <div key={update.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors animate-fade-in">
                {getUpdateIcon(update.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{update.user}</span>{' '}
                    {update.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className={`text-xs ${getUpdateColor(update.type)}`}>
                      {update.type.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(update.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};