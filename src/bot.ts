import dotenv from 'dotenv'
dotenv.config()

import { Telegraf } from 'telegraf'

import ANSVERS from './assets/ansvers.json'
import { fetchAnime, animePreview } from './utils/axios'
import { searchResult } from './utils/markdownAnswer'
import imageParser from './utils/imageParser'

let sessionInfo = null
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => ctx.reply(ANSVERS.start))

bot.help((ctx) => ctx.reply(ANSVERS.help))

bot.on('photo', async (ctx) => {
  try {
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

    if (!anime) {
      ctx.reply('response error')
      return
    }

    sessionInfo = { ...anime }

    const animeImageUrl = await imageParser(anime.anilist_id)

    await ctx.reply('🤔 Most likely it is')

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
  } catch (error) {
    ctx.reply('🚧 Something went wrong. Try later...')
  }
})

bot.action('preview', async (ctx) => {
  try {
    if (sessionInfo) {
      const videoBufer = await animePreview(sessionInfo)

      await ctx.replyWithVideo({ source: videoBufer })
    } else {
      ctx.reply('Error, try again')
    }
  } catch (error) {
    ctx.reply('🚧 Something went wrong. Try later...')
  }
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
