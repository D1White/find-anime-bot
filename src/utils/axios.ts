import axios from 'axios'

export interface AnimeInterface {
  filename: string
  episode: number
  from: number
  to: number
  anilist_id: number
  anime: string
  at: number
  tokenthumb: string
}

export const fetchAnime = (url: string): Promise<any> => {
  return axios
    .get(`https://trace.moe/api/search?url=${url}`)
    .then((res) => {
      if (res.data.docs) {
        return res.data.docs[0]
      } else {
        throw 'Error'
      }
    })
    .catch((_) => {
      return false
    })
}
