// Softened from named fake companies to neutral sector descriptors.
const sectors = [
  "Healthcare",
  "Financial services",
  "Logistics",
  "Retail",
  "Professional services",
  "Manufacturing",
];

export default function TrustBar() {
  return (
    <div className="trust">
      <div className="wrap trust-inner">
        <span className="trust-lbl">Built for teams across</span>
        <span className="trust-sep" />
        <div className="trust-chips">
          {sectors.map((s) => (
            <span className="trust-chip" key={s}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
