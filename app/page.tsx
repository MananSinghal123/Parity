"use client";

import Image from "next/image";
import Link from "next/link";
import { Shield, Zap, Layers, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-full">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(22,163,74,0.15),transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <Zap className="h-4 w-4" />
            Gasless trading on Polymarket
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
            Hedge crypto risk
            <br />
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              with prediction markets
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 md:text-xl">
            Parity connects your token positions to Polymarket event markets.
            Buy YES on &quot;Will ETH drop 30%?&quot; — if it happens, you get paid.
            Real hedges. Real markets. Zero gas.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/markets"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-primary/40"
            >
              Enter Markets
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="https://polymarket.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800/50 px-8 py-4 text-lg font-medium text-slate-200 backdrop-blur transition-colors hover:border-slate-500 hover:bg-slate-800"
            >
              Powered by Polymarket
            </a>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="border-b border-border bg-background px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-16 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-primary">
                The problem
              </p>
              <h2 className="mt-3 text-2xl font-bold text-text-primary md:text-3xl">
                Crypto is volatile. Traditional hedges don&apos;t exist.
              </h2>
              <p className="mt-4 text-text-secondary">
                You hold ETH, APT, or OP. A flash crash, exploit, or unlock can
                wipe 30% overnight. Options and perps are complex, capital-heavy,
                and often unavailable for altcoins. There&apos;s no simple way to
                protect your stack.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-primary">
                The solution
              </p>
              <h2 className="mt-3 text-2xl font-bold text-text-primary md:text-3xl">
                Event markets as insurance.
              </h2>
              <p className="mt-4 text-text-secondary">
                Polymarket runs prediction markets on real events: &quot;Will ETH
                drop below $2,500?&quot; Buy 100 YES at $0.28. If it happens,
                you receive $100. That payout offsets your token losses. It&apos;s
                hedging, reimagined — simple, transparent, and on-chain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-border bg-surface-light px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-text-primary md:text-3xl">
            How it works
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-text-secondary">
            Three steps to hedge any token position.
          </p>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Pick a token",
                desc: "Select the asset you hold — ETH, APT, OP, ARB — and view related event markets.",
                icon: Layers,
              },
              {
                step: "02",
                title: "Find your hedge",
                desc: "Browse Polymarket events: price drops, network outages, token unlocks. Buy YES if you want protection.",
                icon: Shield,
              },
              {
                step: "03",
                title: "Trade gasless",
                desc: "Connect wallet, initialize once. All orders execute on Polymarket with zero gas fees.",
                icon: Zap,
              },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div
                key={step}
                className="group relative rounded-2xl border border-border bg-surface p-8 transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <span className="text-5xl font-bold text-primary/20">
                  {step}
                </span>
                <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-text-primary">
                  {title}
                </h3>
                <p className="mt-2 text-text-secondary">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="border-b border-border bg-background px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-text-primary md:text-4xl">
            The future of crypto risk is
            <br />
            <span className="text-primary">predictable.</span>
          </h2>
          <p className="mt-6 text-lg text-text-secondary">
            Parity brings institutional-grade hedging to every holder. No
            options, no perps — just event markets that pay out when it matters.
            Built on Polymarket. Powered by you.
          </p>
          <Link
            href="/markets"
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Get started
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-slate-950 px-6 py-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <Image
              src="/parity-logo.jpg"
              alt="Parity"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-xl font-bold text-white">Parity</span>
          </div>
          <p className="text-center text-slate-400 md:text-left">
            Hedge crypto risk with Polymarket event markets.
          </p>
          <Link
            href="/markets"
            className="rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Enter app
          </Link>
        </div>
      </section>
    </div>
  );
}
