export function LoadingFallback() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#182966] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-4 text-[#182966]">Loading...</p>
      </div>
    </div>
  );
}

export function PageLoadingFallback() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#182966] border-r-transparent" />
    </div>
  );
}
