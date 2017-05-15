module.exports = (req, res) => {
  const baseURL = process.env.BASE_URL
  let cssFilename
  let jsFilename

  if (process.env.NODE_ENV === 'development') {
    cssFilename = 'main.css'
    jsFilename = 'main.js'
  } else {
    cssFilename = 'main.min.css'
    jsFilename = 'main.min.js'
  }

  res.render('pages/main/main', {
    baseURL,
    cssFilename,
    jsFilename,
    title: 'Socketio | Real-time chat'
  })
}
