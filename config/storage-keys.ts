import { FetchPostsByCategoryParams_, FetchSlotOnePostParams_ } from '../types/category-post.type'

const keys = {
  profile: 'Z4S4fVf3NZ',
  community: {
    getCommunity: 'uw1puISaKf',
    getMyCommunity: 'VXAvaPdMzQ'
  },
  post: {
    general: {
      get: 'GVopXaWyFZ',
      comments: {
        isLiked: 'f3VrS8M0XL',
        get: '3HEI3CIZ0P'
      },
      counts: 'l0kAopUvBQ'
    },
    category: {
      counts: 'm5MAzQPhfY',
      comments: 'kBJmBiRthY',
      interests: 'E8C9i987R3'
    },
    valuation: {
      get: 'GQ2SP34yND',
      getById: 'p2UQcuWso1',
      counts: 'E8C9im5MAz',
      lead: {
        get: 'RL37Hrl4Is'
      },
      comments: 'rl4IsRL37H',
      interests: '9im5MHJLy0',
      viewCounts: '7le9k',
      viewList: 'kcMuBA'
    },
    counts: 'E8C9iE8C9i'
  },
  story: {
    premium: {
      get: 'HJLy0115Qt',
      views: 'kcMuBAj5Yi'
    },
    getByUsername: 'plmOQ',
    isViewed: 'Rio47',
    viewList: 'iT0Bz',
    counts: '32mUI'
  }
}

const getKeys = {
  profile: {
    get: () => keys.profile,
    getOthers: (username: string) => `${keys.profile}${username}`,
    community: (username: string) => `${keys.community.getCommunity}${username}`,
    myCommunity: (username: string) => `${keys.community.getMyCommunity}${username}`
  },
  post: {
    counts: (username: string) => `${keys.post.counts}${username}`,
    valuation: {
      get: (username: string) => `${keys.post.valuation.get}${username}`,
      getById: (postId: string) => `${keys.post.valuation.getById}${postId}`,
      counts: (postId: string) => `${keys.post.valuation.counts}${postId}`,
      getLead: (postId: string) => `${keys.post.valuation.lead.get}${postId}`,
      getComments: (postId: string) => `${keys.post.valuation.comments}${postId}`,
      getInterests: (postId: string) => `${keys.post.valuation.interests}${postId}`,
      getViewCounts: (postId: string) => `${postId}${keys.post.valuation.viewCounts}`,
      getViewList: (postId: string) => `${postId}${keys.post.valuation.viewList}`
    },
    general: {
      get: (username: string) => `${keys.post.general.get}${username}`,
      getSaved: () => `${keys.post.general.get}-SAVED`,
      getTagged: () => `${keys.post.general.get}-TAGGED`,
      comments: {
        isLiked: (commentId: string) => `${keys.post.general.comments.isLiked}${commentId}`,
        get: (postId: string) => `${keys.post.general.comments.get}${postId}`
      },
      getCounts: (postId: string) => `${keys.post.general.counts}${postId}`
    },
    category: {
      byCategory: ({ username, categoryId }: FetchPostsByCategoryParams_) => {
        return `${categoryId}${keys.post.category.counts}${username}`
      },
      counts: (postId: string) => `${keys.post.category.counts}${postId}`,
      comments: (postId: string) => `${keys.post.category.comments}${postId}`,
      isCommentInterested: (commentId: string) => `${commentId}-is-liked-${keys.post.category.comments}`,
      interests: (postId: string) => `${keys.post.category.interests}${postId}`,
      slotOnePost: ({ username, categoryId }: FetchSlotOnePostParams_) =>
        `${keys.post.category.counts}${categoryId}${username}`
    }
  },
  story: {
    premium: {
      get: (username: string) => `${keys.story.premium.get}${username}`,
      getViews: (storyId: string) => `${keys.story.premium.views}${storyId}`
    },
    general: {
      getViews: (storyId: string) => `${keys.story.viewList}${storyId}`
    },
    getByUsername: (username: string) => `${keys.story.getByUsername}${username}`,
    isViewed: (storyId: string) => `${keys.story.isViewed}${storyId}`,
    isViewedAll: (username: string) => `${keys.story.isViewed}${username}`,
    getCounts: (storyId: string) => `${storyId}${keys.story.counts}`
  }
}

export default getKeys
