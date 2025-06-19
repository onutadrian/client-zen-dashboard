
import { Task } from '@/types/task';
import { useHourEntries } from '@/hooks/useHourEntries';

export const createHourEntryForCompletedTask = async (
  task: Task,
  workedHours: number,
  addHourEntry: ReturnType<typeof useHourEntries>['addHourEntry']
) => {
  if (!task.projectId) {
    throw new Error('Task must have a project ID to create hour entry');
  }

  console.log('Creating hour entry for completed task:', {
    taskId: task.id,
    projectId: task.projectId,
    clientId: task.clientId,
    hours: workedHours
  });

  await addHourEntry({
    projectId: task.projectId,
    clientId: task.clientId,
    hours: workedHours,
    description: `Completed task: ${task.title}`,
    date: new Date().toISOString().split('T')[0],
    billed: false
  });

  console.log('Hour entry created successfully');
};
