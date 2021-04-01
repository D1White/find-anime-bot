import dotenv from 'dotenv'
dotenv.config()

import { Telegraf } from 'telegraf'

import ANSVERS from './ansvers.json'
import { fetchAnime, AnimeInterface } from './axios'
import { searchResult } from './markdownAnswer'

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => ctx.reply(ANSVERS.start))
bot.help((ctx) => ctx.reply(ANSVERS.help))
bot.on('photo', (ctx) => {
  const photos = ctx.message.photo

  bot.telegram.getFileLink(photos[0].file_id).then((data) => {
    ctx.reply('🔎 I start looking...')
    const anime = fetchAnime(data.href)
    anime.then((res: AnimeInterface) => {
      ctx.reply('🤔 Most likely it is')
      console.log(res)
      ctx.replyWithMarkdownV2(searchResult(res), {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'AniList', url: `https://anilist.co/anime/${res.anilist_id}` }],
            [{ text: 'Visualisation', callback_data: 'visualisation' }],
          ],
        },
      })
    })
  })
})

bot.launch()
