import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !(match[1] in process.env)) {
      process.env[match[1]] = match[2];
    }
  }
}

loadEnvLocal();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env"
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleArticles = [
  {
    slug: "casino-bonus-guide",
    title: "How Casino Bonuses Really Work: A Player-Friendly Guide",
    category: "casino",
    label: "CASINO · SEO",
    excerpt:
      "A clear explainer that breaks down common casino bonus mechanics, key terms and the details readers should check before claiming an offer.",
    date: "2026-09-01",
    read: "6 min read",
    featured: true,
    published: true,
    coverImage: "",
    tags: ["Casino", "SEO"],
    content:
      "# How Casino Bonuses Really Work: A Player-Friendly Guide\n\nCasino bonuses look simple on the surface. The useful part is understanding the conditions behind the headline offer.\n\n## Start with the terms, not the headline\n\nA bonus can include a percentage match, free spins, a fixed reward or a mix of several incentives. What matters is not only the size of the offer but also the requirements attached to it.\n\n## Wagering requirements\n\nWagering requirements describe how many times eligible bonus funds, and in some cases qualifying deposits plus bonus funds, may need to be played through before withdrawal. A good explainer should show the calculation rather than assume the reader knows what the number means.\n\n## Check the practical details\n\nReaders should look for minimum deposits, eligible games, maximum bet rules, expiry periods and any restrictions on withdrawals. These details often matter more than the headline figure.\n\n## Write for understanding\n\nFor an affiliate article, clarity is a competitive advantage. A reader should be able to understand the offer, compare it with alternatives and know what to check before clicking through.",
    isSample: true,
  },
  {
    slug: "sportsbook-markets",
    title: "Sports Betting Markets Explained Without the Jargon",
    category: "sportsbook",
    label: "SPORTSBOOK",
    excerpt:
      "A beginner-friendly guide to popular sportsbook markets, how they differ and what a reader should understand before placing a bet.",
    date: "2026-09-03",
    read: "5 min read",
    featured: true,
    published: true,
    coverImage: "",
    tags: ["Sportsbook", "Guides"],
    content:
      "# Sports Betting Markets Explained Without the Jargon\n\nSports betting pages can become difficult to read when every market is described as if the reader already knows the terminology.\n\n## Moneyline and match result\n\nThe simplest market asks which side will win. Depending on the sport, the available selections and whether a draw is possible can change.\n\n## Point spreads and handicaps\n\nSpread markets adjust the starting position so a matchup can be priced around a more balanced line. A useful guide explains the adjusted score in plain language.\n\n## Totals and player markets\n\nTotals focus on whether the combined score lands above or below a listed number. Player markets can include goals, shots, assists or other measurable outcomes depending on the sport.\n\n## The goal of the article\n\nThe strongest betting explainers are scannable. Define the market, give one simple example and make the next step obvious.",
    isSample: true,
  },
  {
    slug: "payments-online-casino",
    title:
      "What Players Should Know Before Choosing an Online Casino Payment Method",
    category: "fintech",
    label: "CASINO · FINTECH",
    excerpt:
      "An editorial guide to deposit and withdrawal considerations, processing times, fees and practical safety checks.",
    date: "2026-09-05",
    read: "5 min read",
    featured: true,
    published: true,
    coverImage: "",
    tags: ["Casino", "Fintech", "Payments"],
    content:
      "# What Players Should Know Before Choosing an Online Casino Payment Method\n\nPayment content is most useful when it answers the questions a player actually has before making a deposit or withdrawal.\n\n## Deposit options\n\nPayment methods can differ in availability, processing speed, fees, minimums and supported currencies. A comparison should make those differences easy to scan.\n\n## Withdrawals are a separate question\n\nA method that is convenient for deposits may not be available for withdrawals. Readers should check the full cash-out path rather than only the deposit experience.\n\n## Security and verification\n\nGood content should explain identity checks, transaction limits and why operators may ask for additional information without making promises that cannot be supported.\n\n## The reader-first approach\n\nThe best payment explainers reduce uncertainty. They tell readers what to expect, which details to compare and where the operator’s own terms still matter.",
    isSample: true,
  },
  {
    slug: "seo-landing-pages",
    title: "What Makes an iGaming Landing Page Search-Friendly?",
    category: "seo",
    label: "SEO · AFFILIATE",
    excerpt:
      "A practical look at search intent, structure, internal links, metadata and conversion elements that work together on affiliate pages.",
    date: "2026-09-07",
    read: "7 min read",
    featured: false,
    published: true,
    coverImage: "",
    tags: ["SEO", "Affiliate"],
    content:
      "# What Makes an iGaming Landing Page Search-Friendly?\n\nSEO copy is not only about keywords. It is about matching intent, making the page easy to understand and helping a reader reach the information they need.\n\n## Start with search intent\n\nIdentify what the query is asking for and make the page deliver that answer quickly. A strong match between intent and content reduces friction.\n\n## Structure for humans\n\nClear headings, concise paragraphs, tables, internal links and useful summaries help both readers and search crawlers understand the page.\n\n## Make metadata earn the click\n\nTitles and meta descriptions should accurately describe the page while giving the reader a reason to open it.\n\n## Keep the commercial layer natural\n\nAffiliate calls to action work best when they sit next to useful information rather than interrupting it.",
    isSample: true,
  },
  {
    slug: "casino-games",
    title: "Casino Games Explained: Slots, Table Games and Live Casino",
    category: "casino",
    label: "CASINO",
    excerpt:
      "A reader-first overview of popular casino game types, useful terminology and what makes each category different.",
    date: "2026-09-09",
    read: "5 min read",
    featured: false,
    published: true,
    coverImage: "",
    tags: ["Casino", "Games"],
    content:
      "# Casino Games Explained: Slots, Table Games and Live Casino\n\nA casino content page should explain the games without making readers feel like they need a glossary before they can start.\n\n## Slots\n\nSlots are built around reels, symbols and paylines or ways to win. Modern games can add bonus rounds, multipliers and other mechanics.\n\n## Table games\n\nRoulette, blackjack, baccarat and other table games use different rules and betting structures. A good guide compares them without overcomplicating the explanation.\n\n## Live casino\n\nLive dealer games combine a digital interface with a streamed table and human dealer. Readers usually want practical information about rules, limits and table formats.\n\n## Make the comparison useful\n\nUse short definitions, examples and clear headings so readers can find a game category that matches what they are looking for.",
    isSample: true,
  },
  {
    slug: "betting-guide-structure",
    title: "The Anatomy of a Useful Sports Betting Guide",
    category: "sportsbook",
    label: "SPORTSBOOK · SEO",
    excerpt:
      "How to structure betting content so readers can scan quickly, understand the market and find the information they actually came for.",
    date: "2026-09-11",
    read: "6 min read",
    featured: false,
    published: true,
    coverImage: "",
    tags: ["Sportsbook", "SEO"],
    content:
      "# The Anatomy of a Useful Sports Betting Guide\n\nA good betting guide lets the reader understand the market, the context and the next action without wading through filler.\n\n## Lead with the answer\n\nStart with the key definition or market explanation, then expand. The first screen should tell the reader they are in the right place.\n\n## Use predictable structure\n\nContext, market explanation, examples, key terms and a short FAQ section give readers a clear path through the article.\n\n## Keep examples simple\n\nOne strong example is usually more useful than five complicated ones. The goal is understanding, not volume.\n\n## Finish with a useful next step\n\nThe CTA should follow naturally from the article and make sense for the reader’s intent.",
    isSample: true,
  },
];

async function main() {
  const { error } = await supabase
    .from("Article")
    .upsert(sampleArticles, { onConflict: "slug" });

  if (error) {
    throw new Error(error.message);
  }

  console.log(`Seeded ${sampleArticles.length} sample articles.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
