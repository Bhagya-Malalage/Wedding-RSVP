"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const weddingDate = new Date("2026-12-11T09:00:00+05:30");
const agenda = [["9:30 AM", "Guest Arrival"], ["10:10 AM", "Poruwa Ceremony"], ["10:40 AM", "Traditional Blessing & Welcome"], ["11:30 PM", "Photography Session"], ["12:30 PM", "Lunch Reception"], ["2:30 PM", "Photography Session"], ["4:00 PM", "The Celebration Concludes"]];

function Countdown() {
  const [time, setTime] = useState([0, 0, 0, 0]);
  useEffect(() => {
    const update = () => { const d = Math.max(0, weddingDate.getTime() - Date.now()); setTime([Math.floor(d / 86400000), Math.floor(d / 3600000) % 24, Math.floor(d / 60000) % 60, Math.floor(d / 1000) % 60]); };
    update(); const timer = window.setInterval(update, 1000); return () => clearInterval(timer);
  }, []);
  return <div className="countdown" aria-label="Countdown to the wedding">{["Days", "Hours", "Minutes", "Seconds"].map((label, i) => <div key={label}><b>{String(time[i]).padStart(2, "0")}</b><span>{label}</span></div>)}</div>;
}

function MusicButton() {
  const [playing, setPlaying] = useState(false); const audio = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const savedPreference = localStorage.getItem("wedding-music") === "on";
    const timer = window.setTimeout(() => setPlaying(savedPreference), 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    const beginMusic = () => { setPlaying(true); audio.current?.play().catch(() => setPlaying(false)); };
    window.addEventListener("start-wedding-music", beginMusic);
    return () => window.removeEventListener("start-wedding-music", beginMusic);
  }, []);
  useEffect(() => { if (!audio.current) return; if (playing) audio.current.play().catch(() => setPlaying(false)); else audio.current.pause(); localStorage.setItem("wedding-music", playing ? "on" : "off"); }, [playing]);
  return <><audio ref={audio} src="/wedding-music.mp3" loop preload="none" /><button className={`music ${playing ? "playing" : ""}`} onClick={() => setPlaying(v => !v)} aria-label={playing ? "Mute wedding music" : "Play wedding music"}><span>♫</span><small>{playing ? "Music on" : "Music off"}</small></button></>;
}

