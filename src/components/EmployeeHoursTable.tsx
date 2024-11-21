"use client"

import React, { useState, useEffect } from "react"
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfWeek, addWeeks, subWeeks, isSameWeek, parseISO } from "date-fns"
import { es } from "date-fns/locale"
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
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
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
    setCurrentWeekStart(subWeeks(currentWeekStart, 1))
  }

  const handleNextWeek = () => {
    const nextWeek = addWeeks(currentWeekStart, 1)
    if (!isSameWeek(nextWeek, new Date(), { weekStartsOn: 1 })) {
      setCurrentWeekStart(nextWeek)
    }
  }

  const formatTime = (time: string | null) => {
    return time ? format(parseISO(time), "HH:mm") : "N/A"
  }

  const calculateHoursWorked = (clockIn: string, clockOut: string | null) => {
    if (!clockOut) return "N/A"
    const start = parseISO(clockIn)
    const end = parseISO(clockOut)
    const diffInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    return diffInHours.toFixed(2)
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
            {format(currentWeekStart, "'Semana del' d 'de' MMMM", { locale: es })}
          </span>
          <Button
            onClick={handleNextWeek}
            variant="outline"
            size="icon"
            disabled={isSameWeek(addWeeks(currentWeekStart, 1), new Date(), { weekStartsOn: 1 })}
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
                    <TableCell>{format(parseISO(record.clockIn), "dd/MM/yyyy")}</TableCell>
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

