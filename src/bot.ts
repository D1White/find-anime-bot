import dotenv from 'dotenv'
dotenv.config()

import { Telegraf } from 'telegraf'
import path from 'path'
import fs from 'fs'

import ANSVERS from './assets/ansvers.json'
import { fetchAnime, AnimeInterface, animePreview, animePreviewTest } from './utils/axios'
import { searchResult } from './utils/markdownAnswer'

let sessionInfo = null
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => ctx.reply(ANSVERS.start))
bot.help((ctx) => ctx.reply(ANSVERS.help))
bot.on('photo', (ctx) => {
  const photos = ctx.message.photo

  if (!photos) {
    ctx.reply('photo error')
    return
  }

  bot.telegram.getFileLink(photos[photos.length - 1].file_id).then((data) => {
    ctx.reply('🔎 I start looking...')

    const anime = fetchAnime(data.href)

    anime.then((res: AnimeInterface) => {
      ctx.reply('🤔 Most likely it is')
      console.log(res)

      if (!res) {
        ctx.reply('response error')
        return
      }

      sessionInfo = { ...res }

      ctx.replyWithMarkdownV2(searchResult(res), {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'AniList', url: `https://anilist.co/anime/${res.anilist_id}` }],
            [{ text: 'Get preview', callback_data: 'preview' }],
          ],
        },
      })
    })
  })
})

bot.action('preview', (ctx) => {
  if (sessionInfo) {
    animePreview(sessionInfo).then(() => {
      const videoPath = path.resolve(__dirname, 'assets', `${sessionInfo.tokenthumb}.mp4`)
      console.log(videoPath)

      // ctx.replyWithVideo({ source: videoPath }).then(() => {
      //   // fs.unlink(videoPath, (err) => {
      //   //   if (err) {
      //   //     console.error(err)
      //   //     return
      //   //   }
      //   //   console.log('Video removed')
      //   // })
      //   console.log('Video uploaded')
      // })

      ctx.telegram.sendVideo(ctx.chat.id, { source: videoPath }).then(() => {
        console.log('Video uploaded')
      })
    })
  } else {
    ctx.reply('Error, try again')
  }
})

bot.command('/p', (ctx) => {
  const ss = {
    filename: '[Ohys-Raws] One-Punch Man - 02 (TX 1280x720 x264 AAC).mp4',
    at: 496.16499999999996,
    tokenthumb: 'ZHp0M4HfwoDadWMwzRL30CRIvw',
    anilist_id: 21087,
    episode: 2,
    from: 0,
    to: 0,
    anime: 'string',
    title_english: 'string',
    title: 'string',
  }

  animePreviewTest(ss).then((video) => {
    const videoPath = path.resolve(__dirname, 'assets', 'video.mp4')
    // ctx.replyWithVideo({ source: fs.createReadStream(video.pipe(fs.createWriteStream(videoPath))) })
    ctx.replyWithVideo({ source: fs.createReadStream(video) })
  })
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
