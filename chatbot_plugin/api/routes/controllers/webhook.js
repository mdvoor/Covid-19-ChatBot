//Searches nhs website for relevant links
const axios = require('axios')
const cheerio = require('cheerio')

module.exports = {

    async search(usrInput){
        try{
            let baseURL = `https://www.nhs.uk/search/results?q=`
            let endURL = `%3F`
            let midURL = `+`
            usrInput = usrInput.toLowerCase().split(' ')
            for(let i of usrInput){
                baseURL += i
                baseURL += midURL
            }
            baseURL += endURL
    
            async function fetchHTML(url){
                const {data}= await axios.get(baseURL)
                return cheerio.load(data)
            }

            const $ = await fetchHTML(baseURL)
            const hrefEnd = $('div > div > ul > li > h2 > a').attr('href')
            if(hrefEnd){
                const url = `https://www.nhs.uk/` + hrefEnd
                return url
            }
            return

        }catch(error){
            throw error
        } 
    }
}
