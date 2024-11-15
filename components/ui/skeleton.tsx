import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-none bg-white/40 dark:bg-white/40", className)}
      {...props}
    />
  )
}

export { Skeleton }
