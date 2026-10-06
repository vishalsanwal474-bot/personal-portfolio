import { useInView } from "../hooks/useInView";

export default function ScrollReveal({ children, className = "", delay = 0 }) {
  const [ref, isInView] = useInView();

  return (
    <div
      ref={ref}
      className={`reveal ${isInView ? "reveal--visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
