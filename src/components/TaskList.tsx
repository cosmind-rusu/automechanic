'use client'
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { CheckCircle, Edit, Trash, PlusCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const TaskList = () => {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]); // Especificar el tipo como Task[]
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const usuario = session?.user?.name; // Usar el nombre de usuario

  useEffect(() => {
    if (usuario) fetchTasks();
  }, [usuario]);

  const fetchTasks = async () => {
    const response = await fetch(`/api/task/read?usuario=${usuario}`);
    const data: Task[] = await response.json(); // Especificar que data es de tipo Task[]
    setTasks(data);
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    const response = await fetch('/api/task/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, title: newTaskTitle }), // Enviar usuario
    });
    const task: Task = await response.json(); // Especificar que task es de tipo Task
    setTasks([...tasks, task]);
    setNewTaskTitle('');
  };

  const handleUpdateTask = async (taskId: string, title: string, completed: boolean) => {
    await fetch('/api/task/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, title, completed }),
    });
    fetchTasks();
  };

  const handleDeleteTask = async (taskId: string) => {
    await fetch('/api/task/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId }),
    });
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-4">Mis Tareas</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Añadir nueva tarea"
          className="border p-2 flex-grow rounded-l-md"
        />
        <button onClick={handleAddTask} className="bg-green-500 text-white p-2 rounded-r-md hover:bg-green-600">
          <PlusCircle size={20} />
        </button>
      </div>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between p-2 border rounded">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleUpdateTask(task.id, task.title, !task.completed)}
              />
              <span className={task.completed ? 'line-through' : ''}>{task.title}</span>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => handleDeleteTask(task.id)} className="text-red-500 hover:text-red-700">
                <Trash size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
