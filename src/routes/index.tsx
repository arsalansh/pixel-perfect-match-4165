import { createFileRoute } from "@tanstack/react-router";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  type MotionValue,
} from "framer-motion";
import { useRef, useState, type FormEvent, type MouseEvent, type ReactNode } from "react";
import executionImg from "@/assets/execution.jpg";
import knightImg from "@/assets/knight.png";
import megaphoneImg from "@/assets/megaphone.png";
import compassImg from "@/assets/compass.png";
import bustImg from "@/assets/bust.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Founder, The Bombay Digital Company — Growth Strategy" },
      { name: "description", content: "Turning business problems into growth strategies. The personal portfolio of the founder of The Bombay Digital Company (TBDC)." },
      { property: "og:title", content: "Turning business problems into growth strategies" },
      { property: "og:description", content: "Strategy, positioning and growth — from the founder of The Bombay Digital Company." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const ease = [0.22, 1, 0.36, 1] as const;

/* ---------- motion helpers ---------- */

function useMouse() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 80, damping: 20 });
  const sy = useSpring(y, { stiffness: 80, damping: 20 });
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  return { sx, sy, onMove };
}

function Par({ mx, my, depth, className, children }: { mx: MotionValue<number>; my: MotionValue<number>; depth: number; className?: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  const x = useTransform(mx, (v) => (reduce ? 0 : v * depth));
  const y = useTransform(my, (v) => (reduce ? 0 : v * depth));
  return <motion.div style={{ x, y }} className={className}>{children}</motion.div>;
}

function MaskLine({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className="block overflow-hidden pb-[0.1em]">
      <motion.span
        className={`block ${className}`}
        initial={reduce ? false : { y: "110%", rotate: 4 }}
        whileInView={{ y: "0%", rotate: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.1, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Pop({ children, delay = 0, rotate = 0, className = "" }: { children: ReactNode; delay?: number; rotate?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, scale: 0.6, rotate: rotate - 12 }}
      whileInView={{ opacity: 1, scale: 1, rotate }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", stiffness: 120, damping: 14, delay }}
    >
      {children}
    </motion.div>
  );
}

function Sticker({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`relative grid aspect-square place-items-center rounded-full ${className}`}>
      <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 h-full w-full">
        <defs>
          <path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="label" style={{ fontSize: 15, letterSpacing: "0.3em", fill: "currentColor" }}>
          <textPath href="#circ">{text}</textPath>
        </text>
      </svg>
      <span className="font-serif text-4xl italic">✳</span>
    </div>
  );
}

/* Scroll-velocity marquee */
function VelocityMarquee({ words, className, base = -2 }: { words: string[]; className: string; base?: number }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 300 });
  const factor = useTransform(vel, [-2000, 0, 2000], [-4, 1, 4]);
  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let v = x.get() + base * (delta / 1000) * 10 * Math.max(1, Math.abs(factor.get())) * Math.sign(factor.get() || 1);
    if (v < -50) v += 50;
    if (v > 0) v -= 50;
    x.set(v);
  });
  const tx = useTransform(x, (v) => `${v}%`);
  const row = [...words, ...words];
  return (
    <div className={`overflow-hidden py-4 ${className}`} aria-hidden>
      <motion.div style={{ x: tx }} className="flex w-max gap-8 whitespace-nowrap font-display text-4xl font-bold lg:text-6xl">
        {[...row, ...row].map((w, i) => (
          <span key={i} className={i % 2 ? "font-serif font-normal italic" : ""}>{w} <span className="mx-3">✳</span></span>
        ))}
      </motion.div>
    </div>
  );
}

/* ---------- sections ---------- */

