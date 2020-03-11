//Crie um crawler (aplicação de busca de informação na web) que leia as 3 primeiras notícias do site g1.globo.com
//e organize em um JSON contendo o título, subtitulo (se tiver) e url da imagem de destaque (se tiver).

const axios = require('axios')
const cheerio = require('cheerio')
const url = 'https://g1.globo.com'
const numNoticias = 3

const getNoticias = async (url, numNoticias) => {
  const html = await fetchData(url)
  if (!html) throw Error('Falha ao buscar os dados')

  const noticias = getGloboNoticias(html)
  return noticias.slice(0, numNoticias)
}

const getGloboNoticias = (html) => {
  const $ = cheerio.load(html)
  const statsTable = $('.bastian-feed-item .feed-post-body')
  let noticias = []
  statsTable.each(function() {
      const title = $(this).find('.feed-post-body-title').text()
      const resumo = $(this).find('.feed-post-body-resumo').text()
      const image = $(this).find('.feed-media-wrapper img').attr('src')
      noticias = [...noticias, { title, resumo, image }]
  })
  return noticias
}

const fetchData = async (url) => {
    const response = await axios({url}).catch((err) => console.log(err))

    if (response.status !== 200) return
    return response.data
}

getNoticias(url, numNoticias)
  .then(console.log)
  .catch(console.error)