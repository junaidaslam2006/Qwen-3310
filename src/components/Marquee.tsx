export function Marquee({
  children,
  reverse = false,
  className = "",
}: {
  children: React.ReactNode;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={`marquee ${className}`} aria-hidden="true">
      <div className={`marquee-track${reverse ? " reverse" : ""}`}>
        <span className="marquee-chunk">{children}</span>
        <span className="marquee-chunk">{children}</span>
      </div>
    </div>
  );
}
