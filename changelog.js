

const axios = require("axios")
require('dotenv').config()
const fs = require("fs")

let content = ""

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
         repository(owner: "TimePHP-Org", name: "TimePHP") {
            releases(first: 100, orderBy: {field: NAME, direction: ASC}) {
               nodes {
                  createdAt
                  id
                  isPrerelease
                  tagName
                  url
               }
            }
         }
      }
      `
   }
}).then((result) => {
   let releases = result.data.data.repository.releases.nodes
   releases.forEach(release => {
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
               repository(owner: "TimePHP-Org", name: "TimePHP") {
                  ref(qualifiedName: "${release.tagName}") {
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
      }).then((result) => {
         let date = new Date(release.createdAt)
         let feat = ""
         let bug = ""
         content += `
## ${release.tagName}

**Release date** : ${date.toLocaleDateString()} <br>
**Status** : ${release.isPrerelease ? "Pre-release" : "Release"} <br>
**link** : [${release.tagName}](${release.url})
`
         let commits = result.data.data.repository.ref.target.history.nodes

         commits.forEach(commit => {
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

         let data = fs.writeFileSync("./docs/changelog.md", content, "utf-8")
         console.log("Changelog file updated !")
      })
   })
})
