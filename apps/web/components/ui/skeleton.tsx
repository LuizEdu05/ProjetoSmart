import { cn } from "@workspace/ui/lib/utils"

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-[rgba(29,158,117,0.08)]",
        className
      )}
    />
  )
}

export function ClinicCardSkeleton() {
  return (
    <div className="bg-[#0a1209] border border-[rgba(29,158,117,0.08)] rounded-[22px] overflow-hidden">
      <Skeleton className="h-[152px] rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4 rounded-lg" />
        <Skeleton className="h-3 w-1/2 rounded-lg" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-3 w-16 rounded-lg" />
          <Skeleton className="h-3 w-12 rounded-lg" />
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-[rgba(29,158,117,0.08)]">
          <div className="space-y-1.5">
            <Skeleton className="h-2 w-14 rounded" />
            <Skeleton className="h-6 w-20 rounded-lg" />
          </div>
          <Skeleton className="h-7 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function ProfCardSkeleton() {
  return (
    <div className="bg-[#0a1209] border border-[rgba(29,158,117,0.08)] rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-14 h-14 rounded-2xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4 rounded-lg" />
          <Skeleton className="h-3 w-1/2 rounded-lg" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <Skeleton className="h-3 w-full rounded-lg" />
        <Skeleton className="h-3 w-4/5 rounded-lg" />
      </div>
      <div className="flex justify-between items-end pt-4 border-t border-[rgba(29,158,117,0.08)]">
        <div className="space-y-1.5">
          <Skeleton className="h-2 w-16 rounded" />
          <Skeleton className="h-5 w-20 rounded-lg" />
        </div>
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>
    </div>
  )
}

export function SpecialtyCardSkeleton() {
  return (
    <div className="bg-[#0a1209] border border-[rgba(29,158,117,0.08)] rounded-2xl p-5 flex flex-col items-center gap-3">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <Skeleton className="h-3 w-20 rounded-lg" />
    </div>
  )
}
