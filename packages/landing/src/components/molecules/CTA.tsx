import Link from 'next/link';
import type { FC } from 'react';

const CTA: FC = () => (
  <section className="border-base-content/10 bg-base-100 border-t">
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-5 py-20 text-center">
      <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        Still can&apos;t decide?
      </h2>
      <p className="text-base-content/60 mt-3 max-w-xl text-base">
        Let fate pick tonight&apos;s meal — it takes less time than scrolling
        delivery apps.
      </p>
      <Link href="/foods/wheel/" className="btn btn-accent btn-lg mt-8">
        Spin the wheel
      </Link>
    </div>
  </section>
);

export default CTA;
