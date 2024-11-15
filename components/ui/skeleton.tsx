import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-none bg-azul/40 dark:bg-azul/40", className)}
      {...props}
    />
  )
}

export { Skeleton }
