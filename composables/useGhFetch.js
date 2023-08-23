import { Base64 } from 'js-base64';
import config from '@/config.js'

const token = config.token
const owner = config.blog.owner
const repository = config.blog.repository

export const useGhFetch = (request, opts) => {
  const TOKEN = `token ${Base64.decode(token)}`
  const BASE_URL = `https://api.github.com/repos/${owner}/${repository}`

  return useFetch(request, { baseURL: BASE_URL, headers: { 'Authorization': TOKEN }, ...opts })
}