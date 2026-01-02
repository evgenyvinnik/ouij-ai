export function BoardBackground() {
  return (
    <div className="absolute inset-0">
      {/* Actual Ouija board image */}
      <img
        src="/ouija_bg.jpg"
        alt="Ouija Board"
        className="h-full w-full rounded-[10%] object-cover"
        style={{
          animation: 'board-glow 2s ease-in-out alternate infinite',
        }}
      />
    </div>
  );
}
