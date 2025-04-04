"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"

export default function PieChart({ data, options = {} }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    // Si ya existe una instancia, destruirla
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Verificar que el elemento canvas existe
    const canvas = chartRef.current
    if (!canvas) return

    // Crear nueva instancia
    const ctx = canvas.getContext("2d")
    chartInstance.current = new Chart(ctx, {
      type: "pie",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top" },
          title: { display: true, text: "Distribución de Puntos por Nivel" },
        },
        ...options,
      },
    })

    // Limpiar al desmontar
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, options])

  return <canvas ref={chartRef} />
}

