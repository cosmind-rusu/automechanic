'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { CheckCircle, Edit, Trash, PlusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

interface Task {
  id: string
  title: string
  completed: boolean
}

export default function TaskList() {
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const usuario = session?.user?.name

  useEffect(() => {
    if (usuario) fetchTasks()
  }, [usuario])

  const fetchTasks = async () => {
    const response = await fetch(`/api/task/read?usuario=${usuario}`)
    const data: Task[] = await response.json()
    setTasks(data)
  }

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return

    const response = await fetch('/api/task/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, title: newTaskTitle }),
    })
    const task: Task = await response.json()
    setTasks([...tasks, task])
    setNewTaskTitle('')
  }

  const handleUpdateTask = async (taskId: string, title: string, completed: boolean) => {
    await fetch('/api/task/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, title, completed }),
    })
    fetchTasks()
  }

  const handleDeleteTask = async (taskId: string) => {
    await fetch('/api/task/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId }),
    })
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Mis Tareas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-6">
          <Input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Añadir nueva tarea"
            className="flex-grow"
          />
          <Button onClick={handleAddTask} className="bg-green-500 hover:bg-green-600">
            <PlusCircle className="mr-2 h-4 w-4" /> Añadir
          </Button>
        </div>
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(checked) => handleUpdateTask(task.id, task.title, checked as boolean)}
                />
                <span className={`text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {task.title}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)} className="text-red-500 hover:text-red-700 hover:bg-red-100">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

