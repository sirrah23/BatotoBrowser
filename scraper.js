const puppeteer = require('puppeteer');
const creds = require('./creds.js');

async function run(){
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();

  await page.goto('https://bato.to/forums/index.php?app=core&module=global&section=login');
  await page.waitFor(2*3000);

  // Selectors
  const SIGN_IN_SELECTOR = "#sign_in";
  const USERNAME_SELECTOR = "#ips_username";
  const PASSWORD_SELECTOR = "#ips_password";
  const SUBMIT_SELECTOR = ".input_submit";
  const FOLLOWS_SELECTOR = "#nav_menu_4_trigger";

  //Login
  await page.click(USERNAME_SELECTOR);
  await page.keyboard.type(creds.username);

  await page.click(PASSWORD_SELECTOR);
  await page.keyboard.type(creds.password);

  await page.click(SUBMIT_SELECTOR);

  await page.waitForNavigation();

  await page.click(FOLLOWS_SELECTOR);


  await page.waitFor(2*4000);

  //Gather list of follows
  let index=1;
  let done = false;
  const res = [];
  const follow_template = "div.clearfix:nth-child(5) > div:nth-child(INDEX)";

  while(!done){

    let scrape_res = await page.evaluate((sel) => {
      const follow = document.querySelector(sel);
      if (follow === null){
        return [false, null];
      }
      if(follow.children.length === 0){
        return [follow.innerHTML.startsWith("Total:"), null];
      }
      const follow_data = follow.children[0];
      if(follow_data.href === null){
        return [false, null];
      }
      return [false, {name: follow_data.innerHTML, link: follow_data.href}];
    }, follow_template.replace("INDEX", index));

    done = scrape_res[0];
    let manga_data = scrape_res[1];

    if(manga_data !== null){
      res.push(manga_data);
    }


    index += 1;

    if(index > 199){
      console.log("Shit never ended");
      break;
    }
  }

  browser.close();

  return res;
}

run()
  .then(function(res){
    console.log(res);
    console.log(res.length);
  })
  .catch(function(err){
    console.log(err);
  });

