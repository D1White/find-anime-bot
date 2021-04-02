import dotenv from 'dotenv'
dotenv.config()

import { Telegraf } from 'telegraf'
import path from 'path'
import fs from 'fs'

import ANSVERS from './assets/ansvers.json'
import { fetchAnime, AnimeInterface, animePreview } from './utils/axios'
import { searchResult } from './utils/markdownAnswer'
import imageParser from './utils/imageParser'

let sessionInfo = null
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => ctx.reply(ANSVERS.start))
bot.help((ctx) => ctx.reply(ANSVERS.help))
bot.on('photo', async (ctx) => {
  const photos = ctx.message.photo

  if (!photos) {
    ctx.reply('photo error')
    return
  }

  const userImageHref = await bot.telegram
    .getFileLink(photos[photos.length - 1].file_id)
    .then((data) => data.href)

  await ctx.reply('🔎 I start looking...')

  const anime = await fetchAnime(userImageHref)

  await ctx.reply('🤔 Most likely it is')

  if (!anime) {
    ctx.reply('response error')
    return
  }

  sessionInfo = { ...anime }

  const animeImageUrl = await imageParser(anime.anilist_id)

  await ctx.replyWithPhoto({
    url: animeImageUrl,
    filename: `${anime.title_english}.png`,
  })

  await ctx.replyWithMarkdownV2(searchResult(anime), {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'AniList', url: `https://anilist.co/anime/${anime.anilist_id}` }],
        [{ text: 'Get preview', callback_data: 'preview' }],
      ],
    },
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

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