function Rsvp() {
  const [attendance, setAttendance] = useState("joyfully accepts");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [guestState, setGuestState] = useState<"loading" | "ready" | "missing" | "invalid" | "error">("loading");
  const [guestName, setGuestName] = useState("");
  const [guestToken, setGuestToken] = useState("");
  const [lookupAttempt, setLookupAttempt] = useState(0);
  const editResponseButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      const token = new URLSearchParams(window.location.search).get("guest")?.trim() ?? "";
      if (!token) { setGuestState("missing"); return; }
      setGuestToken(token); setGuestState("loading");
      fetch(`/api/guest?token=${encodeURIComponent(token)}`, { signal: controller.signal, cache: "no-store" })
        .then(async response => {
          const data = await response.json() as { name?: string; error?: string };
          if (!response.ok || !data.name) throw new Error(response.status === 404 ? "invalid" : data.error || "lookup");
          setGuestName(data.name); setGuestState("ready");
        })
        .catch(error => { if (error instanceof DOMException && error.name === "AbortError") return; setGuestState(error instanceof Error && error.message === "invalid" ? "invalid" : "error"); });
    }, 0);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [lookupAttempt]);

  useEffect(() => {
    if (status !== "done") return;
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setStatus("idle");
      if (event.key === "Tab") {
        const controls = document.querySelectorAll<HTMLButtonElement>(".rsvp-success button");
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    const previousFocus = document.activeElement as HTMLElement | null;
    const frame = window.requestAnimationFrame(() => editResponseButton.current?.focus());
    return () => { window.cancelAnimationFrame(frame); document.body.style.overflow = previousOverflow; document.documentElement.style.overflow = previousRootOverflow; window.removeEventListener("keydown", closeOnEscape); previousFocus?.focus({ preventScroll: true }); };
  }, [status]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("sending"); const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: guestToken, attendance: data.get("attendance"), message: data.get("message") }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Unable to save your response.");
      setStatus("done");
    } catch { setStatus("error"); }
  }

  if (guestState === "loading") return <div className="guest-status loading" role="status"><i>✦</i><h3>Finding your invitation…</h3><p>Please wait while we prepare your personalised RSVP.</p></div>;
  if (guestState === "missing") return <div className="guest-status"><i>◇</i><h3>Personal invitation link required</h3><p>Please open the unique invitation link sent to you by Chathuranga and Vinuri.</p></div>;
  if (guestState === "invalid") return <div className="guest-status"><i>◇</i><h3>Invitation not found</h3><p>This link may be incomplete or invalid. Please ask the couple for your personal invitation link.</p></div>;
  if (guestState === "error") return <div className="guest-status"><i>◇</i><h3>We couldn’t load your invitation</h3><p>Please check your connection and try again.</p><button type="button" onClick={() => setLookupAttempt(value => value + 1)}>Try again</button></div>;
  return <><form className="rsvp-form" onSubmit={submit}>
    <label>Your name<input name="name" value={guestName} readOnly aria-readonly="true" /><small className="personalised-note">Personalised for this invitation</small></label>
    <fieldset><legend>Will you be joining us?</legend><div className="choices"><label><input type="radio" name="attendance" value="joyfully accepts" checked={attendance === "joyfully accepts"} onChange={e => setAttendance(e.target.value)} /><span>Joyfully accepts</span></label><label><input type="radio" name="attendance" value="regretfully declines" checked={attendance === "regretfully declines"} onChange={e => setAttendance(e.target.value)} /><span>Regretfully declines</span></label></div></fieldset>
    <label>Message <small>optional</small><textarea name="message" maxLength={500} rows={3} placeholder="Leave a note for the couple" /></label>
    {status === "error" && <p className="error" role="alert">We couldn’t save your response. Please try again.</p>}
    <button className="gold-button" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send RSVP"}<span>→</span></button>
  </form>{status === "done" && typeof document !== "undefined" && createPortal(<div className="experience rsvp-modal-root"><div className="rsvp-success-overlay" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setStatus("idle"); }}><div className="rsvp-success" role="dialog" aria-modal="true" aria-labelledby="rsvp-success-title"><img className="popup-mandala popup-mandala-top" src="/rotating-gold-mandala.png" alt="" aria-hidden="true"/><img className="popup-mandala popup-mandala-bottom" src="/rotating-gold-mandala.png" alt="" aria-hidden="true"/><button className="success-close" type="button" onClick={() => setStatus("idle")} aria-label="Close response confirmation">×</button><i aria-hidden="true">✓</i><p className="kicker">Response received</p><h3 id="rsvp-success-title">With all our love, thank you.</h3><p>{attendance === "joyfully accepts" ? "We cannot wait to celebrate our special day with you" : "You will be close in our hearts on our special day."}</p><button ref={editResponseButton} className="edit-response" type="button" onClick={() => setStatus("idle")}>Edit response</button></div></div></div>, document.body)}</>;
}

