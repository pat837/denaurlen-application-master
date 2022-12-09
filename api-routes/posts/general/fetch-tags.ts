import { useInfiniteQuery, UseInfiniteQueryOptions } from 'react-query'
import leaderboardQueries from '.'
import storage from '../../../config/storage'
import { queryClient } from '../../../config/query-client'
import { getNextPageParams } from '../../../utils'

type useGetTagsReturnType = {
  pageParams: any[]
  pages: {
    _id: string
    name: string
    username: string
    profilePic: string
  }[]
}

type TaggedProfile_ = {
  _id: string
  name: string
  username: string
  profilePic: string
  activeBio: string
}

const useGetTags = (postId: string, size = 10) => {
  const [key, store] = [`TAGS_${postId}`, storage.session]

  let options: Omit<UseInfiniteQueryOptions<any, any, TaggedProfile_, string>, 'queryKey' | 'queryFn'> = {
    //select
    enabled: !!postId,
    select: (res: any) => {
      store.add({ key, value: res })
      return {
        pageParams: res.pageParams,
        pages: res.pages.flatMap(
          (page: {
            data: {
              data: TaggedProfile_[]
            }
          }) => page.data.data
        )
      }
    },
    getNextPageParam: (lastPage: { data: { currentPage: number; pages: number } }) =>
      getNextPageParams(lastPage.data.currentPage, lastPage.data.pages)
  }

  const data = store.get(key)

  if (!!data) options = { ...options, initialData: data }

  return {
    ...useInfiniteQuery(
      key,
      ({ pageParam = 1 }) => leaderboardQueries.getTags({ postId, page: pageParam, size }),
      options
    ),
    clearAndRefetchQuery: () => {
      queryClient.removeQueries(key)
      queryClient.resetQueries(key)
    }
  }
}

export default useGetTags

const i = {
  pages: [
    {
      data: {
        pages: 1,
        currentPage: '1',
        data: [
          {
            _id: '62ca3b38d4fb4c9d6609d97b',
            name: 'Mohammad Shanawaz',
            username: 'shanawaz',
            profilePic: 'uploads/profile/1657525318985_mohammadshanawaz58.jpeg',
            activeBio: ''
          }
        ]
      },
      status: 200,
      statusText: 'OK',
      headers: {
        authorization:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmM5N2FhYWQ0ZmI0YzlkNjYwOWNlMGMiLCJlbWFpbCI6InByYW5heWRhcm1hcHVyaUBnbWFpbC5jb20iLCJpYXQiOjE2NTc2MTE3MDYsImV4cCI6MTY1NzYxMjYwNn0.vvCjjVV4ZOlsyjFjXbA-XOAI1Q6_kVaVfq1kgvOSc_c',
        'content-length': '206',
        'content-type': 'application/json; charset=utf-8'
      },
      config: {
        transitional: {
          silentJSONParsing: true,
          forcedJSONParsing: true,
          clarifyTimeoutError: false
        },
        transformRequest: [null],
        transformResponse: [null],
        timeout: 60000,
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',
        maxContentLength: -1,
        maxBodyLength: -1,
        headers: {
          Accept: 'application/json, text/plain, */*',
          authorization:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmM5N2FhYWQ0ZmI0YzlkNjYwOWNlMGMiLCJlbWFpbCI6InByYW5heWRhcm1hcHVyaUBnbWFpbC5jb20iLCJpYXQiOjE2NTc1MTY4MTgsImV4cCI6MTY1NzUxNzcxOH0.WOj-Rapqid34oSqJ8QIA2dOgQSO6gv6MIJ4kKPR9Sa0',
          refresh_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmM5N2FhYWQ0ZmI0YzlkNjYwOWNlMGMiLCJlbWFpbCI6InByYW5heWRhcm1hcHVyaUBnbWFpbC5jb20iLCJpYXQiOjE2NTc1MTY4MTgsImV4cCI6MTY1ODEyMTYxOH0.q3h4Yxy_3gloz7Fo8u9ZhgEyCDVl0Kq_7woUdGyD3n8',
          otp_token: ''
        },
        baseURL: 'https://api.denaurlen.dev/api',
        withCredentials: true,
        method: 'get',
        url: '/user/general-post/tags/view/62cd193ae403edfb1d7eba6f',
        params: {
          page: 1,
          size: 10
        }
      },
      request: {}
    }
  ],
  pageParams: [null]
}
