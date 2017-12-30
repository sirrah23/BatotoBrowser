/**
* Logs into bato.to and grabs a list of all of the
* manga that you are currently following. A title and
* link is obtained for each manga.
*/

const puppeteer = require('puppeteer');

async function scrape(username, password){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://bato.to/forums/index.php?app=core&module=global&section=login');
  await page.waitFor(3*1000); //Wait for the page to load

  // Selectors
  const SIGN_IN_SELECTOR = "#sign_in";
  const USERNAME_SELECTOR = "#ips_username";
  const PASSWORD_SELECTOR = "#ips_password";
  const SUBMIT_SELECTOR = ".input_submit";
  const FOLLOWS_SELECTOR = "#nav_menu_4_trigger";

  //Login and navigate to Follows
  await page.click(USERNAME_SELECTOR);
  await page.keyboard.type(username);

  await page.click(PASSWORD_SELECTOR);
  await page.keyboard.type(password);

  await page.click(SUBMIT_SELECTOR);
  await page.waitForNavigation();

  await page.waitFor(3*1000); // Wait for buttons to load up then click
  await page.click(FOLLOWS_SELECTOR);

  await page.waitFor(8*1000); // Wait for list of followed manga to load up
  //Gather list of followed manga
  let manga_data;
  const res = [];
  let index=1;
  let done = false;
  const follow_template = "div.clearfix:nth-child(5) > div:nth-child(INDEX)";

  while(!done){

    //Scrape the next followed manga
    let scrape_res = await page.evaluate((sel) => {

      const follow = document.querySelector(sel);

      if (!follow){
        return [false, null];
      }

      if(follow.children.length === 0){
        return [follow.innerHTML.startsWith("Total:"), null];
      }

      const follow_data = follow.children[0];
      if(!follow_data.href){
        return [false, null];
      }

      return [false, {title: follow_data.innerHTML, link: follow_data.href}];
    }, follow_template.replace("INDEX", index));

    //If data was scraped successfully then store it
    done = scrape_res[0];
    manga_data = scrape_res[1];
    if(manga_data && manga_data.link){
      res.push(manga_data);
    }

    index += 1;
  }

  browser.close();

  return res;
}

module.exports=scrape;
