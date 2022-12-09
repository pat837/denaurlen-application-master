import { useMutation } from "react-query";
import valuationPostQueries from ".";
import getKeys from "../../../config/storage-keys";
import { queryClient } from "../../../config/query-client";
import { ErrorCallback_, SuccessCallback_ } from "../../../types";

type UseCommentOnValuationPost_ = {
  onSuccess: SuccessCallback_
  onError: ErrorCallback_
}

const useCommentOnValuationPost = ({ onSuccess, onError }: UseCommentOnValuationPost_) => {
  return useMutation(valuationPostQueries.comment.add, {
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries(getKeys.post.valuation.getComments(variables.postId))
      onSuccess()
    },
    onError: (error, variables, context) => {
      onError()
    },
  })
}

export default useCommentOnValuationPost;