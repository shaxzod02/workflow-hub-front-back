import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useUpdateProjectGraphQL, updateProjectGraphQL } from '@/hooks/useProjectsGraphQL';
import { type Project } from '@/store/appStore';
import { useToast } from '@/hooks/use-toast';

interface EditProjectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project: Project | null;
}

export const EditProjectModal = ({
    open,
    onOpenChange,
    project,
}: EditProjectModalProps) => {
    console.log('EditProjectModal project:', project);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'planning' as Project['status'],
    });
    const [selectedDate, setSelectedDate] = useState<Date>();

    const [updateProject, { loading }] = useUpdateProjectGraphQL();
    const { toast } = useToast();

    // Initialize form data when project changes
    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title,
                description: project.description,
                status: project.status,
            });
            // Handle timestamp format for dueDate
            if (project.dueDate) {
                const timestamp = Number(project.dueDate);
                setSelectedDate(new Date(timestamp));
            } else {
                setSelectedDate(undefined);
            }
        }
    }, [project]);

    // Reset form when modal closes
    useEffect(() => {
        if (!open) {
            setFormData({
                title: '',
                description: '',
                status: 'planning',
            });
            setSelectedDate(undefined);
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!project) return;

        if (!formData.title.trim()) {
            toast({
                title: 'Error',
                description: 'Project title is required',
                variant: 'destructive',
            });
            return;
        }

        try {
            await updateProject(updateProjectGraphQL(project.id, {
                title: formData.title,
                description: formData.description,
                status: formData.status,
                dueDate: selectedDate
                    ? selectedDate.getTime().toString()
                    : project.dueDate,
            }));

            onOpenChange(false);
        } catch (error) {
            // Error is handled in the GraphQL hook
            console.error('Update project error:', error);
        }
    };

    if (!project) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Project</DialogTitle>
                    <DialogDescription>
                        Update the project details below.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Project Name *</Label>
                        <Input
                            id="name"
                            placeholder="Enter project name"
                            value={formData.title}
                            onChange={e =>
                                setFormData(prev => ({ ...prev, title: e.target.value }))
                            }
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Enter project description"
                            value={formData.description}
                            onChange={e =>
                                setFormData(prev => ({ ...prev, description: e.target.value }))
                            }
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={value =>
                                setFormData(prev => ({
                                    ...prev,
                                    status: value as Project['status'],
                                }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="planning">Planning</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="on-hold">On Hold</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Due Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        'w-full justify-start text-left font-normal',
                                        !selectedDate && 'text-muted-foreground'
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Project'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
