

const axios = require("axios");
require('dotenv').config()

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
         repository(owner:"TimePHP-Org", name:"TimePHP"){
            releases(first:100){
               nodes{
                  publishedAt 
                  id
                  isPrerelease
                  tagName
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
         // console.log(release)
         let commits = result.data.data.repository.ref.target.history.nodes
         console.log(commits);
      })

   })
})
