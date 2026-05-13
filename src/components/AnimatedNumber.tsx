import React from 'react';

export default function AnimatedNumber({ value, duration = 350 }: { value: number; duration?: number }) {
  const [display, setDisplay] = React.useState(value);
  const prevValue = React.useRef(value);

  React.useEffect(() => {
    if (prevValue.current === value) return;
    const start = prevValue.current;
    const diff = value - start;
    const startTime = performance.now();

    let raf: number;
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      }
    };
    raf = requestAnimationFrame(animate);
    prevValue.current = value;
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{display}</>;
}
