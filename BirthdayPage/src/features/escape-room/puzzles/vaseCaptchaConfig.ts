export type VaseCaptchaTile = {
  alt: string;
  id: string;
  imageSrc?: string;
};

// Keep the original seven correct images and their IDs. The nine decoys use
// optimized local copies of the user's photos.
export const vaseCaptchaTiles: readonly VaseCaptchaTile[] = [
  {
    alt: "Mørk, mønstret beholder med grønne blader",
    id: "tile-01",
    imageSrc: "/images/puzzles/vases/img-4110.webp",
  },
  {
    alt: "Målekanne i plast",
    id: "tile-02",
    imageSrc:
      "https://images.finncdn.no/dynamic/1600w/item/474760182/fe3a0f71-000f-403e-881a-72d0c28dbcdc",
  },
  {
    alt: "Høy, hvit beholder med grønne blader",
    id: "tile-03",
    imageSrc: "/images/puzzles/vases/img-4111.webp",
  },
  {
    alt: "Glassflaske med bøylekork",
    id: "tile-04",
    imageSrc:
      "https://images.clasohlson.com/medias/sys_master/he0/h53/68868620255262.jpg",
  },
  {
    alt: "Hvit beholder bak lange, smale blader",
    id: "tile-05",
    imageSrc: "/images/puzzles/vases/img-4112.webp",
  },
  {
    alt: "Gjennomsiktig målekanne med blå skala",
    id: "tile-06",
    imageSrc:
      "https://res.cloudinary.com/lusini/w_1500,h_1500,q_80,c_pad,f_auto/pim/b31753/729aa7/6d9d9a/c2becd/7024bc/6a/b31753729aa76d9d9ac2becd7024bc6a.jpeg",
  },
  {
    alt: "Grå beholder med jord og plantestøtter",
    id: "tile-07",
    imageSrc: "/images/puzzles/vases/img-4113.webp",
  },
  {
    alt: "Tom, svart beholder i vinduskarmen",
    id: "tile-08",
    imageSrc: "/images/puzzles/vases/img-4114.webp",
  },
  {
    alt: "Målekanne i glass med håndtak",
    id: "tile-09",
    imageSrc: "https://image-ikea.mncdn.com/urunler/2000_2000/PE608339.jpg",
  },
  {
    alt: "Lys beholder med brede blader og synlige røtter",
    id: "tile-10",
    imageSrc: "/images/puzzles/vases/img-4117.webp",
  },
  {
    alt: "Målekanne i metall",
    id: "tile-11",
    imageSrc:
      "https://www.ikea.com/fi/fi/images/products/idealisk-kannu-mitta-asteikko-ruostumaton-teraes__0935178_pe792662_s5.jpg",
  },
  {
    alt: "Flettet beholder med kaktus",
    id: "tile-12",
    imageSrc: "/images/puzzles/vases/img-4118.webp",
  },
  {
    alt: "Lys, mønstret beholder i vinduskarmen",
    id: "tile-13",
    imageSrc: "/images/puzzles/vases/img-4119.webp",
  },
  {
    alt: "Liten glassflaske med kork",
    id: "tile-14",
    imageSrc:
      "https://static.islas.ikea.es/assets/images/427/0442702_PE593897_S5.webp",
  },
  {
    alt: "Glasskrukke med metallokk",
    id: "tile-15",
    imageSrc: "/images/puzzles/vases/img-4120.webp",
  },
  {
    alt: "Karaffel i mønstret glass",
    id: "tile-16",
    imageSrc: "https://image-ikea.mncdn.com/urunler/2000_2000/PE958887.jpg",
  },
];

// The joke: only the original bottles, measuring jugs, and carafe count as "vaser".
export const correctVaseTileIds: readonly string[] = [
  "tile-02",
  "tile-04",
  "tile-06",
  "tile-09",
  "tile-11",
  "tile-14",
  "tile-16",
];