const NAV = [
  ["About", "#about"],
  ["Questions", "#questions"],
  ["Expertise", "#expertise"],
  ["Process", "#process"],
  ["Notes", "#notes"],
] as const;

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 lg:px-6">
      <div className="flex items-center justify-between rounded-full bg-ink px-5 py-3 text-ivory">
        <a href="#top" className="font-display text-base font-bold">TBDC<span className="font-serif text-xl font-normal italic text-lime"> / founder</span></a>
        <nav className="hidden gap-7 lg:flex">
          {NAV.map(([l, h]) => (
            <a key={h} href={h} className="label group relative overflow-hidden">
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">{l}</span>
              <span className="absolute inset-0 translate-y-full font-serif text-sm normal-case italic tracking-normal text-lime transition-transform duration-300 group-hover:translate-y-0">{l}</span>
            </a>
          ))}
        </nav>
        <a href="#contact" className="label hidden rounded-full bg-lime px-4 py-2 text-ink transition-transform hover:-rotate-3 lg:block">Let's talk</a>
        <button className="label lg:hidden" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button>
      </div>
      {open && (
        <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-2 flex flex-col gap-2 rounded-3xl bg-cobalt p-6 text-ivory lg:hidden">
          {[...NAV, ["Contact", "#contact"] as const].map(([l, h], i) => (
            <a key={h} href={h} onClick={() => setOpen(false)} className={`text-5xl ${i % 2 ? "font-serif italic" : "font-display font-bold"}`}>{l}</a>
          ))}
        </motion.nav>
      )}
    </header>
  );
}

function KineticWord({ word, className, delay }: { word: string; className: string; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className={`inline-block ${className}`}
      initial={reduce ? false : { opacity: 0, y: "0.25em" }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease, delay }}
    >
      {word}
    </motion.span>
  );
}

function Hero() {
  const { sx, sy, onMove } = useMouse();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const knightY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  return (
    <section ref={ref} id="top" onMouseMove={onMove} className="paper relative min-h-[100svh] overflow-hidden pt-24 lg:pt-28">
      {/* collage background shapes */}
      <Par mx={sx} my={sy} depth={-30} className="absolute -right-24 top-16 h-[70%] w-[46%] max-lg:hidden">
        <div className="h-full w-full bg-cobalt" style={{ clipPath: "polygon(8% 0, 100% 0, 100% 100%, 0 92%)" }} />
      </Par>
      <Par mx={sx} my={sy} depth={50} className="absolute bottom-16 left-[52%] max-lg:hidden">
        <div className="h-40 w-40 rounded-full bg-vermilion" />
      </Par>
      <motion.div style={{ y: knightY }} className="pointer-events-none absolute bottom-0 right-[2%] w-[38vw] max-w-[520px] opacity-30 sm:opacity-100 lg:w-[28vw]">
        <Par mx={sx} my={sy} depth={-60}>
          <motion.img
            src={knightImg}
            alt=""
            width={912}
            height={1104}
            className="cutout w-full"
            initial={{ opacity: 0, y: 120, rotate: 8 }}
            animate={{ opacity: 1, y: 0, rotate: -4 }}
            transition={{ duration: 1.4, ease, delay: 0.6 }}
          />
        </Par>
      </motion.div>
      <Par mx={sx} my={sy} depth={40} className="absolute right-4 top-24 w-20 text-ink sm:w-28 lg:right-[34%] lg:top-auto lg:bottom-20 lg:w-36">
        <Pop delay={1.2}><Sticker text="Strategy · Clarity · Growth · " className="bg-lime" /></Pop>
      </Par>
      <div className="tape absolute left-[60%] top-[14%] h-8 w-40 -rotate-6 max-lg:hidden" />

      <div className="relative z-10 mx-auto max-w-[1600px] px-5 lg:px-10">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="label mb-6 flex max-w-[70%] items-start gap-3 sm:max-w-none sm:items-center">
          <span className="inline-block h-2 w-2 rounded-full bg-vermilion" /> Issue 01 · Strategist & Founder, The Bombay Digital Company
        </motion.p>
        <h1 aria-label="Turning business problems into growth strategies." className="relative text-[clamp(2.6rem,10vw,11rem)] leading-[0.92] break-words">
          <span aria-hidden className="block">
            <KineticWord word="Turning" className="font-display font-bold" delay={0.1} />{" "}
            <KineticWord word="business" className="font-serif italic text-cobalt" delay={0.3} />
          </span>
          <span aria-hidden className="block">
            <KineticWord word="problems" className="font-display font-bold text-outline" delay={0.5} />
          </span>
          <span aria-hidden className="block lg:pl-[10vw]">
            <KineticWord word="into" className="font-serif italic" delay={0.7} />{" "}
            <span className="relative inline-block">
              <span className="absolute inset-x-0 bottom-[0.12em] top-[0.3em] -rotate-1 bg-lime" />
              <KineticWord word="growth" className="relative font-display font-bold" delay={0.8} />
            </span>
          </span>
          <span aria-hidden className="block">
            <KineticWord word="strategies." className="font-display font-bold text-vermilion" delay={1} />
          </span>
        </h1>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.8 }} className="relative z-10 mt-10 flex flex-wrap items-center gap-3 pb-14">
          <a href="#questions" className="label rounded-full bg-ink px-7 py-4 text-ivory transition-all hover:-rotate-2 hover:bg-cobalt">Read the issue ↓</a>
          <a href="#contact" className="label rounded-full border-2 border-ink px-7 py-4 transition-all hover:rotate-2 hover:bg-vermilion">Start a conversation</a>
        </motion.div>
      </div>
    </section>
  );
}

