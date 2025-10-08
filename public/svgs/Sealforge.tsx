function Sealforge({ width = 80, height = 24, className = "" }: { width?: number | string; height?: number | string; className?: string }) {
  return (
    <img
      src="/Sealforge.svg"
      alt="Sealforge"
      style={{ width, height }}
      className={`invert dark:invert-0 ${className}`}
    />
  );
}

export default Sealforge;




