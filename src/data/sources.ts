export type Source = {
  title: string;
  image: string;
  author: string;
  license: string;
  url: string;
  label?: string;
  note?: string;
};
const commons = (name: string) =>
  `https://commons.wikimedia.org/wiki/File:${name}`;
const kostenki =
  "https://www.old.archeo.ru/struktura-1/otdel-paleolita/pdf/Sinitzun_Hoffecker_Bessudnov_2004.pdf/at_download/file";
export const sources: Record<string, Source> = {
  kermek: {
    title: "Каменная индустрия Кермека",
    image: "kermek-tools.webp",
    author: "В. Е. Щелинский · ИИМК РАН, 2025 · рис. 6",
    license: "Свободная лицензия не указана",
    url: "https://www.old.archeo.ru/izdaniya-1/pazhmi-pajis/issues/pdf/02Shchelinsky.pdf",
    note: "В презентации сохранён диапазон 2,1–1,8 млн лет из ТЗ. Публикация 2025 года уточняет датировку: 2,1–2,0 млн лет.",
  },
  cave: {
    title: "Денисова пещера сегодня",
    image: "cave-real.webp",
    author: "Александр Байдуков / Wikimedia Commons",
    license: "CC BY-SA 4.0",
    url: commons("Black_Anui_of_Ust-Kansky_district._Denisova_cave.jpg"),
  },
  strata: {
    title: "Научный профиль Южной камеры",
    image: "stratigraphy.webp",
    author: "Jacobs et al. · Nature Communications 16, 4738 (2025) · Fig. 2",
    license: "CC BY 4.0",
    url: "https://www.nature.com/articles/s41467-025-60140-6",
  },
  denisova: {
    title: "Каменные и костяные находки",
    image: "denisova-artifacts.webp",
    author: "Thilo Parg / Wikimedia Commons",
    license: "CC BY-SA 4.0",
    url: commons("Denisova_Cave_lithic_and_osseous_artifacts.jpg"),
  },
  lithics: {
    title: "Кремневый инвентарь",
    image: "lithics.webp",
    author: "Синицын, Хоффекер, Бессуднов · ИИМК РАН, 2004 · рис. 13",
    license: "Свободная лицензия не указана",
    label: "КОСТЁНКИ-14 · СЛОЙ IVБ",
    url: kostenki,
  },
  bone: {
    title: "Кость · украшения · искусство",
    image: "bone-art.webp",
    author: "Синицын, Хоффекер, Бессуднов · ИИМК РАН, 2004 · рис. 14",
    license: "Свободная лицензия не указана",
    label: "КОСТЁНКИ-14 · СЛОЙ IVБ",
    url: kostenki,
  },
  burial: {
    title: "Модель двойного погребения",
    image: "burial.webp",
    author: "Лапоть / Wikimedia Commons · «Палаты», Владимир",
    license: "CC0",
    label: "МУЗЕЙНАЯ МОДЕЛЬ · СУНГИРЬ-2 И 3",
    url: commons("Twin_burial_model_-_Sungir_-_Vladimir_Palaty.jpg"),
  },
  clothing: {
    title: "Одежда",
    image: "clothing.webp",
    author: "Лапоть / Wikimedia Commons",
    license: "CC0",
    label: "МУЗЕЙНАЯ РЕКОНСТРУКЦИЯ",
    url: commons("Clothes_3_-_Sungir_-_Vladimir_Palaty.jpg"),
  },
  spears: {
    title: "Оружие",
    image: "spears.webp",
    author: "Лапоть / Wikimedia Commons",
    license: "CC0",
    label: "КОПЬЯ ИЗ БИВНЯ МАМОНТА",
    url: commons("Spears_1_-_Sungir_-_Vladimir_Palaty.jpg"),
  },
  figurine: {
    title: "Символ",
    image: "figurine.webp",
    author: "Лапоть / Wikimedia Commons",
    license: "CC0",
    label: "ФИГУРКА ЛОШАДИ / САЙГИ",
    url: commons("Figurine_-_Sungir_-_Vladimir_Palaty.jpg"),
  },
};
