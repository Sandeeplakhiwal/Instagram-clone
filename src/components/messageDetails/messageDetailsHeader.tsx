function MessageDetailsHeader({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  return (
    <div className=" p-2 pt-1 flex flex-row items-center">
      <button
        className=" items-center text-center mr-2 pt-1 hover:text-gray-base sm:hidden"
        onClick={toggleSidebar}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
      </button>
      <h3 className=" font-semibold">Details</h3>
    </div>
  );
}

export default MessageDetailsHeader;
