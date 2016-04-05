const cheerio = require('cheerio');
const superagent = require('superagent');

let _getAlbumImage = function(clickText) {
  return clickText.slice(12, -2);
};

let BandcampParser = {
  getAlbumsByTag: function(tag, page) {
    return new Promise(function(resolve, reject) {

      let url = 'https://bandcamp.com/tag/' + tag + '?sort_field=date';

      if(page) {
        url += '&page=' + page;
      }

      superagent.get(url)
        .end(function(err, res){
          const $ = cheerio.load(res.text);
          const results = $('.item');
          let parsedResults = [];
          for(let i = 0; i < results.length; i++) {
            const item = $(results[i]);
            const linkElement = item.find($('a'));
            parsedResults.push({
              name: linkElement.find($('.itemtext')).text(),
              artist: linkElement.find($('.itemsubtext')).text(),
              image: _getAlbumImage(linkElement.find($('.tralbum-art-container')).attr('onclick')),
              url: linkElement.attr('href')
            });
          }
          resolve(parsedResults);
        });
        
    });
  }
};

module.exports = BandcampParser;