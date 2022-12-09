import { AxiosResponse } from 'axios'
import { useInfiniteQuery, useQuery, UseQueryOptions } from 'react-query'

import http from '../config/http'
import { queryClient } from '../config/query-client'
import { getNextPageParams } from '../utils'

import type { getBalanceType } from '../types'

const profileService = {
  setCategories: (
    categories: {
      category: string
      priority: number
    }[]
  ) => http.post('user/categories', { categories }),
  changeDP: (profilePic: Blob) => {
    const formData = new FormData()
    const image = new File([profilePic], 'image.jpeg', { type: profilePic.type })
    formData.append('profile', image)

    return http.post('/user/dp', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  removeDP: () => http.delete('/user/dp'),
  getRank: (username: string, signal?: AbortSignal) => http.get(`/user/rank/${username}`, { signal }),
  getFollowers: (page: string, size: string) => http.get(`/user/followers?page=${page}&size=${size}`),
  getFollowing: () => http.get('/user/followers'),
  getBalance: (username: string, signal?: AbortSignal) =>
    http.get<getBalanceType>(`/user/balance/${username}`, { signal }),
  isFollowing: (userId: string) => http.get(`/user/is-following/${userId}`),
  follow: (userId: string) => http.post(`/user/follow/${userId}`),
  getFollowFollowingCount: (username: string) => http.get(`/user/follows-count/${username}`),
  getFollowingList: (username: string, page = 1, size = 10) =>
    http({
      method: 'GET',
      url: `/user/following/${username}`,
      params: { page, size }
    }),
  getFollowersList: (username: string, page = 1, size = 10) =>
    http({
      method: 'GET',
      url: `/user/followers/${username}`,
      params: { page, size }
    })
}

export const useGetFollowFollowingCounts = (username: string) => {
  let options: Omit<
    UseQueryOptions<
      any,
      any,
      {
        followingCount: number
        followersCount: number
      },
      string[]
    >,
    'queryKey' | 'queryFn'
  > = {
    select: (res: any) => res.data,
    refetchInterval: 2 * 60 * 1000, // 👉 Two Minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    enabled: !!username
  }

  return useQuery(
    ['FOLLOW_FOLLOWING_COUNT', username],
    () => profileService.getFollowFollowingCount(username),
    options
  )
}

export const useGetBalance = (username: string, watch = false) =>
  useQuery(['BALANCE', username], ({ signal }) => profileService.getBalance(username, signal), {
    select: response => response.data,
    refetchInterval: watch ? 4 * 1000 : undefined,
    enabled: !!username
  })

export const useGetRank = (username: string, watch = false) =>
  useQuery(['RANK', username], ({ signal }) => profileService.getRank(username, signal), {
    select: (res: AxiosResponse<any, any>) => res.data[0].rank,
    refetchInterval: watch ? 4 * 1000 : undefined,
    enabled: !!username
  })

export const useGetFollowersList = ({ username, size = 10 }: { username: string; size?: number }) => {
  const queryKey = ['FOLLOWERS_LIST', username, size]

  return {
    ...useInfiniteQuery(
      queryKey,
      ({ pageParam = 1 }) => profileService.getFollowersList(username, pageParam, size),
      {
        getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.pages),
        select: (
          res
        ): {
          pageParams: any[]
          pages: {
            isFollowing: boolean
            name: string
            profilePic: string
            username: string
            _id: string
          }[]
        } => ({
          pageParams: res.pageParams,
          pages: res.pages.flatMap(page => page.data.data)
        }),
        enabled: !!username,
        staleTime: 1000 * 60 * 2 // 👉 Two Minutes
      }
    ),
    clearAndRefetchQuery: () => {
      queryClient.removeQueries(queryKey)
      queryClient.resetQueries(queryKey)
    }
  }
}

export const useGetFollowingList = ({ username, size = 10 }: { username: string; size?: number }) => {
  const queryKey = ['FOLLOWING_LIST', username, size]

  return {
    ...useInfiniteQuery(
      queryKey,
      ({ pageParam = 1 }) => profileService.getFollowingList(username, pageParam, size),
      {
        getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.pages),
        select: (
          res
        ): {
          pageParams: any[]
          pages: {
            name: string
            profilePic: string
            username: string
            _id: string
          }[]
        } => ({
          pageParams: res.pageParams,
          pages: res.pages.flatMap(page => page.data.data)
        }),
        enabled: !!username,
        staleTime: 1000 * 60 * 2 // 👉 Two Minutes
      }
    ),
    clearAndRefetchQuery: () => {
      queryClient.removeQueries(queryKey)
      queryClient.resetQueries(queryKey)
    }
  }
}

export default profileService
