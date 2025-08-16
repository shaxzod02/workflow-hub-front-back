import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  taskCount: number;
  children: React.ReactNode;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  color,
  taskCount,
  children,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col rounded-lg p-4 min-h-[600px] transition-all duration-200',
        color,
        isOver && 'ring-2 ring-primary ring-opacity-50 bg-opacity-80'
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <div className="bg-primary/10 text-primary text-sm px-2 py-1 rounded-full min-w-[24px] text-center">
          {taskCount}
        </div>
      </div>

      <div className="flex-1">{children}</div>

      {/* Drop zone indicator */}
      {isOver && (
        <div className="mt-4 p-4 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5 text-center text-sm text-muted-foreground">
          Drop task here
        </div>
      )}
    </div>
  );
};
