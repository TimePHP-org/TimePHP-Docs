const axios = require("axios")
require('dotenv').config()
const fs = require("fs");

let content = ""

const tagNameArg = process.argv.slice(2)[0];

const repo = "TimePHP-Rest";

let firstCommit = true

let jsonString = fs.readFileSync('./config.json')
let config = JSON.parse(jsonString)

axios({
   url: 'https://api.github.com/graphql',
   method: 'post',
   headers: {
      'Authorization': `bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json'
   },
   data: {
      query: `
      query {
         repository(owner: "TimePHP-Org", name: "${repo}") {
            release(tagName:"${tagNameArg}") {
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
}).then((result) => {
   // console.table(result.data.data.repository.release.tagName);
   let release = result.data.data.repository.release
   axios({
      url: 'https://api.github.com/graphql',
      method: 'post',
      headers: {
         'Authorization': `bearer ${process.env.GITHUB_TOKEN}`,
         'Content-Type': 'application/json'
      },
      data: {
         query: `
         query {
            repository(owner: "TimePHP-Org", name: "${repo}") {
               ref(qualifiedName: "${tagNameArg}") {
                  target {
                     ... on Commit {
                        history(since: "${config.lastCommit}") {
                           nodes {
                              oid
                              messageHeadline
                              url
                              committedDate
                           }
                        }
                     }
                  }
               }
            }
         }
         `
      }
   }).then((result) => {
      let date = new Date(release.createdAt).toLocaleDateString().split("-")
      let feat = ""
      let bug = ""
      content += `## ${release.tagName}
**Release date** : ${date[0]}-${("0" + date[1]).slice(-2)}-${("0" + date[2]).slice(-2)} <br>
**Status** : ${release.isPrerelease ? "Pre-release" : "Release"} <br>
**link** : [${release.tagName}](${release.url})
`
      let commits = result.data.data.repository.ref.target.history.nodes

      commits.forEach(commit => {
         
         if(firstCommit){
            config["lastCommit"] = commit.committedDate
            let data = JSON.stringify(config);
            fs.writeFileSync('./config.json', data);
         }
         firstCommit = false

         

         if(commit.messageHeadline.startsWith("[add]") || commit.messageHeadline.startsWith("[feat]")){
            feat += `
- ${commit.messageHeadline.replace("[add]", "").replace("[feat]", "")} ([${commit.oid.substring(0, 7)}](${commit.url}))`
         } else if(commit.messageHeadline.startsWith("[fix]") || commit.messageHeadline.startsWith("[bug]")){
            bug += `
- ${commit.messageHeadline.replace("[fix]", "").replace("[bug]", "")} ([${commit.oid.substring(0, 7)}](${commit.url}))`
         }
      })

      if(feat !== ""){
         content += ` 
### Features
${feat}
         `
      }

      if(bug !== ""){
         content += ` 
### Bug fixes
${bug}

<br>

`
      }

      let data = fs.writeFileSync("./changelogTmp.md", content, "utf-8")

      console.log(`Changelog temp file updated for release : ${tagNameArg} !`)
   })
   
})