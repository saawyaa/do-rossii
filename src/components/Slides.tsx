import { memo } from "react";
import { ArchivalCard } from "./ArchivalCard";
import { Map } from "./Map";
import { locations } from "../data/locations";
const Label = () => (
  <div className="reconstruction reveal">ХУДОЖЕСТВЕННАЯ РЕКОНСТРУКЦИЯ</div>
);
const Background = ({ name }: { name: string }) => (
  <>
    <img
      className="scene-bg"
      src={`/assets/${name}.webp`}
      alt=""
      draggable={false}
    />
    <div className="shade" />
  </>
);
export const SlideContent = memo(function SlideContent({
  index,
}: {
  index: number;
}) {
  switch (index) {
    case 0:
      return (
        <>
          <Background name="hero" />
          <div className="hero-copy">
            <h1 className="reveal">ДО РОССИИ</h1>
            <p className="hero-sub reveal">
              Первобытные люди и их стоянки
              <br />
              на территории современной России
            </p>
          </div>
          <div id="opening-year">
            <strong>≈ 2 000 000</strong>
            <span>лет человеческого присутствия</span>
          </div>
          <Label />
          <p className="hero-source reveal">
            Отправная точка хронологии: Кермек
            <br />
            2,1–1,8 млн лет назад · ИИМК РАН
          </p>
        </>
      );
    case 1:
      return (
        <>
          <div className="map-copy">
            <h1 className="reveal">
              ОДНА
              <br />
              ТЕРРИТОРИЯ.
              <br />
              МИЛЛИОНЫ
              <br />
              ЛЕТ.
            </h1>
            <p className="reveal">
              Четыре памятника — четыре точки нашего маршрута через первобытную
              историю.
            </p>
          </div>
          <Map />
          <div className="timeline">
            {locations.map((p, i) => (
              <div className="time-item reveal" key={p.id}>
                <span className="time-index">0{i + 1}</span>
                <h2>{p.name}</h2>
                <strong>{p.date}</strong>
                <span>{p.period}</span>
              </div>
            ))}
          </div>
        </>
      );
    case 2:
      return (
        <>
          <Background name="kermek" />
          <div className="site-copy">
            <p className="region reveal">ТАМАНСКИЙ ПОЛУОСТРОВ</p>
            <h1 className="reveal">КЕРМЕК</h1>
            <p className="date reveal">2,1–1,8 млн лет назад</p>
            <p className="thesis reveal">
              Одна из древнейших известных стоянок человека в Западной Евразии
              за пределами Кавказа.
            </p>
            <p className="detail reveal">
              Пляжевая зона древнего опреснённого морского залива или эстуария.
            </p>
          </div>
          <ArchivalCard sourceKey="kermek" className="kermek-card" />
          <Label />
        </>
      );
    case 3:
      return (
        <>
          <div className="denisova-window">
            <Background name="denisova" />
          </div>
          <div className="site-copy denisova-copy">
            <h1 className="reveal">
              ДЕНИСОВА
              <br />
              ПЕЩЕРА
            </h1>
            <p className="region reveal">АЛТАЙ</p>
            <p className="date reveal">≈300 000 лет истории в слоях</p>
          </div>
          <p className="layer-thesis reveal">
            Археология здесь
            <br />
            буквально читается слоями.
          </p>
          <aside className="museum-column">
            <ArchivalCard sourceKey="cave" />
            <ArchivalCard sourceKey="strata" />
            <ArchivalCard sourceKey="denisova" />
          </aside>
          <Label />
        </>
      );
    case 4:
      return (
        <>
          <Background name="kostenki" />
          <div className="site-copy kostenki-copy">
            <h1 className="reveal">КОСТЁНКИ</h1>
            <p className="region reveal">СРЕДНИЙ ДОН</p>
            <p className="date reveal">≈42–45 тыс. лет назад</p>
            <p className="period reveal">Ранний верхний палеолит</p>
            <p className="thesis reveal">
              Не только каменные орудия —<br />
              кость, украшения и первые
              <br />
              формы искусства.
            </p>
          </div>
          <div className="kostenki-cards">
            <ArchivalCard sourceKey="lithics" />
            <ArchivalCard sourceKey="bone" />
          </div>
          <p className="chronology-note reveal">
            Костёнковская группа в целом: ≈42–20 тыс. лет.
            <br />
            Здесь показан её древнейший этап.
          </p>
          <Label />
        </>
      );
    case 5:
      return (
        <>
          <Background name="sungir" />
          <div className="site-copy sungir-copy">
            <h1 className="reveal">СУНГИРЬ</h1>
            <p className="region reveal">ПОД ВЛАДИМИРОМ</p>
            <p className="date reveal">≈30 000 лет назад</p>
            <div className="beads reveal">
              <strong>3500+</strong>
              <span>бус из бивня</span>
              <small>в погребении взрослого мужчины</small>
            </div>
            <p className="sungir-thesis reveal">
              Первобытный человек создавал
              <br />
              не только орудия.
              <br />
              <em>Он создавал символы.</em>
            </p>
          </div>
          <ArchivalCard
            sourceKey="burial"
            className="burial-card"
            id="s06-burial"
          />
          <div className="artifact-strip">
            <ArchivalCard sourceKey="clothing" />
            <ArchivalCard sourceKey="spears" />
            <ArchivalCard sourceKey="figurine" />
          </div>
          <Label />
        </>
      );
    case 6:
      return (
        <>
          <Map final />
          <div className="final-copy">
            <h1 className="reveal">
              ИСТОРИЯ НАЧИНАЕТСЯ
              <br />
              РАНЬШЕ ГОСУДАРСТВ
            </h1>
            <p className="final-thesis reveal">
              На территории современной России люди жили
              <br />
              за сотни тысяч лет до появления первых государств.
            </p>
            <p className="sites-list reveal">
              Кермек · Денисова пещера · Костёнки · Сунгирь
            </p>
            <p className="final-summary reveal">
              Стоянки позволяют восстановить технологии, среду, быт,
              <br />
              миграции, искусство и представления о мире.
            </p>
          </div>
          <p className="callback reveal">
            <span>≈ 2 000 000 лет</span>{" "}
            <span className="callback-tail">→ 7 экранов</span>
          </p>
        </>
      );
    default:
      return null;
  }
});
