export function MagnifyingGlass() {
  return (
    <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black bg-opacity-50 backdrop-blur-sm">
      {/* Glass effect */}
      <div className="absolute inset-0 rounded-full border-2 border-ouija-gold opacity-30"></div>
    </div>
  );
}