function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bustY = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const bustR = useTransform(scrollYProgress, [0, 1], [-10, 8]);
  return (
    <section ref={ref} id="about" className="relative overflow-hidden bg-cobalt px-5 py-28 text-ivory lg:px-10 lg:py-36">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="label mb-8 text-lime">01 — About the founder</p>
          <h2 className="mb-12 text-[clamp(2.5rem,6vw,6rem)] font-bold">
            <MaskLine>Strategy rooms</MaskLine>
            <MaskLine delay={0.1} className="font-serif font-normal italic text-lime">&amp; delivery calendars.</MaskLine>
          </h2>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease }} className="max-w-xl space-y-6 text-lg leading-relaxed lg:text-xl">
            <p><span className="float-left mr-3 font-serif text-7xl leading-[0.8] text-lime">I</span>’ve spent the last decade moving between strategy rooms and delivery calendars building positioning for founders, running campaigns, shaping brands, and sitting with teams on the days the plan meets reality.</p>
            <p>That mix is the point. I’ve consulted for businesses across categories and markets, and I’ve also built and led the teams that execute: brand, content, digital, performance and production.</p>
            <p className="font-serif text-2xl italic lg:text-3xl">So my advice doesn't stay on paper. It's shaped by years of building the teams that make growth happen.</p>
          </motion.div>
        </div>
        <div className="relative mx-auto w-full max-w-sm self-start lg:col-span-5 lg:max-w-none">
          <Pop rotate={3} className="relative">
            <div className="tape absolute -top-4 left-1/2 z-10 h-8 w-32 -translate-x-1/2 -rotate-3" />
            {/* Replace with the founder's real portrait */}
            <div className="relative flex aspect-[4/5] items-end bg-ivory p-4 text-ink shadow-[12px_12px_0_var(--ink)]">
              <div className="grain absolute inset-4 bg-muted" />
              <p className="label relative bg-ivory px-2 py-1">Founder portrait — TBDC</p>
            </div>
          </Pop>
          <Pop delay={0.3} rotate={-8} className="absolute -bottom-10 -left-8 w-28 text-ivory lg:w-36">
            <Sticker text="A decade in the room · " className="bg-vermilion" />
          </Pop>
        </div>
      </div>
      <motion.img src={bustImg} alt="" loading="lazy" width={912} height={1104} style={{ y: bustY, rotate: bustR }} className="halftone-tint pointer-events-none absolute -bottom-20 -left-16 w-72 opacity-25 lg:w-[28rem]" />
    </section>
  );
}

