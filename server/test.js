var http = require('http'),
  qs = require('querystring');

var data = {
  url: 'http://detail.taobao.com/meal_detail.htm?spm=a1z10.4.w3-18215909519.5.Bp6TLx&meal_id=34088312&item_num_id=23852204310'
};
data = qs.stringify(data);
var req = http.request({
  host: 'www.mogujie.com',
  path: '/twitter/goodsinfo',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': data.length,
    'Cookie': '__ud_=117fyqg; __mogujie=c%2FTBIkPCcYHKYfKK87X2Khz9ZFMzfHQmKQJGrziyN21LXVYyq70lDo8C341eGbWB9VaJ9NFWjpJdKr3MJUUcyA%3D%3D; __pk_=OALpe3nB3gYaqZngRv%2FOZgPhhdl6G8XUNzkG%2B3rmkgRMfw; __mgjuuid=98b0822e-b005-7199-dd99-b8530b29be48'
  }
}, function(res) {
  res.setEncoding('utf8');
  var result = '';
  res.on('end', function() {
    result = JSON.parse(result);
    console.log(result);
  });
  res.on('readable', function() {
    result += res.read();
  });
});
req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});
req.write(data);
req.end();