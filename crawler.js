//npm install axios@0.21.1 cheerio@1.0.0-rc.9 puppeteer@9.1.1 lodash@4.17.20 date-fns@2.21.1 date-fns-tz@1.1.4
const axios = require('axios');
const cheerio = require('cheerio');

// async function main() {
//   // ❶ HTML 로드하기
//   const resp = await axios.get(
//     'https://yjiq150.github.io/coronaboard-crawling-sample/dom'
//   );

//   const $ = cheerio.load(resp.data); // ❷ HTML을 파싱하고 DOM 생성하기
//   const elements = $('.slide p');    // ❸ CSS 셀렉터로 원하는 요소 찾기
//   // ➍ 찾은 요소를 순회하면서 요소가 가진 텍스트를 출력하기
//   console.log(elements);
//   elements.each((idx, el) => {
//     // ❺ text() 메서드를 사용하기 위해 Node 객체인 el을 $로 감싸서 cheerio 객체로 변환
//     console.log($(el).text());
//   });
// }

// main();
const client = axios.create({
    // ❶ 실제 크롬 웹 브라우저에서 보내는 값과 동일하게 넣기
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.134 Safari/537.36 Edg/103.0.1264.77',
    },
  });

async function getSearchURL(nick){
    const url = encodeURI(`https://maplestory.nexon.com/Ranking/World/Total?c=${nick}&w=0`);
    const cafe_resp = await client.get(url);
    const $ = cheerio.load(cafe_resp.data);
    const editerPick = $(".search_com_chk");
    if($(editerPick).text() === "") return "NULL"
    else return getinfoURL("https://maplestory.nexon.com"+editerPick.find("td.left > dl > dt > a").attr("href"));
}

async function getinfoURL(ChracterURL){
    const resp = await client.get(ChracterURL);
    const $ = cheerio.load(resp.data);
    const data = $("#container > div.con_wrap > div.lnb_wrap > ul > li:nth-child(1) > a");
    return getRankingInfo( "https://maplestory.nexon.com"+data.attr("href"));
}

async function getRankingInfo(infoURL){
    const respInfo = await client.get(infoURL);
    const $ = cheerio.load(respInfo.data);
    const TotalRankRowArray = $("#container > div.con_wrap > div.contents_wrap > div > table > tbody > tr");
    
    let totalranks = TotalRankRowArray.map((index,el)=>$(el).find(":nth-child(2)").text()).toArray();
    return totalranks;

}

async function get1(nick){
    
  //  const totalrankArray = await getRankingInfo(nick);
   const totalrankArray = await getSearchURL(nick);

  console.log(totalrankArray);

}



get1("당체용");
//메이플 랭킹페이지 맨끝:6708453 //
// get2();