export default function Home() {
  const [stage, setStage] = useState<"sealed" | "opening" | "card" | "book">("sealed"); const [page, setPage] = useState(0);
  const openingStarted = useRef(false);
  const openEnvelope = () => { if (openingStarted.current) return; openingStarted.current = true; window.dispatchEvent(new Event("start-wedding-music")); setStage("opening"); };
  useEffect(() => {
    if (stage !== "opening") return;
    const timer = window.setTimeout(() => setStage("card"), window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1900);
    return () => window.clearTimeout(timer);
  }, [stage]);
  useEffect(() => {
    if (stage !== "book" || page === 0) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".continuous-view .scroll-section"));
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("in-view"); }), { threshold: .06, rootMargin: "0px 0px 6% 0px" });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [stage, page]);
  async function downloadInvitation() {
    const canvas = document.createElement("canvas"); canvas.width = 1400; canvas.height = 2000;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const center = canvas.width / 2;
    ctx.fillStyle = "#f8eddd"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#b88443"; ctx.lineWidth = 5; ctx.strokeRect(48, 48, 1304, 1904);
    ctx.strokeStyle = "#ad7435"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(78,78); ctx.lineTo(365,78); ctx.moveTo(1035,78); ctx.lineTo(1322,78); ctx.moveTo(78,270); ctx.lineTo(78,1570); ctx.moveTo(1322,270); ctx.lineTo(1322,1570); ctx.moveTo(375,1922); ctx.lineTo(1025,1922); ctx.stroke();
    const mandala = new Image(); mandala.src = "/gold-mandala-transparent.png";
    try { await mandala.decode();
      ctx.save(); ctx.globalAlpha = .62; ctx.drawImage(mandala, 50, -400, 1300, 867); ctx.restore();
      const drawCorner = (x: number) => { ctx.save(); ctx.globalAlpha = .62; ctx.translate(x + 480, 1460 + 320); ctx.rotate(Math.PI); ctx.drawImage(mandala, -480, -320, 960, 640); ctx.restore(); };
      drawCorner(-330); drawCorner(770);
    } catch { /* Download remains available if the ornament cannot load. */ }
    ctx.textAlign = "center"; ctx.fillStyle = "#a16e35"; ctx.letterSpacing = "7px"; ctx.font = "700 33px Georgia"; ctx.fillText("TOGETHER WITH THEIR FAMILIES", center, 315);
    ctx.fillStyle = "#654536"; ctx.letterSpacing = "4px"; ctx.font = "40px Georgia"; ctx.fillText("MR & MRS MUNASINGHE", center, 390); ctx.fillStyle = "#b77b32"; ctx.font = "italic 32px Georgia"; ctx.fillText("and", center, 440); ctx.fillStyle = "#654536"; ctx.font = "40px Georgia"; ctx.fillText("MR & MRS ABEYWARNA", center, 490);
    ctx.font = "36px Georgia"; ctx.fillText("request the pleasure of your presence", center, 560);
    ctx.font = "34px Georgia"; ctx.fillText("as they celebrate the joyous occasion of the marriage", center, 630); ctx.fillText("of their beloved children", center, 675);
    ctx.letterSpacing = "4px"; ctx.fillStyle = "#553629"; ctx.font = "84px 'Times New Roman'"; ctx.fillText("CHATHURANGA", center, 805);
    ctx.fillStyle = "#b77b32"; ctx.letterSpacing = "3px"; ctx.font = "italic 38px Georgia"; ctx.fillText("&", center, 842);
    ctx.letterSpacing = "5px"; ctx.fillStyle = "#553629"; ctx.font = "94px 'Times New Roman'"; ctx.fillText("VINURI", center, 960);
    ctx.fillStyle = "#76543d"; ctx.letterSpacing = "2px"; ctx.font = "italic 28px Georgia"; ctx.fillText("on", center, 1018);
    ctx.fillStyle = "#a87535"; ctx.letterSpacing = "5px"; ctx.font = "700 34px Arial"; ctx.fillText("FRIDAY, 11TH DECEMBER 2026", center, 1072);
    ctx.fillStyle = "#76543d"; ctx.letterSpacing = "2px"; ctx.font = "italic 28px Georgia"; ctx.fillText("at", center, 1125);
    ctx.fillStyle = "#966639"; ctx.letterSpacing = "4px"; ctx.font = "44px Georgia"; ctx.fillText("GRAND MONARCH", center, 1193); ctx.font = "700 29px Arial"; ctx.fillText("THALAWATHUGODA", center, 1243);
    ctx.fillStyle = "#6b4734"; ctx.letterSpacing = "2px"; ctx.font = "italic 33px Georgia"; ctx.fillText("Your presence and blessings will make this occasion truly special.", center, 1335);
    ctx.fillStyle = "#6f513f"; ctx.letterSpacing = "4px"; ctx.font = "32px Georgia"; ctx.fillText("RSVP", center, 1445); ctx.letterSpacing = "2px"; ctx.font = "29px Georgia"; ctx.fillText("CHATHURANGA - 077 3671887", center, 1505); ctx.fillText("VINURI - 077 3678601", center, 1555);
    const link = document.createElement("a"); link.download = "Chathuranga-and-Vinuri-Wedding-Invitation.png"; link.href = canvas.toDataURL("image/png"); link.click();
  }
  return <main className={`experience stage-${stage}`}>
    <MusicButton />
    {stage !== "book" && <section className="opening" aria-label="Open the wedding invitation">
      <div className="corner-ornaments" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="particles" aria-hidden="true">{Array.from({length: 24}, (_, i) => <i key={i} style={{"--x": `${(i * 37) % 97}%`, "--y": `${(i * 61) % 91}%`, "--delay": `${i * -.31}s`} as React.CSSProperties} />)}</div>
      <div className="petals" aria-hidden="true">{Array.from({length: 28}, (_, i) => <b key={i} style={{"--x": `${3 + ((i * 43) % 94)}%`, "--size": `${7 + (i % 5) * 1.5}px`, "--drift": `${-45 + (i % 7) * 16}px`, "--duration": `${7 + (i % 6) * 1.15}s`, "--delay": `${i * -.73}s`} as React.CSSProperties} />)}</div>
      <button className="envelope-scene" onClick={openEnvelope} aria-label="Tap to open invitation"><div className="envelope"><div className="back" /><div className="letter"><span className="letter-invite"><strong>You’re</strong><strong>cordially invited</strong></span></div><div className="pocket" /><div className="flap" /><div className="seal">C | V</div></div></button>
      <p className="tap-copy"><span>{stage === "sealed" ? "Tap to Open Invitation" : "A celebration of love awaits"}</span></p>
      <div className="save-card"><p className="kicker">Together with their families</p><h2>Save the date</h2><p className="couple"><span>Chathuranga</span><i>&amp;</i><span>Vinuri</span></p><div className="date-rule"><span>Friday</span><b>11</b><span>December<br/>2026</span></div><p className="place">Grand Monarch Hotel <br/> Thalawathugoda - Tuscany ballroom</p><button className="gold-button" onClick={() => setStage("book")}>Open Invitation <span>→</span></button></div>
    </section>}
    {stage === "book" && <section className={`booklet ${page === 0 ? "cover-view" : "continuous-view"}`} id="invitation">
      <header><button className="monogram" onClick={() => setPage(0)}>C<span> | </span>V</button><p>Our wedding invitation</p><span>11 · 12 · 2026</span></header>
      {page > 0 && <div className="scroll-ornaments" aria-hidden="true">{Array.from({length:12},(_,i)=><i key={i} style={{"--o":i} as React.CSSProperties}/>)}<b/><b/><b/></div>}
      <div className="book-shell" onWheel={e => { if (page === 0 && e.deltaY > 30) setPage(1); }}><div className="page-stack">
        <article className={`paper cover formal-cover ${page === 0 ? "active" : "left"}`} aria-hidden={page !== 0} inert={page !== 0}><button className="download-card" onClick={e => { e.stopPropagation(); void downloadInvitation(); }} aria-label="Download wedding invitation"><span>↓</span> Download</button><img className="mandala-art mandala-art-top" src="/gold-mandala-transparent.png" alt="" aria-hidden="true"/><img className="mandala-art mandala-art-left" src="/gold-mandala-transparent.png" alt="" aria-hidden="true"/><img className="mandala-art mandala-art-right" src="/gold-mandala-transparent.png" alt="" aria-hidden="true"/><div className="formal-copy revised-copy"><p className="families-title">Together with their families</p><p className="parents-list"><strong>MR &amp; MRS MUNASINGHE</strong><i>and</i><strong>MR &amp; MRS ABEYWARNA</strong></p><p className="request">request the pleasure of your presence</p><p className="occasion">as they celebrate the joyous occasion of the marriage of their beloved son and daughter</p><h5><span>Chathuranga</span><i>&amp;</i><span>Vinuri</span></h5><p className="formal-on">on</p><p className="formal-date-text">Friday, 11<sup>th</sup> December 2026</p><p className="formal-venue"><small>at</small>Grand Monarch<strong>Thalawathugoda - Tuscany Ballroom</strong></p><div className="formal-rsvp"><span>Chathuranga - 077 3671887</span><span>Vinuri - 077 3678601</span></div></div></article>
        <article className="paper details scroll-section" aria-hidden={page === 0} inert={page === 0}><div className="page-number">02</div><div className="ceremony-heading"><p className="kicker">A treasured Sri Lankan tradition</p><h2>Poruwa Ceremony</h2><div aria-hidden="true"><i/>◆<i/></div></div><div className="editorial-image ceremony-image" role="img" aria-label="Bride and groom during the Poruwa ceremony"/><div className="page-copy"><p className="kicker">The wedding ceremony</p><h2>When two families become one.</h2><p>With the blessings of our parents, we invite you to witness our union in a traditional Sri Lankan Poruwa ceremony.</p><dl><div><dt>Date</dt><dd>Friday, 11 December 2026</dd></div><div><dt>Time</dt><dd>10.10 in the morning</dd></div><div><dt>Venue</dt><dd>Grand Monarch, Thalawathugoda</dd></div></dl><div className="details-countdown"><p className="kicker">Until we say “I do”</p><Countdown /></div></div></article>
        <article className="paper agenda scroll-section" aria-hidden={page === 0} inert={page === 0}><div className="agenda-petals" aria-hidden="true"><i/><i/><i/></div><div className="page-number">03</div><div className="page-title"><p className="kicker">A day to remember</p><h2>Our celebration</h2><p>Every moment, lovingly planned.</p></div><div className="agenda-schedule"><div className="timeline">{agenda.map(([time, title], i) => <div key={`${time}-${title}`} style={{"--delay": `${i * 90}ms`} as React.CSSProperties}><time>{time}</time><i /><strong>{title}</strong></div>)}</div><section className="date-calendar" aria-label="December 2026 wedding calendar"><div className="calendar-heading"><p><small>Save the date</small><strong>December</strong></p><b>2026</b></div><div className="calendar-week">{["S","M","T","W","T","F","S"].map((day,i)=><span key={`${day}-${i}`}>{day}</span>)}</div><div className="calendar-days">{[...Array(2).fill(null),...Array.from({length:31},(_,i)=>i+1)].map((day,i)=><span key={i} className={day===11?"wedding-day":day?"":"empty"}>{day}</span>)}</div><div className="calendar-branch" aria-hidden="true"><i/><i/><i/><i/><i/></div></section><a className="calendar-save" href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Chathuranga%20%26%20Vinuri%20Wedding&dates=20261211T033000Z%2F20261211T090000Z&details=Join%20us%20for%20our%20wedding%20celebration.&location=Grand%20Monarch%2C%20Thalawathugoda" target="_blank" rel="noreferrer" aria-label="Save the wedding date to Google Calendar"><span aria-hidden="true">11</span><b>Save the date</b><i aria-hidden="true">↗</i></a></div></article>
        <article className="paper location scroll-section" aria-hidden={page === 0} inert={page === 0}><div className="venue-orbit" aria-hidden="true"><i/><i/><i/></div><div className="page-number">04</div><div className="venue-heading"><p className="kicker">The wedding venue</p><h2>Where our forever begins.</h2><span aria-hidden="true">◆</span></div><div className="map-wrap"><div className="map-pin" aria-hidden="true"><i>⌖</i></div><iframe title="Map to Grand Monarch Thalawathugoda" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Grand+Monarch+Thalawathugoda&output=embed" /></div><div className="location-copy"><p className="kicker">Meet us in Thalawathugoda</p><h2>Grand Monarch</h2><p>Thalawathugoda<br/>Sri Lanka</p><a className="gold-button" href="https://maps.google.com/?q=Grand+Monarch+Thalawathugoda" target="_blank" rel="noreferrer">Get directions <span>↗</span></a></div></article>
        <article className="paper rsvp scroll-section" aria-hidden={page === 0} inert={page === 0}><div className="page-number">05</div><div className="rsvp-page-title"><p className="kicker">WITH LOVE AND GRATITUDE</p><h2>RSVP</h2><div aria-hidden="true"><i/>◆<i/></div></div><div className="rsvp-intro"><h2>Will you be joining us?</h2><p>Your presence would mean the world to us. Kindly reply by 1 December 2026.</p></div><Rsvp /><div className="rsvp-finale"><div className="finale-rings" aria-hidden="true"><i/><i/><b>♥</b></div><p>With love, we await your reply</p><strong>Chathuranga <br/><i>&amp;</i><br/> Vinuri</strong><small>Until our beautiful beginning</small></div><button className="back-to-card" onClick={() => { setPage(0); window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"}); }}><span>←</span><b>Back to wedding card</b></button></article>
      </div></div>
      {page === 0 && <button className="scroll-next" onClick={() => setPage(1)}><span>Discover the celebration</span><i>↓</i></button>}
    </section>}
  </main>;
}
