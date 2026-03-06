import Hero from "./components/hero/Hero"
import TeamServer from "./components/team/TeamServer"
import Games from "./components/games/GamesServer"
import NewsServer from "./components/news/NewsServer"

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'
export default function Home() {
  return (
    <>
      <Hero />
      <TeamServer />
      <Games />
      <NewsServer />
    </>
  );
}
