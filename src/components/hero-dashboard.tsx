import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "motion/react";
import {
  AlertTriangle, BarChart3, Bell, CheckCircle2, ClipboardCheck, FileText, GraduationCap,
  LayoutDashboard, ListChecks, Settings, ShieldCheck, Siren, Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Animated product mockup for the home hero: a laptop dashboard and a phone app
// whose numbers, charts and lists keep updating while the hero is on screen.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const INCIDENTS = [[11, 7, 9, 8, 6, 5], [10, 8, 7, 8, 5, 4], [12, 9, 8, 6, 6, 3]];
const NEAR_MISSES = [[8, 10, 7, 9, 6, 5], [7, 9, 8, 6, 7, 4], [9, 8, 9, 7, 5, 4]];
const OPEN_ACTIONS = [12, 11, 13, 10];
const COMPLIANCE = [86, 88, 91, 89];
const AUDITS: [string, string, Result][] = [
  ["Central Plant", "Site Audit", "Compliant"],
  ["West Facility", "ISO 45001", "Minor"],
  ["North Site", "Environmental", "Compliant"],
  ["East Yard", "Safety Walk", "Major"],
  ["Boiler House", "Fire Safety", "Compliant"],
  ["Warehouse B", "PPE Check", "Minor"],
  ["Paint Shop", "Chemical Audit", "Compliant"],
];
const TASKS = ["Complete safety induction", "Review risk assessment", "Close audit finding"];
const TOASTS = ["New observation logged", "Permit PTW-214 approved", "Action closed on time"];
const NAV = [
  [LayoutDashboard, "Dashboard"], [Siren, "Incidents"], [ClipboardCheck, "Audits"], [AlertTriangle, "Risk Register"],
  [ListChecks, "Actions"], [GraduationCap, "Training"], [FileText, "Reports"], [Settings, "Settings"],
] as const;

type Result = "Compliant" | "Minor" | "Major";

function Count({ to, suffix = "", instant }: { to: number; suffix?: string; instant: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const from = useRef(0);
  useEffect(() => {
    if (instant) return;
    const controls = animate(from.current, to, {
      duration: 1.1,
      ease: "easeOut",
      onUpdate: (v) => { if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`; },
    });
    from.current = to;
    return () => controls.stop();
  }, [to, suffix, instant]);
  return <span ref={ref}>{instant ? to : 0}{suffix}</span>;
}

function linePath(values: number[], max: number) {
  return values
    .map((v, i) => `${i ? "L" : "M"}${((i + 0.5) * 100) / values.length},${100 - (v / max) * 92}`)
    .join(" ");
}

export function HeroDashboard() {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [started, setStarted] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduce) { setStarted(true); return; }
    const t = setTimeout(() => setStarted(true), 550);
    return () => clearTimeout(t);
  }, [reduce]);

  useEffect(() => {
    if (!started || reduce || !inView) return;
    const id = setInterval(() => setTick((t) => t + 1), 3200);
    return () => clearInterval(id);
  }, [started, reduce, inView]);

  const incidents = INCIDENTS[tick % INCIDENTS.length];
  const nearMisses = NEAR_MISSES[tick % NEAR_MISSES.length];
  const compliance = COMPLIANCE[tick % COMPLIANCE.length];
  const rows = [0, 1, 2].map((i) => {
    const id = tick + 2 - i;
    return { id, data: AUDITS[id % AUDITS.length] };
  });
  const tasksDone = tick % (TASKS.length + 1);
  const toast = tick > 0 && tick % 2 === 1 ? TOASTS[Math.floor(tick / 2) % TOASTS.length] : null;
  const fade = reduce ? false : undefined;

  return (
    <div ref={ref} className="hero-dash" role="img" aria-label="SafeNexG EHS dashboard on a laptop and the mobile app on a phone, updating live">
      <div className="hd-laptop">
        <div className="hd-bezel">
          <div className="hd-screen">
            <aside className="hd-side">
              <div className="hd-logo"><ShieldCheck /><b>SafeNexG</b></div>
              {NAV.map(([Icon, label], i) => (
                <div key={label} className={i === 0 ? "hd-nav active" : "hd-nav"}><Icon />{label}</div>
              ))}
            </aside>

            <div className="hd-main">
              <div className="hd-head">
                <div><b>Good morning</b><span>A safer, healthier workplace starts with you.</span></div>
                <div className="hd-live"><i />Live</div>
              </div>

              <div className="hd-kpis">
                {[
                  { icon: ShieldCheck, tone: "green", value: 128, label: "Days without LTI", delta: "↑ record" },
                  { icon: ListChecks, tone: "blue", value: OPEN_ACTIONS[tick % OPEN_ACTIONS.length], label: "Open actions", delta: "↓ 25%" },
                  { icon: AlertTriangle, tone: "amber", value: 3, label: "High risks", delta: "↓ 40%" },
                  { icon: Users, tone: "green", value: 98, suffix: "%", label: "Training compliance", delta: "↑ 2%" },
                ].map((k, i) => (
                  <motion.div key={k.label} className="hd-card hd-kpi" initial={fade ?? { opacity: 0, y: 10 }} animate={started ? { opacity: 1, y: 0 } : undefined} transition={{ delay: 0.08 * i, duration: 0.5 }}>
                    <span className={`hd-icon ${k.tone}`}><k.icon /></span>
                    <div><b>{started ? <Count to={k.value} suffix={k.suffix} instant={reduce} /> : `0${k.suffix ?? ""}`}</b><span>{k.label}</span><em>{k.delta}</em></div>
                  </motion.div>
                ))}
              </div>

              <div className="hd-charts">
                <div className="hd-card hd-trend">
                  <div className="hd-title">Incident trend <span><i className="dot blue" />Incidents <i className="dot green" />Near misses</span></div>
                  <div className="hd-plot">
                    <div className="hd-bars">
                      {incidents.map((v, i) => (
                        <div key={MONTHS[i]} className="hd-bar-col">
                          <div className="hd-bar" style={{ height: started ? `${(v / 13) * 92}%` : "0%", transitionDelay: `${i * 60}ms` }} />
                          <span>{MONTHS[i]}</span>
                        </div>
                      ))}
                    </div>
                    <motion.div
                      className="hd-line"
                      initial={fade ?? { clipPath: "inset(0 100% 0 0)" }}
                      animate={started ? { clipPath: "inset(0 0% 0 0)" } : undefined}
                      transition={{ duration: 1.4, delay: 0.4, ease: "easeInOut" }}
                    >
                      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
                        <motion.path d={linePath(nearMisses, 13)} animate={{ d: linePath(nearMisses, 13) }} transition={{ duration: 0.8 }} />
                      </svg>
                    </motion.div>
                  </div>
                </div>

                <div className="hd-card hd-donut-card">
                  <div className="hd-title">Audit results</div>
                  <div className="hd-donut">
                    <svg viewBox="0 0 36 36" aria-hidden>
                      <circle className="track" cx="18" cy="18" r="15.915" />
                      <motion.circle
                        className="value" cx="18" cy="18" r="15.915"
                        initial={fade ?? { strokeDasharray: "0 100" }}
                        animate={started ? { strokeDasharray: `${compliance} 100` } : undefined}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                      />
                    </svg>
                    <b>{started ? <Count to={compliance} suffix="%" instant={reduce} /> : "0%"}</b>
                  </div>
                  <div className="hd-legend"><span><i className="dot green" />Compliant</span><span><i className="dot amber" />Minor</span><span><i className="dot red" />Major</span></div>
                </div>

                <div className="hd-card hd-status">
                  <div className="hd-title">Safety status</div>
                  {["Worksites", "People", "Environment", "Compliance"].map((s, i) => (
                    <motion.div key={s} className="hd-status-row" initial={fade ?? { opacity: 0, x: 10 }} animate={started ? { opacity: 1, x: 0 } : undefined} transition={{ delay: 0.5 + i * 0.12 }}>
                      {i === 2 ? <AlertTriangle className="amber" /> : <CheckCircle2 className="green" />}
                      <div><b>{s}</b><span>{i === 2 ? "1 active observation" : "On track"}</span></div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="hd-card hd-table">
                <div className="hd-title">Recent audits <span className="hd-link">View all</span></div>
                <div className="hd-rows">
                  <AnimatePresence initial={false} mode="popLayout">
                    {rows.map(({ id, data: [site, type, result] }, i) => (
                      <motion.div
                        key={id} layout className={i === 0 && tick > 0 ? "hd-row fresh" : "hd-row"}
                        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.45 }}
                      >
                        <span>{site}</span><span>{type}</span><span className={`hd-badge ${result.toLowerCase()}`}>{result}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hd-base" />
      </div>

      <motion.div className="hd-phone" initial={fade ?? { opacity: 0, y: 30 }} animate={started ? { opacity: 1, y: 0 } : undefined} transition={{ delay: 0.35, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}>
        <div className="hd-phone-screen">
          <div className="hd-notch" />
          <AnimatePresence>
            {toast && (
              <motion.div key={toast} className="hd-toast" initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
                <Bell />{toast}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="hd-app-head"><b>EHS</b><span>Safer people, stronger tomorrow</span></div>
          <div className="hd-quick">
            {[[Siren, "Report"], [ClipboardCheck, "Audits"], [AlertTriangle, "Risks"], [BarChart3, "Stats"]].map(([Icon, l]) => {
              const I = Icon as typeof Siren;
              return <div key={l as string}><span><I /></span>{l as string}</div>;
            })}
          </div>
          <div className="hd-app-title">My actions</div>
          {TASKS.map((t, i) => (
            <div key={t} className={i < tasksDone ? "hd-task done" : "hd-task"}>
              <span className="hd-check">{i < tasksDone && <CheckCircle2 />}</span>{t}
            </div>
          ))}
          <div className="hd-app-cta">Report observation</div>
        </div>
      </motion.div>
    </div>
  );
}
