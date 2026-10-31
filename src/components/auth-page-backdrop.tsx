export function AuthPageBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.78),rgba(233,235,239,0.45))]" />
      <span className="absolute -left-8 top-20 select-none font-heading text-[8rem] font-black tracking-[-0.12em] text-[#7b8088]/[0.035] sm:text-[12rem] lg:text-[16rem]">
        SUPER
      </span>
      <div className="absolute right-4 top-8 h-28 w-28 bg-[url('/logo.png')] bg-contain bg-center bg-no-repeat opacity-[0.075] sm:right-10 sm:top-10 sm:h-36 sm:w-36 lg:right-[5%] lg:h-44 lg:w-44" />
      <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-white/45 blur-3xl" />
    </div>
  );
}
