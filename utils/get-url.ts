/**
 * Returns the base url of the API
 */
export const getBaseURL = () =>
  !(typeof window !== 'undefined' && window?.location?.origin.includes('.com'))
    ? 'https://api.denaurlen.com'
    : 'https://api.denaurlen.dev'

/**
 * Takes the relative url of the media file as param, concat with AWS S3 base url
 * and return the absolute url of the media file
 * @param {string} url
 * @returns {string} absoluteURL
 */
export const getMediaURL = (url: string): string =>
  !(typeof window !== 'undefined' && window?.location?.origin.includes('.com'))
    ? `https://denaurlen-main.s3.ap-south-1.amazonaws.com/${url}`
    : `https://denaurlen-dev.s3.ap-south-1.amazonaws.com/${url}`

