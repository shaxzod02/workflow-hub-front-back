import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAppStore } from '@/store/appStore';
import type { TeamMember } from '@/store/appStore';
import {
  TeamMemberProfileModal,
  AssignTaskModal,
  InviteMemberModal,
} from '@/components/modals';
import { useState } from 'react';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-success/10 text-success';
    case 'away':
      return 'bg-warning/10 text-warning';
    case 'offline':
      return 'bg-muted text-muted-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getStatusIndicator = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-success';
    case 'away':
      return 'bg-warning';
    case 'offline':
      return 'bg-muted-foreground';
    default:
      return 'bg-muted-foreground';
  }
};

export const Team = () => {
  const { teamMembers, tasks } = useAppStore();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAssignTaskModalOpen, setIsAssignTaskModalOpen] = useState(false);
  const [isInviteMemberModalOpen, setIsInviteMemberModalOpen] = useState(false);

  const handleViewProfile = (member: TeamMember) => {
    setSelectedMember(member);
    setIsProfileModalOpen(true);
  };

  const handleAssignTask = (member: TeamMember) => {
    setSelectedMember(member);
    setIsAssignTaskModalOpen(true);
  };

  const handleInviteMember = () => {
    setIsInviteMemberModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground mt-2">
            Manage your team members and their assignments
          </p>
        </div>
        <Button
          className="bg-gradient-primary hover:opacity-90"
          onClick={handleInviteMember}
        >
          Invite Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map(member => {
          const memberTasks = tasks.filter(task => task.assignee === member.id);
          const completedTasks = memberTasks.filter(
            task => task.status === 'done'
          ).length;
          const activeTasks = memberTasks.filter(
            task => task.status === 'in-progress'
          ).length;

          return (
            <Card
              key={member.id}
              className="shadow-soft hover:shadow-elevated transition-all duration-200"
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusIndicator(member.status)}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">
                      {member.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {member.role}
                    </p>
                    <Badge
                      className={`mt-1 ${getStatusColor(member.status)}`}
                      variant="secondary"
                    >
                      {member.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    {member.email}
                  </div>

                  {/* Task Statistics */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {activeTasks}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Active Tasks
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">
                        {completedTasks}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Completed
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewProfile(member)}
                    >
                      View Profile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAssignTask(member)}
                    >
                      Assign Task
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <TeamMemberProfileModal
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
        member={selectedMember}
      />

      {/* Assign Task Modal */}
      <AssignTaskModal
        open={isAssignTaskModalOpen}
        onOpenChange={setIsAssignTaskModalOpen}
        member={selectedMember}
      />

      {/* Invite Member Modal */}
      <InviteMemberModal
        open={isInviteMemberModalOpen}
        onOpenChange={setIsInviteMemberModalOpen}
      />
    </div>
  );
};
