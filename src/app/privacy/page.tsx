import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Политика приватности | RunPsy",
  description: "Как мы обрабатываем данные и где проходят границы конфиденциальности.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <Link href="/" className="text-sm font-semibold text-[var(--accent-deep)] underline-offset-2 hover:underline">
        ← На главную
      </Link>
      <h1 className="font-serif text-4xl">Политика приватности</h1>
      <p className="mt-4 text-sm leading-7 text-[var(--text-soft)]">Дата вступления в силу: 01.05.2026</p>
      <div className="mt-6 space-y-6 text-sm leading-7 text-[var(--text-soft)]">
        <section>
          <h2 className="font-serif text-2xl text-[var(--text)]">1. Оператор персональных данных</h2>
          <p className="mt-2">
            Оператор: Олейник Владислав Александрович, ИНН 771402421981, email: vlad575@mail.ru, телефон: +7 (926) 317-72-26.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-[var(--text)]">2. Какие данные мы обрабатываем</h2>
          <p className="mt-2">
            Мы можем обрабатывать: имя, email, содержание обращения, технические данные запроса (IP-адрес, дата и время запроса, user-agent), данные о действиях на сайте в объеме, необходимом для безопасности и стабильной работы.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-[var(--text)]">3. Цели и основания обработки</h2>
          <ul className="mt-2 space-y-2">
            <li>• Ответ на обращения через форму контакта.</li>
            <li>• Отправка рассылки при подписке пользователя.</li>
            <li>• Обеспечение защиты сайта от злоупотреблений и автоматического сбора контента.</li>
          </ul>
          <p className="mt-2">
            Основания: согласие пользователя, исполнение пользовательского запроса, а также законный интерес оператора в части обеспечения безопасности и работоспособности сайта.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-[var(--text)]">4. Сроки хранения</h2>
          <p className="mt-2">
            Данные хранятся не дольше, чем это необходимо для целей обработки, либо до отзыва согласия, если иные сроки не предусмотрены законом.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-[var(--text)]">5. Передача третьим лицам</h2>
          <p className="mt-2">
            Мы не продаем персональные данные. Передача возможна только в случаях, прямо предусмотренных законом, либо при использовании технических подрядчиков, необходимых для работы сайта, в пределах цели обработки.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-[var(--text)]">6. Права пользователя</h2>
          <p className="mt-2">
            Пользователь вправе запросить уточнение, блокирование, удаление данных, а также отозвать согласие на обработку, направив запрос на vlad575@mail.ru.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-[var(--text)]">7. Безопасность</h2>
          <p className="mt-2">
            Мы применяем организационные и технические меры защиты, включая ограничение доступа, защитные заголовки, базовую защиту от автоматизированных запросов и логирование событий безопасности.
          </p>
        </section>
      </div>
    </div>
  );
}
