const pluginNavigation = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const { DateTime } = require("luxon");

const {
  readdirSync,
  lstatSync,
  readFileSync,
  writeFileSync
} = require("fs");
const { 
  join,
  sep,
  extname
} = require("path")
const { 
  saveFileInContainer,
  deleteFile,
  createContainerInContainer,
  isRawData,
  getResourceInfo,
  getFile
} = require("@inrupt/solid-client");

const {
  Session
} = require("@inrupt/solid-client-authn-node");

const { config } = require("dotenv-flow");

const webpackConfig = require('./webpack.config.js');
const webpack = require('webpack');

// Load environment variables from .env.test.local if available:
config({
  path: __dirname,
  // In CI, actual environment variables will overwrite values from .env files.
  // We don't need warning messages in the logs for that:
  silent: process.env.CI === "true",
});

const extensionToTypeMap = {
  ".css": "text/css",
  ".js": "text/javascript",
  ".html": "text/html",
  ".gif": "image/gif",
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".svg": "image/svg+xml"
}

function buildPodPath(filePath, podRoot) {
  // Removes the first element of the path (usually "_site" in our case)
  return podRoot+filePath.split(sep).slice(1, undefined).join("/")
}

function pushDirectory(dirPath, podRoot, fetch) {
  readdirSync(dirPath).forEach(async (fileName) => {
    const filePath = join(dirPath, fileName)
    if(lstatSync(filePath).isDirectory()) {
      console.log(filePath, "is a directory");
      try {
        await createContainerInContainer(
          buildPodPath(dirPath, podRoot), {
            slugSuggestion: fileName,
            fetch
          }
        );
      } catch(e) {
        console.error(e)
      }
      pushDirectory(filePath, podRoot, fetch);
    } else {
      console.log(filePath, "is a file. deleting it from the server...")
      try {
        console.log(`Deleting ${buildPodPath(filePath, podRoot)}`)
        await deleteFile(
          buildPodPath(filePath, podRoot), {
            fetch
          });
      } catch (e) {
        console.error(e);
      }
      console.log("and saving it back")
      console.log(`saving ${buildPodPath(dirPath, podRoot)} from ${filePath}`)
      await saveFileInContainer(
        buildPodPath(dirPath, podRoot),
        Buffer.from(readFileSync(filePath, { encoding: "utf-8" })),
        { contentType: extensionToTypeMap[extname(filePath)], slug: fileName, fetch }
      );
    }
  });
}

async function ls(target) {
  if(isContainer(target)) {
    const dataset = await getSolidDataset(target);
    const container = getThing(dataset, target);
    return getUrlAll(container, "http://www.w3.org/ns/ldp#contains");
  } else {
    return [target];
  }
}

async function getSolidPosts(podRoot) {
  const contained = await ls(podRoot);
  contained.forEach(async (resourceUrl) => {
    const resourceInfo = getResourceInfo(resourceUrl);
    if(isRawData(resourceInfo)) {
      const file = await getFile(resourceUrl);
      writeFileSync(`./solid/${resourceUrl.replace(/\//g, "_")}`, await file.arrayBuffer());
    }
  })
}

module.exports = function(eleventyConfig) {
  // Add plugins
  eleventyConfig.addPlugin(pluginNavigation);

  // https://www.11ty.dev/docs/data-deep-merge/
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy");
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  // Alias `layout: post` to `layout: layouts/post.njk`
  eleventyConfig.addLayoutAlias("post", "layouts/post.njk");

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if( n < 0 ) {
      return array.slice(n);
    }
    return array.slice(0, n);
  });

  // Return the smallest number argument
  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  eleventyConfig.addFilter("filterTagList", tags => {
    // should match the list in tags.njk
    return (tags || []).filter(tag => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
  })

  // Create an array of all tags
  eleventyConfig.addCollection("tagList", function(collection) {
    let tagSet = new Set();
    collection.getAll().forEach(item => {
      (item.data.tags || []).forEach(tag => tagSet.add(tag));
    });

    return [...tagSet];
  });

  // Copy the `img` and `css` folders to the output
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("static");

  // Customize Markdown library and settings:
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: true,
    permalinkClass: "direct-link",
    permalinkSymbol: "#"
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  // Override Browsersync defaults (used only with --serve)
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, browserSync) {
        const content_404 = readFileSync('_site/404.html');

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.writeHead(404, {"Content-Type": "text/html; charset=UTF-8"});
          res.write(content_404);
          res.end();
        });
      },
    },
    ui: false,
    ghostMode: false
  });

  eleventyConfig.on('afterBuild', () => {
    const compiler = webpack(webpackConfig);
    compiler.run(() => {
      if(process.env.ENABLE_PUBLISH === "true") {
        const session = new Session();
        session.login({
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          oidcIssuer: process.env.OPENID_ISSUER
        }).then(() => {
          if(session.info.isLoggedIn) {
            pushDirectory(
              "_site/",
              new URL(process.env.HOMEPAGE_ROOT, process.env.POD).href,
              session.fetch
            );
          } else {
            console.error("Logging in failed");
          }
        });
      }
    });
  });

  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid"
    ],

    // -----------------------------------------------------------------
    // If your site deploys to a subdirectory, change `pathPrefix`.
    // Don’t worry about leading and trailing slashes, we normalize these.

    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for link URLs (it does not affect your file structure)
    // Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/

    // You can also pass this in on the command line using `--pathprefix`

    // Optional (default is shown)
    pathPrefix: process.env.HOMEPAGE_ROOT,

    
    // -----------------------------------------------------------------

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "njk",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk",

    // Opt-out of pre-processing global data JSON files: (default: `liquid`)
    dataTemplateEngine: false,
    

    // These are all optional (defaults are shown):
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
