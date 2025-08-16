import React from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useAppStore } from '@/store/appStore';
import { Task } from '@/store/appStore';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';

interface KanbanBoardProps {
  projectId?: string;
  tasks?: Task[];
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  projectId,
  tasks: propTasks,
}) => {
  const { tasks: storeTasks, moveTask } = useAppStore();
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Use provided tasks or filter from store
  const filteredTasks =
    propTasks ||
    (projectId
      ? storeTasks.filter(task => task.projectId === projectId)
      : storeTasks);

  const todoTasks = filteredTasks.filter(task => task.status === 'todo');
  const inProgressTasks = filteredTasks.filter(
    task => task.status === 'in-progress'
  );
  const doneTasks = filteredTasks.filter(task => task.status === 'done');

  const handleDragStart = (event: DragStartEvent) => {
    const task = filteredTasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Task['status'];

    // If dropped on a column, update the task status
    if (['todo', 'in-progress', 'done'].includes(newStatus)) {
      moveTask(taskId, newStatus);
    }
  };

  const columns = [
    {
      id: 'todo' as const,
      title: 'To Do',
      tasks: todoTasks,
      color: 'bg-slate-100 dark:bg-slate-800',
    },
    {
      id: 'in-progress' as const,
      title: 'In Progress',
      tasks: inProgressTasks,
      color: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      id: 'done' as const,
      title: 'Done',
      tasks: doneTasks,
      color: 'bg-green-50 dark:bg-green-900/20',
    },
  ];

  return (
    <div className="h-full">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {columns.map(column => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              taskCount={column.tasks.length}
            >
              <SortableContext
                items={column.tasks.map(task => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {column.tasks.map(task => (
                    <KanbanCard key={task.id} task={task} />
                  ))}
                </div>
              </SortableContext>
            </KanbanColumn>
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="rotate-3 opacity-80">
              <KanbanCard task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
