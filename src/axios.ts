import axios from 'axios'

export interface AnimeInterface {
  filename: String
  episode: Number
  from: Number
  to: Number
  anilist_id: Number
  anime: String
  at: number
  tokenthumb: String
}

export const fetchAnime = (url: String): Promise<any> => {
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
