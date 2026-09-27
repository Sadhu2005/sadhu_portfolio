"use client";

import { useState } from "react";
import Lightbox from "@/components/Lightbox";
import MediaFrame from "@/components/MediaFrame";
import PageState from "@/components/PageState";
import RevealSection from "@/components/RevealSection";
import ScrollRail from "@/components/ScrollRail";
import { laneAt } from "@/lib/lanes";
import { useApi } from "@/lib/useApi";
import type { Certificate } from "@/lib/types";

export default function CertificatesView() {
  const { data, loading, error } = useApi<Certificate[]>("/api/certificates");
  const [index, setIndex] = useState<number | null>(null);
  const images = (data || []).map((item) => item.image?.url || "");
  const latest = [...(data || [])].reverse().slice(0, 8);

  return (
    <main className="wrap page-hero">
      <p className="kicker">Certifications</p>
      <h1>Credentials</h1>
      <PageState loading={loading} error={error} empty={!loading && !error && (data?.length ?? 0) === 0} emptyLabel="No certificates yet.">
        <RevealSection>
          <ScrollRail label="Latest credentials" variant="card" emptyLabel="No certificates yet.">
            {latest.map((item) => {
              const itemIndex = (data || []).findIndex((row) => row.id === item.id);
              return (
                <button key={item.id} type="button" className={`thumb-button ${laneAt(itemIndex)}`} onClick={() => setIndex(itemIndex)}>
                  <MediaFrame media={item.image} label={item.alt || "Certificate"} />
                  <span className="muted cert-caption">{item.desc}</span>
                </button>
              );
            })}
          </ScrollRail>
        </RevealSection>
        <div className="cert-grid">
          {data?.map((item, itemIndex) => (
            <RevealSection key={item.id} index={itemIndex % 3}>
              <button type="button" className="cert-button" onClick={() => setIndex(itemIndex)}>
                <MediaFrame media={item.image} label={item.alt || "Certificate"} />
                <span className="muted" style={{ display: "block", padding: "0.75rem" }}>{item.desc}</span>
              </button>
            </RevealSection>
          ))}
        </div>
      </PageState>
      {index !== null && (
        <Lightbox items={images} index={index} onClose={() => setIndex(null)} onChange={setIndex} />
      )}
    </main>
  );
}
