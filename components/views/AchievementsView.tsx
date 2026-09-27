"use client";

import { useState } from "react";
import Lightbox from "@/components/Lightbox";
import MediaFrame from "@/components/MediaFrame";
import ScrollRail from "@/components/ScrollRail";
import { laneAt } from "@/lib/lanes";
import PageState from "@/components/PageState";
import RevealSection from "@/components/RevealSection";
import { useApi } from "@/lib/useApi";
import type { Achievement, MediaRef } from "@/lib/types";

export default function AchievementsView() {
  const { data, loading, error } = useApi<Achievement[]>("/api/achievements");
  const [open, setOpen] = useState<MediaRef[] | null>(null);
  const [index, setIndex] = useState(0);

  return (
    <main className="wrap page-hero">
      <p className="kicker">Achievements</p>
      <h1>Events and builds</h1>
      <PageState loading={loading} error={error} empty={!loading && !error && (data?.length ?? 0) === 0} emptyLabel="No achievements yet.">
        <div className="timeline">
          {data?.map((event, eventIndex) => (
            <RevealSection as="article" key={event.id} className="surface" index={Math.min(eventIndex, 2)}>
              <p className="kicker">{event.date}</p>
              <h2>{event.eventName}</h2>
              <p className="tone-copper">{event.outcome}</p>
              <p>{event.description}</p>
              <p className="muted">{event.techUsed}</p>
              <ScrollRail label={`${event.eventName} media`} variant="card" emptyLabel="No media for this event yet.">
                {event.media.map((item, mediaIndex) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`thumb-button ${laneAt(mediaIndex)}`}
                    onClick={() => {
                      setOpen(event.media);
                      setIndex(mediaIndex);
                    }}
                  >
                    <MediaFrame media={item} label={`${event.eventName} media`} />
                  </button>
                ))}
              </ScrollRail>
            </RevealSection>
          ))}
        </div>
      </PageState>
      {open && (
        <Lightbox
          items={open.map((item) => item.url)}
          kinds={open.map((item) => item.kind)}
          index={index}
          onClose={() => setOpen(null)}
          onChange={setIndex}
        />
      )}
    </main>
  );
}
