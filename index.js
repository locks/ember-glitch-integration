#!/usr/bin/env node
'use strict';

const execa = require("execa");
const fs = require("fs");

const INDEX_HTML_PATH = "./app/index.html";
const GLITCH_BUTTON = `<!-- include the Glitch button to show what the webpage is about and
    to make it easier for folks to view source and remix -->
    <div class="glitchButton" style="position:fixed;top:20px;right:20px;"></div>
    <script src="https://button.glitch.me/button.js"></script>`;
const PACKAGE_JSON_PATH = "./package.json";

async function updateGitRepo() {
  console.log("Updating git repo");
  let version = process.argv[2];

  if (!version) {
    console.error("Version was not specified.");
    process.exit(1);
  }

  await execa("git", ["fetch"]);
  try {
    await execa("git", ["reset", "--hard", `v${version}`]);
  } catch (e) {
    console.error("Version could not be found. Make sure it is a released version of ember-cli");
    process.exit(1);
  }
}

function updateAppHtml() {
  console.log("Updating app/index.html");
  let appHtml = fs.readFileSync(INDEX_HTML_PATH).toString();
  let modifiedAppHtml = appHtml.replace(
    `{{content-for "body-footer"}}`,
    `{{content-for "body-footer"}}

    ${GLITCH_BUTTON}`
  );
  fs.writeFileSync(INDEX_HTML_PATH, modifiedAppHtml);
}

function updatePackageJson() {
  console.log("Updating package.json")
  let manifest = fs.readFileSync(PACKAGE_JSON_PATH).toString();
  // manifest.scripts.start = manifest.scripts.start + " -p 4200";
  let modifiedManifest = manifest.replace("ember serve", "ember serve -p 4200");
  fs.writeFileSync(PACKAGE_JSON_PATH, modifiedManifest);
}

async function main() {
  await updateGitRepo();
  updateAppHtml();
  updatePackageJson();
}

main();
