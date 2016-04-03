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
                    let $ = cheerio.load(res.text);
                    let results = $('.item');
                    let parsedResults = [];
                    for(let i = 0; i < results.length; i++) {
                        let item = $(results[i]);
                        let aElement = item.find($('a'));
                        parsedResults.push({
                            name: aElement.find($('.itemtext')).text(),
                            artist: aElement.find($('.itemsubtext')).text(),
                            image: _getAlbumImage(aElement.find($('.tralbum-art-container')).attr('onclick')),
                            url: aElement.attr('href')
                        });
                    }
                    resolve(parsedResults);
                });
                
        });
    }
};

module.exports = BandcampParser;