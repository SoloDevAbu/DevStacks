export const HoverOutline = () => {
  return (
    <div className="pointer-events-none absolute -inset-[6px] z-0 opacity-0 transition-opacity group-hover/btn:opacity-100">
      <div className="absolute top-0 left-0 h-2 w-2 border-t-2 border-l-2 border-slate-500" />
      <div className="absolute top-0 right-0 h-2 w-2 border-t-2 border-r-2 border-slate-500" />
      <div className="absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 border-slate-500" />
      <div className="absolute right-0 bottom-0 h-2 w-2 border-r-2 border-b-2 border-slate-500" />
    </div>
  )
}
