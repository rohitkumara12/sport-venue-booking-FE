import Link from "next/link";

export function MembershipCTA() {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gray-900 px-6 py-12 text-white sm:px-12">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-400">
            CourtKita Membership
          </p>

          <h2 className="text-3xl font-bold sm:text-4xl">
            Play More, Save More.
          </h2>

          <p className="mt-4 leading-relaxed text-gray-300">
            Get more value from every game with our membership packages.
            Choose a plan that fits your playing schedule and enjoy more
            sessions at your favorite venue.
          </p>

          <Link
            href="/cust-Membership"
            className="mt-8 inline-flex rounded-full bg-green-500 px-7 py-3 font-semibold text-gray-950 transition hover:bg-green-400"
          >
            Explore Membership
          </Link>
        </div>
      </div>
    </section>
  );
}