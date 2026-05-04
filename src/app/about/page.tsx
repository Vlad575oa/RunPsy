const positioning = {
  promise: "RunPsy — это проект о том, как строить отношения с собой и другими, опираясь на понимание работы мозга. Мы переводим нейробиологию и доказательную психологию на понятный язык.",
  trustSignals: [
    "Опираемся на научные исследования",
    "Не даем пустых обещаний и волшебных таблеток",
    "Говорим о сложном просто и без воды",
  ],
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <h1 className="font-serif text-4xl">О проекте</h1>
      <p className="mt-4 text-sm leading-7 text-[var(--text-soft)]">{positioning.promise}</p>
      <div className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-6">
        <h2 className="font-serif text-2xl">Как мы работаем</h2>
        <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--text-soft)]">
          {positioning.trustSignals.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
