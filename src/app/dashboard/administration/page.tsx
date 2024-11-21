"use client"

import React, { useEffect, useState } from "react"
import { useSession, signIn } from "next-auth/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Clock, Bell } from 'lucide-react'
import EmployeeHoursTable from "@/components/EmployeeHoursTable"
import AdminAlertPanel from "@/components/AdminAlertPanel"

export default function AdministrationPage() {
  const { data: session, status } = useSession()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasRoleAccess, setHasRoleAccess] = useState(false)

  useEffect(() => {
    if (status === "authenticated" && session) {
      setIsAuthenticated(true)
      const userRole = session.user.role
      if (userRole === "JEFE_MECANICO") {
        setHasRoleAccess(true)
      } else {
        console.log("Access denied - user role is:", userRole)
      }
    } else if (status === "unauthenticated") {
      signIn()
    }
  }, [status, session])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Cargando...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Redirigiendo al inicio de sesión...</p>
      </div>
    )
  }

  if (!hasRoleAccess) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acceso denegado</AlertTitle>
          <AlertDescription>
            No tienes los permisos necesarios para acceder a esta página.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Panel de Administración</CardTitle>
          <CardDescription>
            Gestiona las horas de los empleados y las alertas del sistema
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="hours" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hours">
            <Clock className="mr-2 h-4 w-4" />
            Horas de Empleados
          </TabsTrigger>
          <TabsTrigger value="alerts">
            <Bell className="mr-2 h-4 w-4" />
            Alertas
          </TabsTrigger>
        </TabsList>
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Horas de Empleados</CardTitle>
              <CardDescription>
                Revisa y gestiona las horas trabajadas por los empleados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmployeeHoursTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Alertas</CardTitle>
              <CardDescription>
                Crea y administra las alertas del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminAlertPanel />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

