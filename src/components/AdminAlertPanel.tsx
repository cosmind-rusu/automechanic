"use client"

import React, { useState, useEffect } from 'react'
import { PlusCircle, AlertTriangle, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

type GeneralAlert = {
  id: string
  titulo: string
  mensaje: string
  activa: boolean
}

export default function AdminAlertPanel() {
  const [alerts, setAlerts] = useState<GeneralAlert[]>([])
  const [formData, setFormData] = useState({ titulo: '', mensaje: '' })
  const { toast } = useToast()

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/alerts')
      const data = await response.json()
      setAlerts(data)
    } catch (error) {
      console.error('Error fetching alerts:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las alertas.",
      })
    }
  }

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error('Failed to create alert')
      fetchAlerts()
      setFormData({ titulo: '', mensaje: '' })
      toast({
        title: "Éxito",
        description: "Alerta creada correctamente.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la alerta.",
      })
    }
  }

  const handleToggleActive = async (id: string, activa: boolean) => {
    try {
      await fetch('/api/alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, activa }),
      })
      fetchAlerts()
      toast({
        title: "Éxito",
        description: `Alerta ${activa ? 'activada' : 'desactivada'} correctamente.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar la alerta.",
      })
    }
  }

  const handleDeleteAlert = async (id: string) => {
    try {
      await fetch('/api/alerts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      fetchAlerts()
      toast({
        title: "Éxito",
        description: "Alerta eliminada correctamente.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la alerta.",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Gestión de Alertas</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Crear Nueva Alerta</CardTitle>
          <CardDescription>Añade una nueva alerta al sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateAlert} className="space-y-4">
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título</label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="mt-1 w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700">Mensaje</label>
              <Textarea
                id="mensaje"
                value={formData.mensaje}
                onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                className="mt-1 w-full"
                required
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> Crear Alerta
            </Button>
          </form>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Alertas Existentes</h2>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {alerts.map((alert) => (
          <Card key={alert.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">{alert.titulo}</CardTitle>
              <CardDescription className="text-sm">{alert.mensaje}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto flex flex-col sm:flex-row justify-between gap-2">
              <Button
                variant={alert.activa ? "default" : "outline"}
                onClick={() => handleToggleActive(alert.id, !alert.activa)}
                className="w-full sm:w-auto"
              >
                {alert.activa ? <ToggleRight className="mr-2 h-4 w-4" /> : <ToggleLeft className="mr-2 h-4 w-4" />}
                {alert.activa ? 'Desactivar' : 'Activar'}
              </Button>
              <Button variant="destructive" onClick={() => handleDeleteAlert(alert.id)} className="w-full sm:w-auto">
                <Trash2 className="mr-2 h-4 w-4" /> Eliminar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {alerts.length === 0 && (
        <Alert className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-sm font-semibold">No hay alertas</AlertTitle>
          <AlertDescription className="text-sm">
            No se han creado alertas todavía. Utiliza el formulario de arriba para crear una nueva alerta.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

