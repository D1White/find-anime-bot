import { toHHMMSS } from './timeConverter'
import { AnimeInterface } from './axios'

export const searchResult = (anime: AnimeInterface): string => {
  return `
*${anime.anime}*
_episode:_ ${anime.episode}
_at:_ ${toHHMMSS(anime.at)}
`
}
