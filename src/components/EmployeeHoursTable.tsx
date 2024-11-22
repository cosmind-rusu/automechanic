"use client"

import React, { useState, useEffect } from "react"
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface ClockInRecord {
  id: string
  usuario: string
  clockIn: string
  clockOut: string | null
}

const EmployeeHoursTable = () => {
  const [clockInRecords, setClockInRecords] = useState<ClockInRecord[]>([])
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(today.setDate(diff))
  })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchClockInRecords(currentWeekStart)
  }, [currentWeekStart])

  const fetchClockInRecords = async (weekStart: Date) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/administration/clockin?weekStart=${weekStart.toISOString()}`)
      if (!response.ok) {
        throw new Error("Failed to fetch clock-in records")
      }
      const data = await response.json()
      setClockInRecords(data)
    } catch (error) {
      console.error("Error fetching clock-in records:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los registros de horas. Por favor, intente de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreviousWeek = () => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(currentWeekStart.getDate() - 7)
    setCurrentWeekStart(newDate)
  }

  const handleNextWeek = () => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(currentWeekStart.getDate() + 7)
    
    const today = new Date()
    const currentWeekStartDate = getWeekStart(today)
    
    if (newDate <= currentWeekStartDate) {
      setCurrentWeekStart(newDate)
    }
  }

  const getWeekStart = (date: Date) => {
    const newDate = new Date(date)
    const day = newDate.getDay()
    const diff = newDate.getDate() - day + (day === 0 ? -6 : 1)
    newDate.setDate(diff)
    return newDate
  }

  const formatTime = (time: string | null) => {
    if (!time) return "N/A"
    const date = new Date(time)
    return date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  const calculateHoursWorked = (clockIn: string, clockOut: string | null) => {
    if (!clockOut) return "N/A"
    const start = new Date(clockIn)
    const end = new Date(clockOut)
    const diffInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    return diffInHours.toFixed(2)
  }

  const formatWeekDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long'
    }
    return `Semana del ${date.toLocaleDateString('es', options)}`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const isCurrentWeek = (date: Date) => {
    const today = new Date()
    const currentWeekStart = getWeekStart(today)
    const nextWeekStart = new Date(date)
    nextWeekStart.setDate(date.getDate() + 7)
    return nextWeekStart > currentWeekStart
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-6 h-6" />
          <span>Horas de los Empleados</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Button onClick={handlePreviousWeek} variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold">
            {formatWeekDate(currentWeekStart)}
          </span>
          <Button
            onClick={handleNextWeek}
            variant="outline"
            size="icon"
            disabled={!isCurrentWeek(currentWeekStart)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Entrada</TableHead>
                <TableHead>Salida</TableHead>
                <TableHead>Horas Trabajadas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 5 }).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : clockInRecords.length > 0 ? (
                clockInRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.usuario}</TableCell>
                    <TableCell>{formatDate(record.clockIn)}</TableCell>
                    <TableCell>{formatTime(record.clockIn)}</TableCell>
                    <TableCell>{formatTime(record.clockOut)}</TableCell>
                    <TableCell>{calculateHoursWorked(record.clockIn, record.clockOut)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No hay registros para esta semana
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default EmployeeHoursTable