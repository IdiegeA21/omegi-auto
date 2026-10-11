/** Big figures computed from real data. Never hard-coded numbers. */
export default function StatStrip({ stats }: { stats: { value: string | number; label: string }[] }) {
  return (
    <dl className="grid grid-cols-3 gap-3 md:gap-5">
      {stats.map((s) => (
        <div key={s.label} className="rounded-3xl bg-paper p-4 md:p-6">
          <dd className="t-fig text-[2.6rem] text-omegi md:text-[4.5rem]">{s.value}</dd>
          <dt className="mt-1 text-[12.5px] font-semibold text-mute md:text-[14px]">{s.label}</dt>
        </div>
      ))}
    </dl>
  );
}
