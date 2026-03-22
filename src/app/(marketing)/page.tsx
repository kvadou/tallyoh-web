import Link from "next/link"

export default function HomePage() {
  return (
    <div className="bg-surface text-navy min-h-screen">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/70 backdrop-blur-[20px]">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/">
            <img src="/logo-nav.png" alt="TallyOh" className="h-14" />
          </Link>
          <nav className="hidden md:flex items-center gap-10">
            {[
              ["#kingdom", "Kingdom"],
              ["#characters", "Characters"],
              ["#parents", "For Parents"],
              ["#story", "Our Story"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="font-heading font-semibold text-sm text-slate hover:text-[#36679c] transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative w-full h-[85vh] min-h-[600px] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/castle-kingdom.png"
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/25 flex flex-col items-center justify-center text-center px-6">
          <h1 className="font-heading font-extrabold text-white text-5xl sm:text-6xl md:text-7xl leading-[1.1] tracking-tight drop-shadow-lg">
            Where every Tally
            <br />
            tells a Story
          </h1>
          <p className="mt-4 text-white/90 text-lg sm:text-xl font-medium">
            A financial literacy adventure for ages 4&ndash;10
          </p>
          <a
            href="#download"
            className="mt-8 inline-flex items-center gap-2.5 bg-surface/95 backdrop-blur-md text-navy font-heading font-bold px-8 py-4 rounded-full shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Download on the App Store
          </a>
        </div>
      </section>

      {/* Kingdom Map */}
      <section id="kingdom" className="py-24 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="font-heading font-extrabold text-4xl md:text-5xl mb-3">
            Explore the Kingdom
          </h2>
          <p className="text-slate text-lg mb-10 max-w-xl mx-auto">
            Four Adventure Lands, each teaching a different skill. One epic
            journey.
          </p>
          <img
            src="/kingdom-map.jpg"
            alt="TallyOh Kingdom Map"
            className="mx-auto rounded-2xl shadow-xl max-w-[900px] w-full"
            loading="lazy"
          />
        </div>
      </section>

      {/* Adventure Lands */}
      <section className="py-20 px-6 bg-surface-low">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-center mb-10">
            Adventure Lands
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                img: "coin-canyon.jpg",
                title: "Coin Canyon",
                color: "#865c22",
                desc: "Where Hammy teaches the art of earning. Explore canyons, discover gold, learn that hard work pays off.",
              },
              {
                img: "savings-forest.jpg",
                title: "Savings Forest",
                color: "#5A9A5E",
                desc: "Pearl's peaceful grove where patience grows. Save a little, watch it grow a lot.",
              },
              {
                img: "invention-tower.jpg",
                title: "Invention Tower",
                color: "#7B68AE",
                desc: "Sparks' workshop where creativity meets technology. Think, build, innovate.",
              },
              {
                img: "family-store.jpg",
                title: "Family Store",
                color: "#E87040",
                desc: "The marketplace where coins become real rewards. Parents stock it, kids earn it.",
              },
            ].map((land) => (
              <div
                key={land.title}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_32px_rgba(44,62,80,0.05)] hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(44,62,80,0.07)] transition-all"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={`/${land.img}`}
                    alt={land.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h3
                    className="font-heading font-bold text-xl mb-1"
                    style={{ color: land.color }}
                  >
                    {land.title}
                  </h3>
                  <p className="text-slate text-sm leading-relaxed">
                    {land.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pop-up Book */}
      <section className="py-24 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <img
            src="/popup-book-world.png"
            alt="Pop-up storybook world"
            className="mx-auto rounded-2xl shadow-xl max-w-[800px] w-full mb-10"
            loading="lazy"
          />
          <h2 className="font-heading font-extrabold text-4xl md:text-5xl mb-3">
            Every Adventure Begins
            <br />
            With a Story
          </h2>
          <p className="text-slate text-lg max-w-2xl mx-auto leading-relaxed">
            TallyOh turns financial concepts into stories kids actually want to
            hear. Choose your crew, enter the Adventure Lands, and learn by
            living the story.
          </p>
        </div>
      </section>

      {/* Characters */}
      <section id="characters" className="py-24 px-6 bg-surface-mid">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="font-heading font-extrabold text-4xl md:text-5xl mb-10">
            Choose Your
            <br />
            Adventure Crew
          </h2>
          <div className="mb-8">
            <span className="inline-block bg-coin-gold text-sandy-gold font-heading font-bold text-xs uppercase tracking-widest px-5 py-2 rounded-full mb-4">
              Starter Crew
            </span>
            <img
              src="/tallyoh-crew.jpg"
              alt="TallyOh Starter Crew"
              className="mx-auto rounded-2xl shadow-lg max-w-[800px] w-full"
              loading="lazy"
            />
          </div>
          <div className="mb-8">
            <span className="inline-block bg-tech-purple/15 text-tech-purple font-heading font-bold text-xs uppercase tracking-widest px-5 py-2 rounded-full mb-4">
              Unlockable Heroes
            </span>
            <img
              src="/tallyoh-crew-unlockable.jpg"
              alt="TallyOh Unlockable Characters"
              className="mx-auto rounded-2xl shadow-lg max-w-[800px] w-full"
              loading="lazy"
            />
          </div>
          <p className="text-slate text-lg font-semibold">
            12 characters. 12 financial lessons. One unforgettable journey.
          </p>
        </div>
      </section>

      {/* Hammy */}
      <section className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-10 bg-white rounded-2xl shadow-[0_4px_32px_rgba(44,62,80,0.05)] overflow-hidden p-8 md:p-12 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-coin-gold to-sandy-gold rounded-full hidden md:block" />
            <img
              src="/hammy-hero.jpg"
              alt="Hammy the Hamster"
              className="w-full md:w-72 rounded-2xl shadow-lg shrink-0 object-cover"
              style={{ maxWidth: 280 }}
              loading="lazy"
            />
            <div className="text-center md:text-left">
              <h2 className="font-heading font-extrabold text-3xl md:text-4xl mb-3">
                Meet Hammy,
                <br />
                The Earner
              </h2>
              <p className="text-slate text-lg leading-relaxed">
                Your guide through TallyOh Kingdom. This cheerful hamster loves
                nothing more than finding creative ways to earn gold coins —
                and he can&apos;t wait to show your kids how.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-surface-low">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="font-heading font-extrabold text-4xl md:text-5xl mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-[900px] mx-auto">
            {[
              {
                n: "1",
                title: "Read Stories",
                desc: "Journey through Adventure Lands with your crew",
                bg: "bg-[#36679c]/10",
                text: "text-[#36679c]",
              },
              {
                n: "2",
                title: "Complete Missions",
                desc: "Real-world challenges set by parents",
                bg: "bg-forest-green/10",
                text: "text-forest-green",
              },
              {
                n: "3",
                title: "Earn Rewards",
                desc: "Coins in-app, real rewards in the Family Store",
                bg: "bg-coin-gold/30",
                text: "text-sandy-gold",
              },
            ].map((step) => (
              <div
                key={step.n}
                className="bg-white rounded-2xl p-8 shadow-[0_4px_32px_rgba(44,62,80,0.05)] hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(44,62,80,0.07)] transition-all"
              >
                <div
                  className={`w-14 h-14 rounded-full ${step.bg} ${step.text} font-heading font-extrabold text-xl flex items-center justify-center mx-auto mb-5`}
                >
                  {step.n}
                </div>
                <h3 className="font-heading font-bold text-xl mb-2">
                  {step.title}
                </h3>
                <p className="text-slate text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Parents */}
      <section id="parents" className="py-24 px-6 bg-surface-mid">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="font-heading font-extrabold text-4xl md:text-5xl mb-3">
            Built for Fun.
            <br />
            Designed for Safety.
          </h2>
          <p className="text-slate text-lg mb-10 max-w-xl mx-auto">
            Everything parents need to feel confident handing over the screen.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-[900px] mx-auto mb-10">
            {[
              {
                title: "Safety First",
                color: "text-[#36679c]",
                items: [
                  "COPPA Compliant",
                  "Zero ads, zero tracking",
                  "PIN-protected parent mode",
                  "Kids Category approved",
                ],
              },
              {
                title: "Parent Controls",
                color: "text-tech-purple",
                items: [
                  "Custom missions",
                  "Family Store rewards",
                  "Progress monitoring",
                  "Audio & content controls",
                ],
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-2xl p-8 shadow-[0_4px_32px_rgba(44,62,80,0.05)]"
              >
                <h3
                  className={`font-heading font-bold text-xl mb-5 ${card.color}`}
                >
                  {card.title}
                </h3>
                <ul className="space-y-3">
                  {card.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-slate text-sm"
                    >
                      <span className="w-5 h-5 rounded-full bg-forest-green flex items-center justify-center shrink-0">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2.5 6l2.5 2.5 4.5-5" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <img
            src="/papercraft-characters-clean.jpg"
            alt="TallyOh papercraft characters"
            className="mx-auto rounded-2xl shadow-lg"
            style={{ maxWidth: 320 }}
            loading="lazy"
          />
        </div>
      </section>

      {/* Our Story */}
      <section id="story" className="py-24 px-6">
        <div className="max-w-[780px] mx-auto text-center bg-white rounded-2xl p-10 shadow-[0_4px_32px_rgba(44,62,80,0.05)]">
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl mb-5">
            Built by Parents Who Couldn&apos;t Find What They Needed
          </h2>
          <p className="text-slate text-lg leading-relaxed">
            Doug and Alexis Kvamme combined storytelling expertise with loyalty
            marketing know-how to build TallyOh for their own kids — Claire
            (6) and Soren (4). What started as bedtime stories about a hamster
            who loves earning coins became a full financial literacy adventure.
          </p>
        </div>
      </section>

      {/* Download CTA */}
      <section id="download" className="py-24 px-6 bg-surface-low">
        <div className="max-w-[1200px] mx-auto text-center">
          <img
            src="/castle-kingdom.png"
            alt="TallyOh Castle Kingdom"
            className="mx-auto mb-8 rounded-2xl shadow-xl"
            style={{ maxWidth: 380 }}
            loading="lazy"
          />
          <h2 className="font-heading font-extrabold text-4xl md:text-5xl mb-5">
            Ready to Enter
            <br />
            the Kingdom?
          </h2>
          <a
            href="#"
            className="inline-flex items-center gap-2.5 bg-navy text-white font-heading font-bold px-10 py-4 rounded-full shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all text-lg mb-5"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Download on the App Store
          </a>
          <p className="text-slate">
            Free to download. No ads. No tracking. Just adventure.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-white/50 py-12 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img
                src="/app-icon-1024.jpg"
                alt="TallyOh"
                className="w-12 h-12 rounded-xl"
              />
              <span className="font-heading font-bold text-white text-xl">
                TallyOh
              </span>
            </div>
            <nav className="flex flex-wrap items-center gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a
                href="mailto:support@tallyohkids.com"
                className="hover:text-white transition-colors"
              >
                Support
              </a>
              <Link
                href="/admin/login"
                className="text-xs text-white/20 hover:text-white/50 transition-colors"
              >
                Admin
              </Link>
            </nav>
          </div>
          <div className="mt-8 text-center text-xs text-white/30">
            &copy; 2026 TallyOh. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
