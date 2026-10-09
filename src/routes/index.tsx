import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useState, type FormEvent, type ReactNode } from "react";
import executionImg from "@/assets/execution.jpg";

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

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

function MaskLine({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className={`block ${className}`}
        initial={reduce ? false : { y: "110%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

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
    <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference text-ivory">
      <div className="flex items-center justify-between px-5 py-5 md:px-10">
        <a href="#top" className="font-display text-lg font-bold tracking-tight">TBDC<span className="text-lime">/</span>Founder</a>
        <nav className="hidden gap-8 md:flex">
          {NAV.map(([l, h], i) => (
            <a key={h} href={h} className="label group relative">
              <span className="mr-1 opacity-50">0{i + 1}</span>{l}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>
        <a href="#contact" className="label hidden md:block">Let's talk →</a>
        <button className="label md:hidden" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button>
      </div>
      {open && (
        <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4 bg-ink px-5 pb-8 md:hidden">
          {[...NAV, ["Contact", "#contact"] as const].map(([l, h]) => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="font-display text-4xl font-bold">{l}</a>
          ))}
        </motion.nav>
      )}
    </header>
  );
}

function Hero() {
  const reduce = useReducedMotion();
  const words: Variants = { hidden: { y: "110%" }, show: (i: number) => ({ y: "0%", transition: { duration: 1.1, ease, delay: 0.15 + i * 0.12 } }) };
  const lines = [
    { t: "Turning", c: "text-ink" },
    { t: "business", c: "text-outline text-ink md:pl-[18vw]" },
    { t: "problems", c: "text-ivory" },
    { t: "into growth", c: "italic text-lime md:pl-[8vw]" },
    { t: "strategies.", c: "text-ink md:text-right" },
  ];
  return (
    <section id="top" className="relative min-h-screen overflow-hidden bg-cobalt pt-28">
      <div className="absolute right-0 top-0 h-full w-[38%] bg-vermilion max-md:hidden" />
      <div className="grain absolute inset-0 opacity-30" />
      <div className="relative px-5 md:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 text-ivory">
          <p className="label max-w-xs">Strategist · Founder, The Bombay Digital Company</p>
          <p className="label">Mumbai — Est. a decade in the room</p>
        </div>
        <h1 className="text-mega font-bold" aria-label="Turning business problems into growth strategies.">
          {lines.map((l, i) => (
            <span key={l.t} className="block overflow-hidden pb-[0.04em]" aria-hidden>
              <motion.span className={`block ${l.c}`} custom={i} variants={words} initial={reduce ? false : "hidden"} animate="show">
                {l.t}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="mt-10 flex flex-wrap items-center gap-4 pb-16">
          <a href="#questions" className="label bg-ink px-7 py-5 text-ivory transition-colors hover:bg-lime hover:text-ink">Explore the work ↓</a>
          <a href="#contact" className="label border border-ivory px-7 py-5 text-ivory transition-colors hover:bg-ivory hover:text-ink">Start a conversation</a>
        </motion.div>
      </div>
    </section>
  );
}

function Marquee({ words, className }: { words: string[]; className: string }) {
  const row = [...words, ...words];
  return (
    <div className={`overflow-hidden py-5 ${className}`} aria-hidden>
      <div className="marquee flex w-max gap-10 whitespace-nowrap font-display text-3xl font-bold uppercase md:text-5xl">
        {[...row, ...row].map((w, i) => <span key={i}>{w} <span className="mx-4">✳</span></span>)}
      </div>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="relative bg-ivory px-5 py-28 md:px-10 md:py-40">
      <div className="grid gap-16 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="label mb-8 text-vermilion">01 — About the founder</p>
          <h2 className="text-big mb-12 font-bold">
            <MaskLine>Strategy rooms.</MaskLine>
            <MaskLine delay={0.1} className="italic text-cobalt">Delivery calendars.</MaskLine>
          </h2>
          <Reveal className="max-w-xl space-y-6 text-lg leading-relaxed md:text-xl">
            <p>I’ve spent the last decade moving between strategy rooms and delivery calendars building positioning for founders, running campaigns, shaping brands, and sitting with teams on the days the plan meets reality.</p>
            <p>That mix is the point. I’ve consulted for businesses across categories and markets, and I’ve also built and led the teams that execute: brand, content, digital, performance and production.</p>
            <p className="font-semibold">So my advice doesn't stay on paper. It's shaped by years of building the teams that make growth happen.</p>
          </Reveal>
        </div>
        <Reveal delay={0.2} className="relative md:col-span-5">
          <div className="absolute -left-6 -top-6 h-2/3 w-2/3 bg-lime" />
          <div className="absolute -bottom-6 -right-2 h-1/3 w-1/2 bg-vermilion md:-right-10" />
          {/* Replace with the founder's real portrait */}
          <div className="relative flex aspect-[4/5] items-end bg-ink p-6 text-ivory">
            <div className="grain absolute inset-0 opacity-40" />
            <p className="label relative">Founder portrait<br /><span className="opacity-50">The Bombay Digital Company</span></p>
          </div>
        </Reveal>
      </div>
      <Reveal className="mt-28 md:-mr-10 md:ml-[20%]">
        <p className="text-huge bg-ink px-6 py-10 font-display font-bold text-ivory md:px-12">
          Growth starts with <span className="text-lime italic">clarity.</span> Clarity starts <span className="text-outline">here.</span>
        </p>
      </Reveal>
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

function Questions() {
  const [active, setActive] = useState(0);
  return (
    <section id="questions" className="bg-ink px-5 py-28 text-ivory md:px-10 md:py-40">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:sticky md:top-28 md:col-span-4 md:self-start">
          <p className="label mb-8 text-lime">02 — The business problems I help solve</p>
          <h2 className="text-big font-bold">
            <MaskLine>Growth starts</MaskLine>
            <MaskLine delay={0.1}>with clarity.</MaskLine>
            <MaskLine delay={0.2} className="italic text-vermilion">Clarity starts here.</MaskLine>
          </h2>
          <p className="font-display mt-12 text-[9rem] font-bold leading-none text-cobalt max-md:hidden" aria-hidden>
            0{active + 1}
          </p>
        </div>
        <ol className="md:col-span-8">
          {QUESTIONS.map((q, i) => (
            <li key={q}>
              <a
                href="#contact"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group flex items-baseline gap-6 border-t border-ivory/20 py-7 transition-colors last:border-b hover:bg-lime hover:text-ink focus-visible:bg-lime focus-visible:text-ink focus-visible:outline-none md:px-4"
              >
                <span className="label w-8 shrink-0 opacity-60">0{i + 1}</span>
                <span className="font-display text-2xl font-bold leading-tight transition-transform duration-500 group-hover:translate-x-3 md:text-4xl">{q}</span>
                <span className="ml-auto text-2xl opacity-0 transition-opacity group-hover:opacity-100" aria-hidden>→</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const EXPERTISE = [
  { t: "Go-to-market strategy", d: ["Your go-to-market plan: the right market, audience and route to demand, whether you're launching, entering or scaling."], bg: "bg-ivory", n: "text-cobalt" },
  { t: "Growth strategy", d: ["Finding what's slowing your growth, and building the plan to fix it."], bg: "bg-lime", n: "text-ink" },
  { t: "E-commerce strategy | Quick commerce", d: ["Improving the journey from first consideration to conversion, retention, and repeat value.", "What are the right Market Portals, turning browsers into buyers, and buyers into repeat customers."], bg: "bg-ivory", n: "text-vermilion" },
  { t: "Marketing strategy", d: ["Marketing built around business goals, not vanity metrics."], bg: "bg-cobalt text-ivory", n: "text-lime" },
  { t: "Brand positioning", d: ["What your brand stands for, who it's for, and why it deserves to be chosen."], bg: "bg-ivory", n: "text-ink" },
  { t: "Digital strategy", d: ["Brand, performance, content and tech working as one connected system."], bg: "bg-vermilion", n: "text-ivory" },
];

function Expertise() {
  return (
    <section id="expertise" className="bg-ivory py-28 md:py-40">
      <div className="px-5 md:px-10">
        <p className="label mb-8 text-cobalt">03 — Expertise</p>
        <h2 className="text-huge mb-20 max-w-5xl font-bold">
          <MaskLine>Where I usually</MaskLine>
          <MaskLine delay={0.1}>enter the <span className="italic text-vermilion">picture.</span></MaskLine>
        </h2>
      </div>
      <div>
        {EXPERTISE.map((e, i) => (
          <Reveal key={e.t}>
            <article className={`${e.bg} grid items-start gap-6 border-t border-ink/15 px-5 py-14 md:grid-cols-12 md:px-10 ${i % 2 ? "md:text-right" : ""}`}>
              <span className={`font-display text-8xl font-bold leading-none md:col-span-3 md:text-[10rem] ${e.n} ${i % 2 ? "md:order-3" : ""}`}>0{i + 1}</span>
              <h3 className="text-big font-bold md:col-span-5">{e.t}</h3>
              <div className={`space-y-3 text-lg leading-relaxed md:col-span-4 ${i % 2 ? "md:order-first md:text-left" : ""}`}>
                {e.d.map((p) => <p key={p}>{p}</p>)}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const STEPS = ["Listen", "Audit", "Strategize", "Execute"];
const STEP_BG = ["bg-ivory text-ink", "bg-lime text-ink", "bg-vermilion text-ink", "bg-cobalt text-ivory"];

function Process() {
  const reduce = useReducedMotion();
  return (
    <section id="process" className="bg-ink px-5 py-28 text-ivory md:px-10 md:py-40">
      <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
        <h2 className="text-huge font-bold"><MaskLine>Roadmap</MaskLine><MaskLine delay={0.1} className="text-outline">to success</MaskLine></h2>
        <p className="label text-lime">Listen → Audit → Strategize → Execute</p>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {STEPS.map((s, i) => (
          <motion.div
            key={s}
            initial={reduce ? false : { opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease, delay: i * 0.15 }}
            className={`${STEP_BG[i]} flex min-h-56 flex-col justify-between p-6`}
            style={{ marginTop: `calc(${i} * clamp(0px, 4vw, 5rem))` }}
          >
            <span className="label">Step 0{i + 1} {i < 3 && "→"}</span>
            <span className="font-display text-4xl font-bold md:text-5xl">{s}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Performance() {
  return (
    <section className="relative overflow-hidden bg-lime">
      <div className="grid md:grid-cols-12">
        <div className="px-5 py-28 md:col-span-6 md:px-10 md:py-40">
          <p className="label mb-8">04 — TBDC</p>
          <h2 className="text-huge font-bold">
            <MaskLine>Performance,</MaskLine>
            <MaskLine delay={0.1} className="italic text-cobalt">not promises.</MaskLine>
          </h2>
          <Reveal delay={0.2} className="mt-14 max-w-md">
            <p className="font-display mb-4 text-2xl font-bold">The execution engine behind the strategy.</p>
            <p className="text-lg leading-relaxed">A full-service team across brand, content, digital and performance, trusted by 100+ brands to turn strategy into results.</p>
          </Reveal>
        </div>
        <motion.div
          className="relative min-h-[60vh] md:col-span-6"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          whileInView={{ clipPath: "inset(0 0 0% 0)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease }}
        >
          <img src={executionImg} alt="The TBDC team at work in the studio" loading="lazy" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute bottom-0 left-0 bg-vermilion px-6 py-5 md:-left-0">
            <span className="font-display text-6xl font-bold md:text-8xl">100+</span>
            <span className="label block">Brands</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const NOTES = ["Disrupt the Market", "Clarity before channels", "Bad positioning is expensive", "Virality is a piece of Art", "Conversion is a context problem"];
const NOTE_HOVER = ["group-hover:bg-cobalt", "group-hover:bg-vermilion", "group-hover:bg-lime", "group-hover:bg-cobalt", "group-hover:bg-vermilion"];

function Notes() {
  return (
    <section id="notes" className="bg-ivory px-5 py-28 md:px-10 md:py-40">
      <div className="mb-16 flex items-end justify-between">
        <h2 className="text-huge font-bold"><MaskLine>Notes on</MaskLine><MaskLine delay={0.1} className="italic text-vermilion">growth.</MaskLine></h2>
        <p className="label max-md:hidden">05 — Editorial</p>
      </div>
      <ul>
        {NOTES.map((n, i) => (
          <li key={n} className="group relative border-t border-ink/20 last:border-b">
            <div className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 group-hover:scale-y-100 ${NOTE_HOVER[i]}`} />
            <div className="relative flex items-center justify-between gap-6 py-8 md:px-4">
              <span className="label opacity-60">Note 0{i + 1}</span>
              <span className="font-display flex-1 text-3xl font-bold transition-transform duration-500 group-hover:translate-x-4 md:text-6xl">{n}</span>
              <span className="label">Soon</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    e.currentTarget.reset();
  };
  const field = "w-full border-b border-ivory/40 bg-transparent py-4 text-lg text-ivory placeholder:text-ivory/50 focus:border-lime focus:outline-none";
  return (
    <section id="contact" className="relative overflow-hidden bg-vermilion px-5 pt-28 md:px-10 md:pt-40">
      <h2 className="text-mega font-bold">
        <MaskLine>Have a</MaskLine>
        <MaskLine delay={0.1} className="text-outline">business</MaskLine>
        <MaskLine delay={0.2}>problem worth</MaskLine>
        <MaskLine delay={0.3} className="italic text-ivory">solving?</MaskLine>
      </h2>
      <div className="relative z-10 -mx-5 mt-16 grid gap-12 bg-ink px-5 py-16 text-ivory md:-mx-10 md:grid-cols-12 md:px-10">
        <p className="font-display text-3xl font-bold md:col-span-5 md:text-4xl">Every growth story starts with one honest conversation. <span className="text-lime">Let's have ours.</span></p>
        <form onSubmit={submit} className="space-y-4 md:col-span-6 md:col-start-7">
          <label className="sr-only" htmlFor="name">Name</label>
          <input id="name" required placeholder="Your name" className={field} />
          <label className="sr-only" htmlFor="email">Email</label>
          <input id="email" type="email" required placeholder="Email" className={field} />
          <label className="sr-only" htmlFor="msg">The problem</label>
          <textarea id="msg" required rows={3} placeholder="The business problem" className={field} />
          <button className="label mt-6 bg-lime px-8 py-5 text-ink transition-colors hover:bg-ivory">{sent ? "Thank you — talk soon ✓" : "Send it →"}</button>
        </form>
      </div>
      <footer className="-mx-5 flex flex-wrap justify-between gap-4 bg-ink px-5 pb-8 text-ivory/60 md:-mx-10 md:px-10">
        <span className="label">© {new Date().getFullYear()} Founder, The Bombay Digital Company</span>
        <a href="#top" className="label hover:text-lime">Back to top ↑</a>
      </footer>
    </section>
  );
}

function Index() {
  return (
    <main>
      <Nav />
      <Hero />
      <Marquee className="bg-ink text-ivory" words={["Positioning", "Go-to-market", "Growth", "E-commerce", "Brand", "Performance"]} />
      <About />
      <Questions />
      <Expertise />
      <Process />
      <Performance />
      <Notes />
      <Contact />
    </main>
  );
}
