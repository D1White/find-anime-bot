import { toHHMMSS } from './utils/timeConverter'
import { AnimeInterface } from './axios'

export const searchResult = (anime: AnimeInterface): string => {
  return `
*${anime.anime}*
_episode:_ ${anime.episode}
_at:_ ${toHHMMSS(anime.at)}

`
}
// _AniList:_ https://anilist.co/anime/${anime.anilist_id}
