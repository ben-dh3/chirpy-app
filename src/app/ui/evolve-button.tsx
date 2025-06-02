const EvolveButton = () => {
  return (
    <button className="relative group flex items-center justify-center bg-gradient-to-br from-[#282829] to-[#333335] text-white p-2 rounded-full overflow-hidden border border-zinc-700 hover:ring-1 hover:ring-zinc-600 hover:shadow-xl duration-300" type="submit">
        <div className="h-[120px] w-10 bg-gradient-to-r from-white/10 via-white/50 to-white/10 absolute blur-sm -rotate-45 -left-16 group-hover:left-[150%] duration-500 delay-200" />
        <div className="">Evolve</div>
    </button>
  );
};

export default EvolveButton;