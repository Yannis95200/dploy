export type EraTheme = {
  vars: Record<string, string>;
  intro: string;
  tagline: string;
  ribbon: string;
  price: string;
  phrases: string[];
};

// Art direction per era: poster look (CSS vars), poster copy and ad phrase templates.
// {p} is replaced by the product name.
export const eraThemes: Record<string, EraTheme> = {
  '1500': {
    vars: { '--p-bg': 'linear-gradient(145deg, #f1dfb2, #cfa76a 60%, #a8743a)', '--p-ink': '#3d2210', '--p-font': "'IM Fell English', Georgia, serif", '--p-border': '#e8d9b5', '--p-ribbon-bg': '#7a1f1f', '--p-ribbon-ink': '#f4e4b8', '--p-sun': '#e9c978', '--p-radius': '4px', '--p-transform': 'none', '--p-style': 'italic' },
    intro: 'Oyé, oyé !',
    tagline: 'par décret du roi',
    ribbon: 'Offre de la cour',
    price: '5 écus',
    phrases: [
      "Oyé oyé, chers clients ! {p} en promo à l'étal du magasin, avancez-vous au rayon avant que les stocks ne s'épuisent !",
      "Messires, Mesdames, bienvenue dans votre magasin ! Rendez-vous au rayon pour l'offre du jour : {p} à prix de roi.",
      "Par ordre du maître des lieux : {p} en promotion, à saisir dès maintenant dans les allées du magasin !",
      "Bonnes gens, un conseil du marchand : {p} en promo ce jour. Passez au rayon, vous n'en croirez pas vos yeux !",
    ],
  },
  '1950': {
    vars: { '--p-bg': 'linear-gradient(160deg, #fbe9d0, #f2a98f 55%, #4fa7a0)', '--p-ink': '#3a1d2a', '--p-font': "'Playfair Display', Georgia, serif", '--p-border': '#fff6e6', '--p-ribbon-bg': '#c83e4d', '--p-ribbon-ink': '#fff6e6', '--p-sun': '#ffd9a0', '--p-radius': '10px', '--p-transform': 'none', '--p-style': 'italic' },
    intro: 'Nouveau !',
    tagline: 'le goût du bonheur',
    ribbon: 'Spécial radio !',
    price: '50 F',
    phrases: [
      "Mesdames, Messieurs, votre magasin vous informe : {p} en promotion, rendez-vous au rayon sans tarder !",
      "Chers clients, bonjour ! Ce jour seulement, {p} à prix doux. Une bonne affaire à retrouver dans nos rayons.",
      "Attention, Mesdames : une offre spéciale vous attend au rayon. {p} en promo, pour le plaisir de toute la famille !",
      "Votre magasin a le plaisir de vous annoncer {p} à petit prix. Passez au rayon, c'est la bonne occasion !",
    ],
  },
  '1980': {
    vars: { '--p-bg': 'linear-gradient(160deg, #2a0f4f, #c2288f 55%, #ff9a3d)', '--p-ink': '#fff4d6', '--p-font': "'Bungee', Impact, sans-serif", '--p-border': '#ffeb99', '--p-ribbon-bg': '#16e0d0', '--p-ribbon-ink': '#1b0a3a', '--p-sun': '#ff4fa0', '--p-radius': '0', '--p-transform': 'skewX(-4deg)', '--p-style': 'normal' },
    intro: 'Hey, toi !',
    tagline: 'le son de l’été',
    ribbon: 'Super promo !',
    price: '100 F',
    phrases: [
      "Hey, vous ! Direction le rayon : {p} en promo, un super prix rien que pour les clients du magasin !",
      "Attention, offre flash dans le magasin ! {p} à prix réduit, foncez au rayon avant que ça s'envole !",
      "Clients du magasin, c'est le moment : {p} en promo ! Un tube de la semaine à ne pas rater, au rayon maintenant !",
      "Top promo dans vos allées : {p} à prix mini ! Fouillez le rayon et repartez avec la bonne affaire !",
    ],
  },
  '2000': {
    vars: { '--p-bg': 'linear-gradient(160deg, #0b3d91, #2fa4ff 55%, #e9f6ff)', '--p-ink': '#ffffff', '--p-font': "'Anton', Impact, sans-serif", '--p-border': '#d9ecff', '--p-ribbon-bg': '#ffd400', '--p-ribbon-ink': '#0b2a5c', '--p-sun': '#7fd1ff', '--p-radius': '12px', '--p-transform': 'none', '--p-style': 'normal' },
    intro: 'Que la fête commence !',
    tagline: 'maintenant à la télé',
    ribbon: 'Offre exclusive !',
    price: '5 €',
    phrases: [
      "Attention, chers clients ! Promo exclusive sur {p}, dans votre magasin. Rendez-vous au rayon dès maintenant !",
      "Bonne nouvelle en magasin : {p} en offre limitée. Passez au rayon, le stock est disponible aujourd'hui seulement !",
      "Cher client, c'est le moment de craquer : {p} en promo, à retrouver dans nos rayons jusqu'à épuisement du stock !",
      "Offre spéciale dans votre magasin : {p} à prix réduit. Dépêchez-vous, direction le rayon !",
    ],
  },
  '2020': {
    vars: { '--p-bg': 'linear-gradient(160deg, #f5f3ee, #ffd9cc 55%, #ff7a59)', '--p-ink': '#1a1b1a', '--p-font': "'Space Grotesk', 'DM Sans', sans-serif", '--p-border': '#ffffff', '--p-ribbon-bg': '#1a1b1a', '--p-ribbon-ink': '#ffffff', '--p-sun': '#ffb59f', '--p-radius': '18px', '--p-transform': 'none', '--p-style': 'normal' },
    intro: 'Dans cet épisode,',
    tagline: 'simple, frais, local',
    ribbon: 'Promo du moment',
    price: '1 €',
    phrases: [
      "Bonjour à tous ! Dans votre magasin, {p} est en promo aujourd'hui. Rendez-vous au rayon pour en profiter.",
      "Petite pause dans vos courses : {p} en promotion, juste à côté de vous au rayon. Pensez-y !",
      "Bon plan du jour en magasin : {p} à prix doux. Faites un détour par le rayon, vous allez adorer !",
      "Chers clients, une bonne nouvelle : {p} en promo dans nos rayons. Profitez-en pendant votre passage en magasin !",
    ],
  },
  '2500': {
    vars: { '--p-bg': 'linear-gradient(160deg, #05070f, #1b2a6b 55%, #12d6c5)', '--p-ink': '#d9fffb', '--p-font': "'Orbitron', 'Space Grotesk', sans-serif", '--p-border': '#12d6c5', '--p-ribbon-bg': '#12d6c5', '--p-ribbon-ink': '#05070f', '--p-sun': '#6a5cff', '--p-radius': '6px', '--p-transform': 'none', '--p-style': 'normal' },
    intro: 'Transmission holographique',
    tagline: 'livraison par drone',
    ribbon: 'Promo galactique',
    price: '50 tokens',
    phrases: [
      "Transmission du magasin : {p} en promotion ! Rendez-vous au rayon, le prix est à saisir dès maintenant.",
      "Attention, clients de la galaxie : {p} en promo dans vos allées. Dirigez-vous vers le rayon avant épuisement des stocks !",
      "Alerte promo en magasin : {p} à prix réduit. Activez votre panier et rejoignez le rayon sans attendre !",
      "Citoyens du futur, bienvenue en magasin ! Aujourd'hui, {p} en promotion au rayon. Une affaire intergalactique !",
    ],
  },
};

const fallbackYear = '2020';

export function generatePhrase(product: string, year: string, previous = ''): string {
  const theme = eraThemes[year] ?? eraThemes[fallbackYear];
  const name = product.trim().toLowerCase() || 'ce produit';
  const options = theme.phrases.map((template) => template.replace(/\{p\}/g, name).replace(/^(\W*)([a-zà-ÿ])/, (_, lead: string, letter: string) => lead + letter.toUpperCase()));
  const candidates = options.filter((phrase) => phrase !== previous);
  const pool = candidates.length ? candidates : options;
  return pool[Math.floor(Math.random() * pool.length)].slice(0, 300);
}
