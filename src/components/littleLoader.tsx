function LittleLoader() {
  return (
    <div className=" flex items-center justify-center">
      <div className=" animate-spin rounded-full h-6 w-6 border-t-2 border-blue-medium border-r-2 border-b-2"></div>
    </div>
  );
}

export default LittleLoader;

export const WhiteLittleLoader = () => {
  return (
    <div className=" flex items-center justify-center">
      <div className=" animate-spin rounded-full h-3 w-3 border-t-2 border-white border-r-2 border-b-2"></div>
    </div>
  );
};
