import axios from 'axios'

import fs from 'fs'
import path from 'path'

export interface AnimeInterface {
  filename: string
  episode: number
  from: number
  to: number
  anilist_id: number
  anime: string
  at: number
  tokenthumb: string
  title_english: string
}

export interface SessionInfoInteface {
  filename: string
  tokenthumb: string
  at: number
  anilist_id: number
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

export const animePreview = (sessionInfo: AnimeInterface): Promise<any> => {
  return axios
    .get(
      `https://media.trace.moe/video/${sessionInfo.anilist_id}/${encodeURIComponent(
        sessionInfo.filename
      )}?t=${sessionInfo.at}&token=${sessionInfo.tokenthumb}&size=l`,
      { responseType: 'stream' }
    )
    .then((res) => {
      if (!res.data) {
        console.log('Error')
      }

      const videoPath = path.resolve(__dirname, '../assets', 'video.mp4')
      // fs.unlink(videoPath, (err) => {
      //   if (err) {
      //     console.log(err)
      //     return
      //   }
      // })
      res.data.pipe(fs.createWriteStream(videoPath))
      console.log('Vide saved')
    })
}
