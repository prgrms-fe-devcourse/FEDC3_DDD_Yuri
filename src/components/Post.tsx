import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from '../recoil/atoms/user';
import { PostResponse } from '../types/response';
import { formatDate } from '../utils/formatDate';
import { createLike, deleteLike } from '../utils/like';
import { sendLikeNotification } from '../utils/notification';
const Post = ({
  _id,
  title,
  createdAt,
  author,
  likes, // post!!
  comments,
  ...props
}: PostResponse) => {
  const [user, setUser] = useRecoilState(userState);
  const [likesState, setLikesState] = useState(likes);
  const navigate = useNavigate();

  const handleShare = (postId: string) => {
    navigator.clipboard.writeText(`${window.location.href}posts/${postId}`);
  };

  const clickHandler = (postId: string) => {
    navigate(`/posts/${postId}`);
  };

  const handleLike = async (postId: string) => {
    const isLike = likesState.findIndex((like) => like.user === user._id);
    console.log(isLike);
    if (isLike === -1) {
      const { data } = await createLike(postId);
      if (user.likes && user._id) {
        setLikesState([...likesState, data]);
        setUser({
          ...user,
          likes: [...user.likes, data],
        });
        sendLikeNotification(data._id, user._id, postId);
      }
    } else {
      setLikesState(
        likesState.filter((item) => item._id !== likesState[isLike]._id)
      );
      if (user.likes) {
        setUser({
          ...user,
          likes: user.likes.filter(
            (item) => item._id !== likesState[isLike]._id
          ),
        });
      }
      deleteLike(likesState[isLike]._id);
    }
  };

  return (
    <li {...props}>
      <div onClick={() => clickHandler(_id)}>
        <div>Title: {title}</div>
        <div>Created At: {formatDate.fullDate(createdAt)}</div>
        <div>Author: {author.fullName}</div>
        <div>Likes: {likesState.length}</div>
        <div>
          {likesState.find((like) => like.user === user._id) && (
            <span>liked post</span>
          )}
        </div>
        <div>Comments: {comments.length}</div>
      </div>
      <button onClick={() => handleShare(_id)}>share</button>
      <button onClick={() => handleLike(_id)}>like</button>
    </li>
  );
};

export default Post;
