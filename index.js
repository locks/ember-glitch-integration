const execa = require("execa");
const fs = require("fs");

const GLITCH_BUTTON = `<!-- include the Glitch button to show what the webpage is about and
    to make it easier for folks to view source and remix -->
    <div class="glitchButton" style="position:fixed;top:20px;right:20px;"></div>
    <script src="https://button.glitch.me/button.js"></script>`;

async function updateGitRepo() {
  let version = process.argv[2];
  await execa("git", ["fetch"]);
  await execa("git", ["reset", "--hard", version]);
}

function updateAppHtml() {
  let appHtml = fs.readFileSync("./app/index.html").toString();
  let modifiedAppHtml = appHtml.replace(
    `{{content-for "body-footer"}}`,
    `{{content-for "body-footer"}}

    ${GLITCH_BUTTON}`
  );
  fs.writeFileSync("./fixture/app/index.html", modifiedAppHtml);
}

function updatePackageJson() {
  let manifest = JSON.parse(fs.readFileSync("./package.tmp.json"));
  manifest.scripts.start = manifest.scripts.start + " -p 4200";
  fs.writeFileSync("./package.tmp.json", JSON.stringify(manifest, null, 2));
}

async function main() {
  await updateGitRepo();
  updateAppHtml();
  updatePackageJson();
}

main();
