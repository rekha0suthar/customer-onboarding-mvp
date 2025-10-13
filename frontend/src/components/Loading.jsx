const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 mx-auto"></div>
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-t-blue-600 border-r-purple-600 absolute top-0 left-1/2 transform -translate-x-1/2"></div>
        </div>
        <p className="mt-6 text-gray-700 text-lg font-semibold animate-pulse">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;

