const SkeletonLoading = () => {
  return (
    <section className="px-4 py-16 max-w-5xl mx-auto animate-fade-in">
      <div className="h-8 w-48 bg-secondary rounded-lg mx-auto mb-10 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center">
          <div className="w-44 h-44 rounded-full bg-secondary animate-pulse" />
          <div className="h-6 w-32 bg-secondary rounded-full mt-4 animate-pulse" />
        </div>
        <div className="glass-card rounded-2xl p-6 md:col-span-2">
          <div className="h-5 w-36 bg-secondary rounded mb-4 animate-pulse" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-8 rounded-full bg-secondary animate-pulse" style={{ width: `${60 + Math.random() * 40}px` }} />
            ))}
          </div>
        </div>
      </div>
      <div className="glass-card rounded-2xl p-6 mb-10">
        <div className="h-5 w-44 bg-secondary rounded mb-4 animate-pulse" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 bg-secondary rounded mb-3 animate-pulse" style={{ width: `${70 + Math.random() * 30}%` }} />
        ))}
      </div>

      {/* Career Toolkit Skeletons */}
      <div className="h-8 w-40 bg-secondary rounded-lg mx-auto mb-2 animate-pulse" />
      <div className="h-4 w-64 bg-secondary rounded mx-auto mb-8 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-6">
            <div className="h-5 w-48 bg-secondary rounded mb-4 animate-pulse" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-4 bg-secondary rounded animate-pulse" style={{ width: `${60 + Math.random() * 35}%` }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkeletonLoading;
