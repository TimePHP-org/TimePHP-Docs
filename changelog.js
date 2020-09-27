const axios = require("axios")
require('dotenv').config()
const fs = require("fs");
const { exit } = require("process");

let content = ""

const tagNameArg = process.argv.slice(2)[0];

const getReleaseInfo = (tagName) => {
   return axios.post('https://api.github.com/graphql', {
      headers: {
         'Authorization': `bearer ${process.env.GITHUB_TOKEN}`,
         'Content-Type': 'application/json'
      },
      data: {
         query: `
         query {
            repository(owner: "TimePHP-Org", name: "TimePHP") {
               release(tagName:"${tagName}") {
                  createdAt
                  id
                  isPrerelease
                  tagName
                  url
               }
            }
         }
         `
      }
   })
}

const getCommitFromRelease = (tagName) => {
   return axios.post('https://api.github.com/graphql', {
      headers: {
         'Authorization': `bearer ${process.env.GITHUB_TOKEN}`,
         'Content-Type': 'application/json'
      },
      data: {
         query: `
         query {
            repository(owner: "TimePHP-Org", name: "TimePHP") {
               ref(qualifiedName: "${tagName}") {
                  target {
                     ... on Commit {
                        history(first: 100) {
                           nodes {
                              oid
                              messageHeadline
                              url
                           }
                        }
                     }
                  }
               }
            }
         }
         `
      }
   })
}

axios.all([
   getReleaseInfo(tagNameArg),
   getCommitFromRelease(tagNameArg)
]).then(results => {
   const releaseInfo = results[0].data.data.repository.release;
   const commits = results[1].data.data.repository.ref.target.history.nodes;

   let date = new Date(releaseInfo.createdAt)
   let feat = ""
   let bug = ""

   content += `
## ${release.tagName}

**Release date** : ${date.toLocaleDateString()} <br>
**Status** : ${releaseInfo.isPrerelease ? "Pre-release" : "Release"} <br>
**link** : [${releaseInfo.tagName}](${releaseInfo.url})
`
   commits.forEach(commit => {
      if (commit.messageHeadline.startsWith("[add]") || commit.messageHeadline.startsWith("[feat]")) {
         feat += `
- ${commit.messageHeadline.replace("[add]", "").replace("[feat]", "")} ([${commit.oid.substring(0, 7)}](${commit.url}))`
      } else if (commit.messageHeadline.startsWith("[fix]") || commit.messageHeadline.startsWith("[bug]")) {
         bug += `
- ${commit.messageHeadline.replace("[fix]", "").replace("[bug]", "")} ([${commit.oid.substring(0, 7)}](${commit.url}))`
      }
   })

   if (feat !== "") {
      content += ` 
### Features
${feat}
`
   }

   if (bug !== "") {
      content += ` 
   ### Bug fixes
   ${bug}
   
   <br>
`
   }

   let data = fs.writeFileSync("./docs/changelog.md", content, "utf-8")
   console.log("Changelog file updated !")


});

