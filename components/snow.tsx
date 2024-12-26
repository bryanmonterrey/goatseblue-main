'use client'

import { useEffect, useRef } from 'react'

interface Snowflake {
  x: number
  y: number
  size: number
  speed: number
  opacity: number // Current opacity of the snowflake
}

export function SnowEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let snowflakes: Snowflake[] = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = 200 // Height of the snow effect area
      createSnowflakes()
    }

    const createSnowflakes = () => {
      snowflakes = Array.from({ length: 50 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 2,
        speed: Math.random() * 1 + 0.5,
        opacity: 1.0, // Start at full opacity
      }))
    }

    const drawSnowflake = (flake: Snowflake) => {
      ctx.save() // Save the current canvas state
      ctx.globalAlpha = flake.opacity // Set the opacity for the current snowflake
      ctx.beginPath()
      ctx.arc(flake.x, flake.y, flake.size / 2, 0, Math.PI * 2)
      ctx.closePath()
      ctx.fillStyle = 'white'
      ctx.fill()
      ctx.restore() // Restore the canvas state for the next snowflake
    }

    const updateSnowflake = (flake: Snowflake): Snowflake => {
      let newX = flake.x - flake.speed;
      let newY = flake.y + flake.speed / 2;
      let newOpacity = Math.max(0, 1 - newY / canvas.height);

      if (newX < -10) newX = canvas.width + 10;
      if (newY > canvas.height) {
        newY = -10;
        newOpacity = 1.0;
      }

      return { ...flake, x: newX, y: newY, opacity: newOpacity };
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      snowflakes.forEach((flake) => {
        drawSnowflake(flake)
        Object.assign(flake, updateSnowflake(flake))
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-[200px] pointer-events-none z-50"
      style={{ opacity: 0.7 }}
    />
  )
}
