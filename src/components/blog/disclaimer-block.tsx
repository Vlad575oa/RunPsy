export function DisclaimerBlock({ className = "" }: { className?: string }) {
  return (
    <section className={`rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-6 ${className}`}>
      <h3 className="font-serif text-xl">Важно</h3>
      <p className="mt-3 text-sm leading-8 text-[var(--text-soft)]">
        Материал носит информационный характер и не заменяет психотерапию или медицинскую помощь.
        Если состояние кажется интенсивным, устойчивым или небезопасным, лучше обратиться к профильному специалисту очно.
      </p>
    </section>
  );
}
