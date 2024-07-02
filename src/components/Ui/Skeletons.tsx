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


export const CommentSkeleton = () => {
  return (
    <div className="flex w-full px-4 py-3 border-t-[1px] border-dimGray animate-pulse">
      <div className="mr-2 w-10 h-10 rounded-full bg-zinc-900"></div>
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center gap-2 text-zinc-900">
          <div className="w-20 h-4 rounded bg-zinc-900"></div>
          <div className="w-5 h-4 rounded bg-zinc-900"></div>
        </div>
        <div className="w-full mb-2">
          <div className="h-4 bg-zinc-900 rounded mt-1"></div>
          <div className="h-4 bg-zinc-900 rounded w-5/6 mt-1"></div>
        </div>
        {/* <!-- Comment footer --> */}
        <div className="flex items-center w-full justify-between sm:gap-10">
          <div className="group flex cursor-pointer items-center">
            <div className="h-fit w-fit rounded-full p-2 transition-all duration-200">
              <div className="h-5 w-5 bg-zinc-900 rounded"></div>
            </div>
          </div>
          <div className="flex gap-2 sm:ml-auto hover:text-blue-500">
            <div className="group flex cursor-pointer items-center">
              <div className="h-fit w-fit rounded-full p-2 transition-all duration-200">
                <div className="h-5 w-5 bg-zinc-900 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export const RecommendedCommunitySkeleton = () => {
  return (
    <div className="py-2 w-full overflow-hidden animate-pulse">
      <div className='flex flex-col gap-5'>
        <div className='w-full flex justify-between items-center'>
          <div className=' flex items-center gap-2'>
            <div className="mr-2 h-10 w-10 shrink-0 bg-zinc-800/70 rounded-full"></div>
            <div className="w-20 h-4 bg-zinc-800/70 rounded"></div>
          </div>
          <div className="shrink-0 w-28 h-8 bg-zinc-800/70 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export const RecommendedCommunitiesSkeleton = () => {
  return (
    <>
      <RecommendedCommunitySkeleton />
      <RecommendedCommunitySkeleton />
      <RecommendedCommunitySkeleton />
    </>
  )
}