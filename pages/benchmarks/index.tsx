import useFetchBenchmarks from '../../api-routes/benchmarks/fetch-benchmarks'
import BenchmarkCard, { FirstBenchmarkCard } from '../../components/ui/benchmark-card'
import useFetchNextPage from '../../hooks/fetch-next-page.hook'
import usePageTitle from '../../hooks/page-title.hook'
import HomeLayout from '../../layouts/home.layout'
import css from '../../styles/pages/benchmarks/benchmarks-page.module.scss'
import { ifElse } from '../../utils'

export const POSTS_PER_PAGE = 20

const BenchmarksPage = () => {
  usePageTitle({ title: 'Benchmarks' })

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } = useFetchBenchmarks(POSTS_PER_PAGE)

  const nextPageTrigger = useFetchNextPage({
    fetchNextPage,
    isLoading: isFetchingNextPage,
    hasNextPage: hasNextPage || false
  })

  return (
    <div className={css.wrapper}>
      {data?.pages.map((page, pageNo) => {
        const isLastPage = data.pages.length === pageNo + 1

        return page.map((post, index) => {
          if (pageNo === 0 && index === 0)
            return (
              <FirstBenchmarkCard
                key={post._id}
                src={post.src[0]}
                postId={post._id}
                rank={index + 1}
                grossWorth={post.grossWorth}
                highestValuer={post.highestValuer.username}
                netWorth={post.netWorth}
                uploader={{
                  profilePic: post.uploader.profilePic,
                  _id: post.uploader._id,
                  username: post.uploader.username
                }}
                status={post.status}
                postKeeper={post.postKeeper}
              />
            )

          return (
            <div
              key={post._id}
              className={css.post_wrapper}
              ref={ifElse(isLastPage && index === 1, nextPageTrigger, undefined)}
            >
              <BenchmarkCard
                src={post.src[0]}
                postId={post._id}
                grossWorth={post.grossWorth}
                rank={POSTS_PER_PAGE * pageNo + index + 1}
                uploader={{
                  profilePic: post.uploader.profilePic,
                  _id: post.uploader._id,
                  username: post.uploader.username
                }}
                status={post.status}
                postKeeper={post.postKeeper}
              />
            </div>
          )
        })
      })}
    </div>
  )
}

BenchmarksPage.Layout = HomeLayout

export default BenchmarksPage
