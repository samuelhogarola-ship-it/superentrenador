export function AuthPageBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.78),rgba(233,235,239,0.45))]" />
      <span className="absolute -left-8 top-20 select-none font-heading text-[8rem] font-black tracking-[-0.12em] text-[#7b8088]/[0.035] sm:text-[12rem] lg:text-[16rem]">
        SUPER
      </span>
      <span className="absolute right-5 top-5 select-none font-heading text-[7rem] font-black leading-none text-[#f5a623]/70 sm:right-10 sm:top-8 sm:text-[9rem] lg:right-[5%]">
        S
      </span>
      <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-white/45 blur-3xl" />
    </div>
  );
}
