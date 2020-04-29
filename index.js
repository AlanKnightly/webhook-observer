const express = require('express')
const crypto = require('crypto')

const app = express()
const PORT = 8090

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


const handleWebhook = (req, res) => {
  const payload = JSON.stringify(req.body)
  const hmac = crypto.createHmac('sha1', 'alan').update(payload).digest('hex')

  if (req.header('X-Hub-Signature') === `sha1=${hmac}`) {
    const gitPullFile = '/home/review/git-pull.sh'
    const { spawn } = require('child_process')
    spawn(gitPullFile, [req.body.repository.name])
  }
  res.send({ success: true })
}

app.use('/github/webhook/update', handleWebhook)

app.listen(PORT, console.log(`listen on Port: ${PORT}`))
