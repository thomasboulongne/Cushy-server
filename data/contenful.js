'use strict';

const contentful = require('contentful-management')
const client = contentful.createClient({
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: '91cbfefc8741ae0809bc04a791e280912a54c254f80245b665b110f51a4b1c42'
})

// This API call will request a space with the specified ID
client.getSpace('7dyud8u3k188')
.then((space) => {
  // Now that we have a space, we can get entries from that space
  space.getEntries()
  .then((entries) => {
    console.log(entries.items)
  })
})