function Clarity() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["10%", "-30%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-30%", "5%"]);
  return (
    <section ref={ref} className="overflow-hidden bg-lime py-20 lg:py-28" aria-label="Growth starts with clarity. Clarity starts here.">
      <motion.p style={{ x: x1 }} className="whitespace-nowrap font-display text-[clamp(3.5rem,11vw,11rem)] font-bold leading-[0.9]" aria-hidden>
        Growth starts with <span className="font-serif font-normal italic text-cobalt">clarity.</span>
      </motion.p>
      <motion.p style={{ x: x2 }} className="whitespace-nowrap font-display text-[clamp(3.5rem,11vw,11rem)] font-bold leading-[0.9]" aria-hidden>
        <span className="text-outline">Clarity</span> starts <span className="rounded-full bg-ink px-[0.3em] font-serif font-normal italic text-lime">here.</span>
      </motion.p>
    </section>
  );
}

const QUESTIONS = [
  "Where do I even begin with marketing?",
  "What's the right marketing budget and media split for a new brand?",
  "Which E-commerce platform is right for my brand?",
  "How do I price my product right?",
  "How do i increase my ROAS",
  "How do we turn more traffic into sales?",
  "Are we ready to scale?",
  "How do we improve customer retention?",
];
const Q_HOVER = ["hover:bg-lime", "hover:bg-vermilion", "hover:bg-cobalt hover:text-ivory", "hover:bg-lime", "hover:bg-vermilion", "hover:bg-cobalt hover:text-ivory", "hover:bg-lime", "hover:bg-vermilion"];

