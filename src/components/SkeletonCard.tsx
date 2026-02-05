const SkeletonCard = () => (
  <div className="w-full max-w-4xl px-6 pt-6 pb-4 lg:px-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-md animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-6 bg-white/10 rounded w-1/3"></div>
      <div className="h-8 w-8 bg-white/10 rounded-full"></div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-white/10 rounded w-full"></div>
      <div className="h-4 bg-white/10 rounded w-5/6"></div>
    </div>
    <div className="my-4 h-64 bg-white/10 rounded-lg w-full"></div>
    <div className="h-10 bg-white/5 rounded w-full"></div>
  </div>
);
export default SkeletonCard;
