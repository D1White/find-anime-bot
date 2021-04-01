import dotenv from 'dotenv'
dotenv.config()

import { Telegraf } from 'telegraf'
import path from 'path'

import ANSVERS from './assets/ansvers.json'
import { fetchAnime, AnimeInterface, animePreview } from './utils/axios'
import { searchResult } from './utils/markdownAnswer'

let sessionInfo = null
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => ctx.reply(ANSVERS.start))
bot.help((ctx) => ctx.reply(ANSVERS.help))
bot.on('photo', (ctx) => {
  const photos = ctx.message.photo

  bot.telegram.getFileLink(photos[2].file_id).then((data) => {
    ctx.reply('🔎 I start looking...')

    const anime = fetchAnime(data.href)

    anime.then((res: AnimeInterface) => {
      ctx.reply('🤔 Most likely it is')
      console.log(res)
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
  // console.log(sessionInfo)

  if (sessionInfo) {
    animePreview(sessionInfo).then(() => {
      const videoPath = path.resolve(__dirname, 'assets', 'video.mp4')
      ctx.replyWithVideo({ source: videoPath })
    })
  } else {
    ctx.reply('Error')
  }
})

bot.launch()