function Questions() {
  const [active, setActive] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rot = useTransform(scrollYProgress, [0, 1], [-90, 270]);
  return (
    <section ref={ref} id="questions" className="paper relative overflow-hidden px-5 py-28 lg:px-10 lg:py-36">
      <motion.img src={compassImg} alt="" loading="lazy" width={912} height={912} style={{ rotate: rot }} className="pointer-events-none absolute -right-20 top-10 w-64 opacity-90 lg:w-96" />
      <div className="relative mb-16 max-w-4xl">
        <p className="label mb-6 text-vermilion">02 — The business problems I help solve</p>
        <h2 className="text-[clamp(2.5rem,6vw,6rem)] font-bold">
          <MaskLine>Growth starts with clarity.</MaskLine>
          <MaskLine delay={0.1} className="font-serif font-normal italic text-cobalt">Clarity starts here.</MaskLine>
        </h2>
      </div>
      <ol className="relative">
        {QUESTIONS.map((q, i) => (
          <motion.li
            key={q}
            initial={{ opacity: 0, x: i % 2 ? 60 : -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease }}
            className={i % 2 ? "lg:pl-[12%]" : ""}
          >
            <a
              href="#contact"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className={`group flex items-center gap-5 border-t-2 border-ink py-5 transition-all duration-300 lg:gap-10 lg:px-6 ${Q_HOVER[i]} focus-visible:bg-lime focus-visible:outline-none`}
            >
              <span className="font-serif text-5xl italic leading-none lg:text-7xl">{String(i + 1).padStart(2, "0")}</span>
              <span className={`font-display text-xl font-bold leading-tight transition-transform duration-500 lg:text-4xl ${active === i ? "translate-x-2 -skew-x-6" : ""}`}>{q}</span>
              <span className="ml-auto grid h-12 w-12 shrink-0 scale-0 place-items-center rounded-full bg-ink text-xl text-ivory transition-transform duration-300 group-hover:scale-100" aria-hidden>→</span>
            </a>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

const EXPERTISE = [
  { t: "Go-to-market strategy", d: ["Your go-to-market plan: the right market, audience and route to demand, whether you're launching, entering or scaling."], c: "bg-ivory text-ink", r: -3 },
  { t: "Growth strategy", d: ["Finding what's slowing your growth, and building the plan to fix it."], c: "bg-lime text-ink", r: 2 },
  { t: "E-commerce strategy | Quick commerce", d: ["Improving the journey from first consideration to conversion, retention, and repeat value.", "What are the right Market Portals, turning browsers into buyers, and buyers into repeat customers."], c: "bg-vermilion text-ink", r: -2 },
  { t: "Marketing strategy", d: ["Marketing built around business goals, not vanity metrics."], c: "bg-cobalt text-ivory", r: 3 },
  { t: "Brand positioning", d: ["What your brand stands for, who it's for, and why it deserves to be chosen."], c: "bg-ivory text-ink", r: -1 },
  { t: "Digital strategy", d: ["Brand, performance, content and tech working as one connected system."], c: "bg-lime text-ink", r: 2 },
];

function Expertise() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-68%"]);
  const reduce = useReducedMotion();
  return (
    <section ref={ref} id="expertise" className="relative bg-ink text-ivory lg:h-[320vh]">
      <div className="overflow-hidden py-24 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 px-5 lg:px-10">
          <h2 className="text-[clamp(2.5rem,6vw,6rem)] font-bold">
            <MaskLine>Where I usually</MaskLine>
            <MaskLine delay={0.1}>enter the <span className="font-serif font-normal italic text-lime">picture.</span></MaskLine>
          </h2>
          <p className="label text-ivory/60 max-lg:hidden">Keep scrolling →</p>
        </div>
        <motion.div style={reduce ? {} : { x }} className="flex gap-6 px-5 max-lg:flex-col lg:w-max lg:px-10">
          {EXPERTISE.map((e, i) => (
            <article
              key={e.t}
              style={{ rotate: `${e.r}deg` }}
              className={`${e.c} group relative flex shrink-0 flex-col justify-between p-7 transition-transform duration-500 hover:rotate-0 hover:scale-[1.03] lg:h-[58vh] lg:w-[30rem]`}
            >
              <div className="flex items-start justify-between">
                <span className="font-serif text-8xl italic leading-none lg:text-9xl">{String(i + 1).padStart(2, "0")}</span>
                <span className="label">Chapter {i + 1}/6</span>
              </div>
              <div>
                <h3 className="mb-4 font-display text-3xl font-bold leading-[0.95] lg:text-4xl">{e.t}</h3>
                <div className="space-y-2 text-base leading-relaxed lg:text-lg">
                  {e.d.map((p) => <p key={p}>{p}</p>)}
                </div>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const STEPS = ["Listen", "Audit", "Strategize", "Execute"];
const STEP_C = ["text-cobalt", "text-vermilion", "text-ink", "text-cobalt"];

function Process() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const path = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  return (
    <section ref={ref} id="process" className="paper relative overflow-hidden px-5 py-28 lg:px-10 lg:py-36">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <h2 className="text-[clamp(2.5rem,6vw,6rem)] font-bold">
          <MaskLine>Roadmap</MaskLine>
          <MaskLine delay={0.1} className="font-serif font-normal italic text-vermilion">to success</MaskLine>
        </h2>
        <p className="label rounded-full bg-ink px-4 py-2 text-lime">Listen → Audit → Strategize → Execute</p>
      </div>
      <div className="relative">
        <svg className="pointer-events-none absolute left-6 top-0 h-full w-4 lg:left-10" viewBox="0 0 10 100" preserveAspectRatio="none" aria-hidden>
          <motion.path d="M5 0 V100" stroke="var(--ink)" strokeWidth="3" fill="none" style={{ pathLength: path }} vectorEffect="non-scaling-stroke" />
        </svg>
        {STEPS.map((s, i) => (
          <motion.div
            key={s}
            initial={{ opacity: 0.15 }}
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.8 }}
            transition={{ duration: 0.5 }}
            className="relative flex items-center gap-6 py-4 pl-16 lg:gap-12 lg:pl-28"
            style={{ marginLeft: `${i * 6}vw` }}
          >
            <span className={`absolute left-3 grid h-8 w-8 place-items-center rounded-full bg-ink font-display text-xs font-bold text-ivory lg:left-7 ${i === 3 ? "bg-vermilion" : ""}`}>{i + 1}</span>
            <span className={`font-display text-[clamp(3rem,9vw,9rem)] font-bold leading-none ${STEP_C[i]} ${i % 2 ? "font-serif font-normal italic" : ""}`}>{s}</span>
            {i < 3 && <span className="font-serif text-4xl italic text-muted-foreground max-sm:hidden">→</span>}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Performance() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.25, 1]);
  const megaX = useTransform(scrollYProgress, [0, 0.5], [200, 0]);
  return (
    <section ref={ref} className="relative overflow-hidden bg-vermilion px-5 py-28 lg:px-10 lg:py-36">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="relative z-10 lg:col-span-6">
          <p className="label mb-6">03 — The Bombay Digital Company</p>
          <h2 className="text-[clamp(3rem,8vw,8rem)] font-bold">
            <MaskLine>Performance,</MaskLine>
            <MaskLine delay={0.1} className="font-serif font-normal italic text-ivory">not promises.</MaskLine>
          </h2>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease, delay: 0.2 }} className="mt-10 max-w-md bg-ivory p-6 shadow-[10px_10px_0_var(--ink)]">
            <p className="mb-3 font-display text-2xl font-bold">The execution engine behind the strategy.</p>
            <p className="text-lg leading-relaxed">A full-service team across brand, content, digital and performance, trusted by 100+ brands to turn strategy into results.</p>
          </motion.div>
        </div>
        <div className="relative lg:col-span-6">
          <motion.div initial={{ clipPath: "inset(100% 0 0 0)" }} whileInView={{ clipPath: "inset(0% 0 0 0)" }} viewport={{ once: true }} transition={{ duration: 1.3, ease }} className="relative aspect-[4/5] overflow-hidden lg:-rotate-2">
            <motion.img src={executionImg} alt="The TBDC team at work in the studio" loading="lazy" width={1600} height={1008} style={{ scale: imgScale }} className="h-full w-full object-cover" />
          </motion.div>
          <motion.img src={megaphoneImg} alt="" loading="lazy" width={1008} height={912} style={{ x: megaX }} className="cutout pointer-events-none absolute -bottom-10 -left-10 w-3/4 lg:-left-24" />
          <Pop rotate={10} delay={0.4} className="absolute -right-2 -top-8 grid h-36 w-36 place-items-center rounded-full bg-lime text-center lg:h-44 lg:w-44">
            <div><span className="block font-display text-5xl font-bold lg:text-6xl">100+</span><span className="label">brands</span></div>
          </Pop>
        </div>
      </div>
    </section>
  );
}

const NOTES = [
  { t: "Disrupt the Market", img: megaphoneImg, c: "bg-vermilion" },
  { t: "Clarity before channels", img: compassImg, c: "bg-lime" },
  { t: "Bad positioning is expensive", img: knightImg, c: "bg-cobalt" },
  { t: "Virality is a piece of Art", img: bustImg, c: "bg-vermilion" },
  { t: "Conversion is a context problem", img: compassImg, c: "bg-lime" },
];

function Notes() {
  const [hover, setHover] = useState<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 25 });
  const sy = useSpring(my, { stiffness: 200, damping: 25 });
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };
  return (
    <section id="notes" onMouseMove={onMove} className="relative bg-ink px-5 py-28 text-ivory lg:px-10 lg:py-36">
      <div className="mb-14 flex items-end justify-between">
        <h2 className="text-[clamp(3rem,8vw,8rem)] font-bold">
          <MaskLine>Notes on</MaskLine>
          <MaskLine delay={0.1} className="font-serif font-normal italic text-lime">growth.</MaskLine>
        </h2>
        <p className="label max-lg:hidden">04 — Editorial</p>
      </div>
      <motion.div
        style={{ x: sx, y: sy }}
        className="pointer-events-none absolute left-0 top-0 z-20 max-lg:hidden"
        animate={{ opacity: hover === null ? 0 : 1, scale: hover === null ? 0.6 : 1 }}
        transition={{ duration: 0.25 }}
      >
        {hover !== null && (
          <div className={`-translate-x-1/2 -translate-y-1/2 rotate-6 ${NOTES[hover]?.c} p-3`}>
            <img src={NOTES[hover]?.img} alt="" className="h-44 w-44 object-contain" />
          </div>
        )}
      </motion.div>
      <ul>
        {NOTES.map((n, i) => (
          <li key={n.t} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className="group border-t border-ivory/25 last:border-b">
            <div className="flex items-baseline justify-between gap-6 py-7 lg:px-2">
              <span className="label text-ivory/50">No. {i + 1}</span>
              <span className={`flex-1 text-3xl transition-all duration-500 group-hover:translate-x-4 group-hover:text-lime lg:text-6xl ${i % 2 ? "font-serif italic" : "font-display font-bold"}`}>{n.t}</span>
              <span className="label rounded-full border border-ivory/40 px-3 py-1">Soon</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Magnetic({ children }: { children: ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 12 });
  const sy = useSpring(y, { stiffness: 150, damping: 12 });
  return (
    <motion.div
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.35);
        y.set((e.clientY - r.top - r.height / 2) * 0.35);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    e.currentTarget.reset();
  };
  const field = "w-full border-b-2 border-ink bg-transparent py-4 text-lg placeholder:text-ink/50 focus:border-cobalt focus:outline-none";
  return (
    <section id="contact" className="paper relative overflow-hidden px-5 pt-28 lg:px-10 lg:pt-36">
      <div className="tape absolute right-[10%] top-20 h-8 w-44 rotate-6" />
      <h2 className="relative text-[clamp(3rem,10vw,11rem)] font-bold leading-[0.86]">
        <MaskLine>Have a <span className="font-serif font-normal italic text-cobalt">business</span></MaskLine>
        <MaskLine delay={0.1}>problem <span className="text-outline">worth</span></MaskLine>
        <MaskLine delay={0.2}><span className="relative inline-block"><span className="absolute inset-x-0 bottom-[0.1em] top-[0.35em] rotate-1 bg-vermilion" /><span className="relative">solving?</span></span></MaskLine>
      </h2>
      <div className="relative mt-16 grid gap-12 pb-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="font-serif text-3xl italic leading-tight lg:text-5xl">Every growth story starts with one honest conversation. <span className="not-italic font-display font-bold text-vermilion">Let's have ours.</span></p>
          <Pop rotate={-10} delay={0.3} className="mt-10 w-32 text-ivory lg:w-40">
            <Sticker text="Say hello · Say hello · " className="bg-cobalt" />
          </Pop>
        </div>
        <form onSubmit={submit} className="space-y-4 lg:col-span-6 lg:col-start-7">
          <label className="sr-only" htmlFor="name">Name</label>
          <input id="name" required placeholder="Your name" className={field} />
          <label className="sr-only" htmlFor="email">Email</label>
          <input id="email" type="email" required placeholder="Email" className={field} />
          <label className="sr-only" htmlFor="msg">The problem</label>
          <textarea id="msg" required rows={3} placeholder="The business problem" className={field} />
          <div className="pt-6">
            <Magnetic>
              <button className="grid h-36 w-36 place-items-center rounded-full bg-ink p-4 text-center font-display text-lg font-bold text-ivory transition-colors hover:bg-cobalt">
                {sent ? "Thank you ✓" : "Send it →"}
              </button>
            </Magnetic>
          </div>
        </form>
      </div>
      <VelocityMarquee className="-mx-5 bg-ink text-ivory lg:-mx-10" words={["Let's talk", "Growth", "Clarity", "Strategy"]} base={-1} />
      <footer className="-mx-5 flex flex-wrap justify-between gap-4 bg-ink px-5 pb-8 pt-4 text-ivory/60 lg:-mx-10 lg:px-10">
        <span className="label">© {new Date().getFullYear()} Founder, The Bombay Digital Company</span>
        <a href="#top" className="label hover:text-lime">Back to top ↑</a>
      </footer>
    </section>
  );
}

function Index() {
  return (
    <main className="overflow-x-clip">
      <Nav />
      <Hero />
      <VelocityMarquee className="-rotate-1 bg-ink text-ivory" words={["Positioning", "Go-to-market", "Growth", "E-commerce", "Brand", "Performance"]} />
      <About />
      <Clarity />
      <Questions />
      <Expertise />
      <Process />
      <Performance />
      <Notes />
      <Contact />
    </main>
  );
}
