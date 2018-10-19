const badgen = require('badgen')
const { send } = require('micro')
const { builtin } = require('./icons.js')

const CACHE_CONTROL = `public, max-age=60, stale-while-revalidate=604800, stale-if-error=604800`
const noneSquareIconWidths = {
  awesome: 20,
  codeclimate: 18,
  lgtm: 19
}

module.exports = (req, res, options = {}) => {
  const { code = 200, sMaxAge = '604800', params } = options

  const hostStyle = req.headers.host === 'flat.badgen.net' ? 'flat' : undefined
  const { subject, status, color } = params || req.params
  const { style, label, list, icon, iconWidth, color: queryColor } = req.query

  const badge = badgen({
    subject: typeof label !== 'undefined' ? label : subject,
    status: String(list ? status.replace(/,/g, ' | ') : status),
    color: queryColor || color,
    style: style || hostStyle,
    icon: builtin[icon === '' ? subject : icon],
    iconWidth: iconWidth || noneSquareIconWidths[icon]
  })

  res.setHeader('Content-Type', 'image/svg+xml;charset=utf-8')
  res.setHeader('Cache-Control', `${CACHE_CONTROL}, s-maxage=${sMaxAge}`)
  send(res, code, badge)
}
