import dotenv from 'dotenv'
dotenv.config()

import { Telegraf, Telegram } from 'telegraf'
import ANSVERS from './ansvers.json'

const bot = new Telegraf(process.env.BOT_TOKEN)
const telegram = new Telegram(process.env.BOT_TOKEN)

bot.start((ctx) => ctx.reply(ANSVERS.start))
bot.help((ctx) => ctx.reply(ANSVERS.help))
bot.on('photo', (ctx) => {
  // console.log(ctx.update.message.photo)
  // console.log(ctx.message.photo)
  const photos = ctx.message.photo

  telegram.getFileLink(photos[0].file_id).then((data) => {
    console.log(data)
  })

  ctx.reply('Принято')
})

bot.launch()
