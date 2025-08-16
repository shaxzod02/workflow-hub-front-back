import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRealtimeStore } from '@/store/realtimeStore';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return 'bg-success';
    case 'away': return 'bg-warning';
    case 'busy': return 'bg-destructive';
    default: return 'bg-muted-foreground';
  }
};

export const OnlineUsers = () => {
  const { onlineUsers, isConnected } = useRealtimeStore();

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Team Online</CardTitle>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success' : 'bg-destructive'}`} />
            <span className="text-xs text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        <CardDescription>
          {onlineUsers.filter(u => u.status === 'online').length} members online
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {onlineUsers.slice(0, 6).map((user) => (
            <div key={user.id} className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-xs">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div 
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {user.currentPage ? `Viewing ${user.currentPage.replace('/', '')}` : user.status}
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {user.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};