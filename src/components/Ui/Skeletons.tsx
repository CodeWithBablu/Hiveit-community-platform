export const PostSkeleton = () => {
  return (
    <main className="h-full w-full border-t-[1px] border-zinc-900 animate-pulse">
      <div className="flex w-full px-4 py-3">

        <div className="mr-2 w-[40px] shrink-0">
          <div className="h-[40px] w-[40px] rounded-full bg-zinc-900"></div>
        </div>

        <div className="flex w-full flex-col gap-2">

          <div className="h-4 bg-zinc-900 rounded w-1/3 mb-2"></div>

          <div className="h-6 bg-zinc-900 rounded w-1/2 mb-2"></div>

          <div className="h-4 bg-zinc-900 rounded w-full"></div>

          <div className="relative mt-2 w-full">
            <div className="w-full h-72 max-h-[600px] rounded-2xl overflow-hidden bg-zinc-900">
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}