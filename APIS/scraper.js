const cheerio = require('cheerio');
const puppeteer = require('puppeteer')
const fs = require("fs");
require('dotenv').config();


async function getResult(){
    const browser = await puppeteer.launch({headless:"new", userDataDir: "/opt/render/.cache/puppeteer"});
    const page = await browser.newPage();

    const httpResponse = await page.goto(process.env.LINK, {
        waitUntil: 'domcontentloaded'
    });
    const viewport = page.viewport();

    const x = viewport.width/2;
    const y = viewport.height/2;

    await page.mouse.click(x, y)

    await page.waitForTimeout(8000)

    await page.click('.form-control')

    await page.type('.form-control', 'FU008355')

    await page.click('.form-control')

    await page.waitForTimeout(5000)

    const htmlContent = await page.content()
    fs.writeFileSync('page.html', htmlContent)

    const element =  await page.$$('.ninja_column_1.ninja_clmn_nm_status.footable-last-visible')
    if(element.length === 1){
        console.log('No Luck!')
        return 'No Luck!';
    }

    const result = element[1];
/*    await element.screenshot({path: 'element.png'})*/

  const html = await page.evaluate(el=>el.innerHTML, result);
   const text = html;

   if(text.includes(process.env.READY)){
       console.log('success!')
       return "success!"
   } else {
       console.log(process.env.READY)
       console.log('No Luck!!!!')
       return "No Luck!"
   }








}

exports.getResult = getResult;


