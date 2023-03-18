// 1. walkdir of src/assets/chatgpt/templates to get all yaml files
// 2. for each yaml file, read the file and parse the yaml
// 3. save the {name, description, path, author} to a json file: index.json
const fs = require("node:fs");
const path = require("node:path");
const walkdir = require("walkdir");
const yaml = require("js-yaml");

function genChatGptSamples() {
  const templatesDir = path.join(__dirname, "../src/assets/chatgpt/samples");

  const files = walkdir.sync(templatesDir, { no_recurse: true });
  const samplesMap = files
    .filter((f) => f.endsWith(".yml"))
    .map((f) => {
      const content = fs.readFileSync(f, "utf8");
      const doc = yaml.load(content);
      const { name, description, author, category, homepage, preview } = doc;
      return {
        name,
        description,
        author,
        category,
        homepage,
        preview,
        path: path.relative(templatesDir, f),
      };
    })
    .reduce((map, f) => {
      const lan = f.path.match(/(_[a-z]{2}-[A-Z]{2})/)[0];
      if (map.has(lan)) {
        map.set(lan, [...map.get(lan), f]);
      } else {
        map.set(lan, [f]);
      }
      return map;
    }, new Map());

  for (let key of samplesMap.keys()) {
    fs.writeFileSync(path.join(templatesDir, `index${key}.json`), JSON.stringify(samplesMap.get(key), null, 2));
  }
}

function genStableDiffusionSamples() {
  const templatesDir = path.join(__dirname, "../src/assets/stable-diffusion/samples");
  const indexFile = path.join(templatesDir, "index.json");

  const files = walkdir.sync(templatesDir, { no_recurse: true });
  const index = files
    .filter((f) => f.endsWith(".yml"))
    .map((f) => {
      const content = fs.readFileSync(f, "utf8");
      const doc = yaml.load(content);
      const { name, author, homepage, category, artists } = doc;
      return {
        name,
        author,
        category,
        homepage,
        artists,
        path: path.relative(templatesDir, f),
      };
    });

  fs.writeFileSync(indexFile, JSON.stringify(index, null, 2));
}

function genGitHubCopilotSamples() {
  const templatesDir = path.join(__dirname, "../src/assets/github-copilot/samples");
  const indexFile = path.join(templatesDir, "index.json");

  const files = walkdir.sync(templatesDir, { no_recurse: true });
  const index = files
    .filter((f) => f.endsWith(".yml"))
    .map((f) => {
      const content = fs.readFileSync(f, "utf8");
      const doc = yaml.load(content);
      const { name, author, homepage, category, snippets } = doc;
      return {
        name,
        author,
        category,
        homepage,
        snippets,
        path: path.relative(templatesDir, f),
      };
    });

  fs.writeFileSync(indexFile, JSON.stringify(index, null, 2));
}

genChatGptSamples();
genStableDiffusionSamples();
genGitHubCopilotSamples();
