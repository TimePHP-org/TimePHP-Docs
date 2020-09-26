

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
            releases(first: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
               nodes {
                  publishedAt
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
         let date = new Date(release.publishedAt)
         content += `
## ${release.tagName}

**Release date** : ${date.getFullYear()}-${("0" + date.getMonth()).slice(-2)}-${("0" + date.getDay()).slice(-2)} <br>
**Status** : ${release.isPrerelease ? "Pre-release" : "Release"} <br>
**link** : [${release.tagName}](${release.url})
`
         console.log(content)
         let commits = result.data.data.repository.ref.target.history.nodes
         // console.log(commits);
      })

   })
})
