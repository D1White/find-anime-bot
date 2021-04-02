import axios from 'axios'
import { parse } from 'node-html-parser'

const imageParser = async (anilist_id: number): Promise<string> => {
  const page = await axios.get(`https://anilist.co/anime/${anilist_id}`).then((page) => {
    return page.data
  })

  const animePage = parse(page)
  const imageEl = animePage.querySelector('.cover')
  return imageEl.getAttribute('src')
}
// const imageParser = async (anilist_id: number): Promise<string> => {
//   return axios.get(`https://anilist.co/anime/${anilist_id}`).then((page) => {
//     const animePage = parse(page.data)
//     const imageEl = animePage.querySelector('.cover')
//     return imageEl.getAttribute('src')
//   })
// }

export default imageParser
