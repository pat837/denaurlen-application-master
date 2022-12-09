// const URL_REGEX = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim
const URL_REGEX =
  /(?:(?:https?|ftp):\/\/|\b(?:[a-z\d]+\.))(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))?/gi

const constants = {
  AUTHORIZATION: 'authorization',
  REFRESH_TOKEN: 'refresh_token',
  OTP_TOKEN: 'otp_token',
  AUTHORIZATION_LS: '630eje5g2e17',
  REFRESH_TOKEN_LS: 'AIzdU-umCaSyB',
  OTP_TOKEN_LS: 'iq8a_dxRyCj',
  REFERRAL_CODE: 'referral-code',
  CATEGORIES: 'umCc0dzG_dx',
  LS_ALGORITHM: 'aes-256-cbc',
  LS_SECRET_KEY: '742a1b6302e17436a67eebff756a7f2a',
  GOOGLE_CLIENT_ID: '575240774886-ckcvf40g81eje5go40rvdch5iq8aq2t4.apps.googleusercontent.com',
  API_KEY: 'AIzaSyB6scfNKRLZ3IadU-umCc0dzG_dxRyCjuw',
  POST_POPUP_MIN_WIDTH: 900,
  HASHTAG_DETECT_REGEX: /#[a-z]+/gi,
  USERNAME_DETECT_REGEX: /@[A-Za-z][A-Za-z0-9._]+/gi,
  URL_DETECT_REGEX: URL_REGEX,
  POST_ASPECT_RATIO: 8.5 / 11,
  GENERAL_STORY_VIEW_DURATION: 1000 * 5,
  POST_UPLOADER_AVATAR_SIZE: 36,
  initRoute: 'initial-route'
} as const

export default constants
