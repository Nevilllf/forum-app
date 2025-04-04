import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegThumbsUp, FaRegThumbsDown, FaRegCommentDots, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { ratePost, getUserVote } from '../services/api';


const PostCard = ({ post, channelName }) => {
  const navigate = useNavigate();

  const [likes, setLikes] = useState(post.likes || 0);
  const [dislikes, setDislikes] = useState(post.dislikes || 0);
  const [userVote, setUserVote] = useState(null);

  useEffect(() => {
    const fetchVote = async () => {
      try {
        const res = await getUserVote(post.id);
        setUserVote(res.data.vote);
      } catch (err) {
        console.error('Failed to fetch user vote');
      }
    };
    fetchVote();
  }, [post.id]);

  const handleClick = () => {
    navigate(`/channels/${post.channelId}/posts/${post.id}`, {
      state: { channelName },
    });
  };  

  const handleLike = async (e) => {
    e.stopPropagation();
    if (userVote === 'up') return;

    try {
      await ratePost(post.id, 'up');
      setLikes((prev) => prev + 1);
      if (userVote === 'down') setDislikes((prev) => prev - 1);
      setUserVote('up');
    } catch (err) {
      console.error('Failed to like post', err);
    }
  };

  const handleDislike = async (e) => {
    e.stopPropagation();
    if (userVote === 'down') return;

    try {
      await ratePost(post.id, 'down');
      setDislikes((prev) => prev + 1);
      if (userVote === 'up') setLikes((prev) => prev - 1);
      setUserVote('down');
    } catch (err) {
      console.error('Failed to dislike post', err);
    }
  };

  return (
    <div className="post-card" onClick={handleClick}>
  <h3 className="post-card-title">{post.title}</h3>

  <div className="post-meta">
    Posted by <span className="post-author">{post.username}</span> at {post.formattedTimestamp}
  </div>

  <p className="post-content">{post.content}</p>

  {post.screenshotUrl && (
    <img
      src={`http://localhost:5001${post.screenshotUrl}`}
      alt="screenshot"
      className="post-image"
    />
  )}

  <div
    className="post-actions"
    onClick={(e) => e.stopPropagation()}
  >
    <button
      onClick={handleLike}
      className={`reaction-button ${userVote === 'up' ? 'reacted-up' : ''}`}
    >
      {userVote === 'up' ? <FaThumbsUp /> : <FaRegThumbsUp />} {likes}
    </button>

    <button
      onClick={handleDislike}
      className={`reaction-button ${userVote === 'down' ? 'reacted-down' : ''}`}
    >
      {userVote === 'down' ? <FaThumbsDown /> : <FaRegThumbsDown />} {dislikes}
    </button>

    <button
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
      className="reaction-button"
    >
      <FaRegCommentDots /> {post.replyCount || 0}
    </button>
  </div>
</div>

  );
  
};

export default PostCard;
