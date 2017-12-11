var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
const wallpaper = require('wallpaper');
var http = require('http');

function intervalWpChange(images) {
    setInterval(() => {
        wallpaper.set(images[Math.floor(Math.random()*images.length)]).then(() => {
            console.log('Wallpaper changed.');
        });
    }, 10000);
}

request({
    url: `https://<profilename>.tumblr.com`
}, (error, response, body) => {
    var images = [], i = 0;
    var $ = cheerio.load(body);

    $('a[data-featherlight="image"] > div > img').each(function(i, elem) {
        var fileName = $(elem).attr('src').split('/').pop();
        var file = fs.createWriteStream('./uploads/'+fileName);
        images.push('./uploads/'+fileName);
        
        var request = http.get($(elem).attr('src'), function(response) {
            response.pipe(file);
        });
    });

    intervalWpChange(images);
})