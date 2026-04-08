export function FootballDivider() {
  return (
    <div className="relative w-full">
      {/* Grass strip with mowing pattern */}
      <div className="relative h-10 md:h-14 bg-gradient-to-b from-[#2d7a2d] to-[#1e6b1e] overflow-hidden">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.02)_0px,rgba(255,255,255,0.02)_40px,rgba(0,0,0,0.02)_40px,rgba(0,0,0,0.02)_80px)]" />
        {/* Center white line */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] md:h-[3px] bg-white/50" />
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 rounded-full border-[2px] md:border-[3px] border-white/50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/60" />
      </div>
    </div>
  )
}

export function GrassStrip() {
  return (
    <div className="relative h-3 md:h-4 bg-gradient-to-r from-[#1e6b1e] via-[#2d7a2d] to-[#1e6b1e]">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.015)_0px,rgba(255,255,255,0.015)_50px,transparent_50px,transparent_100px)]" />
    </div>
  )
}
