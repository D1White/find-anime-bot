import { toHHMMSS } from './timeConverter'
import { AnimeInterface } from './axios'

const escapedMsg = (value: string): string => {
  return value
    .replace('_', '\\_')
    .replace('*', '\\*')
    .replace('[', '\\[')
    .replace('`', '\\`')
    .replace('-', '\\-')
}

export const searchResult = (anime: AnimeInterface): string => {
  return `
*${escapedMsg(anime.title_english)}*
_original title:_ ${anime.title}
_episode:_ ${anime.episode}
_at:_ ${toHHMMSS(anime.at)}
`
}
