import {
  formatArchiveDate,
  splitFeatures,
  type ArchiveFeature
} from "@/lib/forecast-archive";

function PaperFeature({ item }: { item: ArchiveFeature }) {
  return (
    <article className="paper-card">
      <p className="eyebrow" style={{ fontSize: 11, margin: 0 }}>
        {formatArchiveDate(item.date)}
      </p>
      <h3 className="font-display">{item.title}</h3>
      <p style={{ margin: "0 0 10px", fontSize: 14 }}>{item.outlet}</p>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>The information will be up soon.</p>
    </article>
  );
}

function LiveFeature({ item }: { item: ArchiveFeature }) {
  return (
    <article className="archive-item">
      <a href={item.url || undefined} target="_blank" rel="noopener noreferrer">
        {item.title}
      </a>
      <p style={{ margin: "6px 0 0", fontSize: 13, color: "#5f6b60" }}>
        {item.outlet} · {formatArchiveDate(item.date)}
      </p>
    </article>
  );
}

export function ArchiveFeatureList({ features }: { features: ArchiveFeature[] }) {
  const { written, broadcast } = splitFeatures(features);
  return (
    <div style={{ display: "grid", gap: 28 }}>
      {written.length ? (
        <section>
          <h2 className="eyebrow" style={{ fontSize: 12, margin: "0 0 12px" }}>
            Written
          </h2>
          <div style={{ display: "grid", gap: 10 }}>
            {written.map((item) =>
              item.status === "placeholder" || !item.url ? (
                <PaperFeature key={`${item.title}-${item.outlet}`} item={item} />
              ) : (
                <LiveFeature key={`${item.title}-${item.url}`} item={item} />
              )
            )}
          </div>
        </section>
      ) : null}
      {broadcast.length ? (
        <section>
          <h2 className="eyebrow" style={{ fontSize: 12, margin: "0 0 12px" }}>
            Television, radio and video
          </h2>
          <div style={{ display: "grid", gap: 10 }}>
            {broadcast.map((item) =>
              item.status === "placeholder" || !item.url ? (
                <PaperFeature key={`${item.title}-${item.outlet}`} item={item} />
              ) : (
                <LiveFeature key={`${item.title}-${item.url}`} item={item} />
              )
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
