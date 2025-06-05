import React, { useState } from 'react';
import CalendarView from './CalendarView';
import TaskDetails from './TaskDetails';

const exampleTasks = [
  {
    id: 1,
    title: 'Task 1',
    dueDate: '2024-06-10',
    urgency: 'high',
    status: 'in progress',
    assignedTo: 'Alice',
    startDate: '2024-06-01T09:00:00',
    category: 'Work',
    label: 'Important',
    description: 'Description for Task 1',
    subtasks: [
      { id: 11, title: 'Subtask 1', completed: false },
      { id: 12, title: 'Subtask 2', completed: true },
    ],
    comments: [
      { id: 101, text: 'This is a comment on Task 1' },
    ],
  },
  {
    id: 2,
    title: 'Task 2',
    dueDate: '2024-06-15',
    urgency: 'medium',
    status: 'incomplete',
    assignedTo: 'Bob',
    startDate: '2024-06-05T10:00:00',
    category: 'Personal',
    label: 'Urgent',
    description: 'Description for Task 2',
    subtasks: [
      { id: 21, title: 'Subtask A', completed: false },
    ],
    comments: [],
  },
  {
    id: 3,
    title: 'Task 3',
    dueDate: '2024-06-20',
    urgency: 'low',
    status: 'completed',
    assignedTo: 'Charlie',
    startDate: '2024-06-10T11:00:00',
    category: 'Home',
    label: 'Low Priority',
    description: 'Description for Task 3',
    subtasks: [],
    comments: [
      { id: 301, text: 'Completed task comment' },
    ],
  },
];

function CalendarPage() {
  const [tasks, setTasks] = useState(exampleTasks);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleAddTask = (date) => {
    const newTask = {
      id: Date.now(),
      title: `New Task on ${date}`,
      dueDate: date,
      urgency: 'low',
      status: 'incomplete',
      assignedTo: '',
      startDate: date + 'T00:00:00',
      category: '',
      label: '',
      description: '',
      subtasks: [],
      comments: [],
    };
    setTasks([...tasks, newTask]);
    console.log('Added task:', newTask);
  };

  const handleTaskClick = (task) => {
    console.log('Task clicked:', task);
    setSelectedTask(task);
  };

  console.log('Selected task:', selectedTask);

  const handleCloseTaskDetails = () => {
    setSelectedTask(null);
  };

  return (
    <div>
      <h1>Calendar Page</h1>
      <CalendarView tasks={tasks} onAddTask={handleAddTask} onTaskClick={handleTaskClick} />
      {selectedTask && (
        <TaskDetails task={selectedTask} onClose={handleCloseTaskDetails} />
      )}
      {selectedTask && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, backgroundColor: 'yellow', padding: '10px', zIndex: 3000 }}>
          Selected Task: {selectedTask.title}
        </div>
      )}
    </div>
  );
}

export default CalendarPage;
