"use client";

import { useEffect, useMemo, useRef } from "react";

import { cn } from "@/lib/utils";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
};

interface ParticlesProps {
  className?: string;
  quantity?: number;
  color?: string;
  ease?: number;
  minSize?: number;
  maxSize?: number;
}

export function Particles({
  className,
  quantity = 80,
  color = "#666666",
  ease = 20,
  minSize = 0.8,
  maxSize = 2.5,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  const speed = useMemo(() => Math.max(0.01, 1 / Math.max(1, ease)), [ease]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: Particle[] = [];

    const setup = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      particles.length = 0;
      for (let i = 0; i < quantity; i += 1) {
        particles.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * Math.max(0.1, maxSize - minSize) + minSize,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      let idx = 0;

      for (const p of particles) {
        idx += 1;
        const dx = pointerRef.current.x - p.x;
        const dy = pointerRef.current.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const influence = Math.max(0, 120 - distance) / 120;

        p.vx += (dx / distance) * influence * speed * 0.02;
        p.vy += (dy / distance) * influence * speed * 0.02;
        p.phase += 0.02 + idx * 0.00002;

        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.98;
        p.vy *= 0.98;

        if (p.x <= 0 || p.x >= rect.width) p.vx *= -1;
        if (p.y <= 0 || p.y >= rect.height) p.vy *= -1;

        p.x = Math.min(rect.width, Math.max(0, p.x));
        p.y = Math.min(rect.height, Math.max(0, p.y));

        const alpha = 0.25 + (Math.sin(p.phase) + 1) * 0.25;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (const other of particles) {
          const linkDx = p.x - other.x;
          const linkDy = p.y - other.y;
          const linkDistance = Math.sqrt(linkDx * linkDx + linkDy * linkDy);

          if (linkDistance < 68) {
            const linkAlpha = (1 - linkDistance / 68) * 0.08;
            ctx.globalAlpha = linkAlpha;
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;

      rafRef.current = window.requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current.x = e.clientX - rect.left;
      pointerRef.current.y = e.clientY - rect.top;
    };

    const onResize = () => setup();

    setup();
    draw();

    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [color, quantity, speed, minSize, maxSize]);

  return <canvas ref={canvasRef} className={cn("pointer-events-none", className)} />;
}
