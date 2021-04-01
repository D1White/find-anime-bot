import axios from 'axios'

import fs from 'fs'
import { URL } from 'node:url'
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
  title: string
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

      const videoPath = path.resolve(__dirname, '../assets', `${sessionInfo.tokenthumb}.mp4`)
      res.data.pipe(fs.createWriteStream(videoPath))
      console.log('Video saved')
    })
}

export const animePreviewTest = (sessionInfo: AnimeInterface): Promise<any> => {
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
      return res.data

      // const videoPath = path.resolve(__dirname, '../assets', 'video.mp4')
      // res.data.pipe(fs.createWriteStream(videoPath))
      // console.log('Vide saved')
    })
}
