import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMessagesByChannel, getReplies, postReply, getUserVote, ratePost } from '../services/api';
import { FaReply } from 'react-icons/fa';
import { FaRegThumbsUp, FaRegThumbsDown, FaRegCommentDots, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { rateReply, getUserReplyVote } from '../services/api';
import { deletePost, deleteReply } from '../services/api';
import { getUserInfoFromToken } from '../utils/auth';
import { FaTrash } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { getChannelById } from '../services/api';
import { useSearch } from '../context/SearchContext';





const PostDetail = () => {
  const { id, postId } = useParams();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState({});
  const [replyVotes, setReplyVotes] = useState({});
  const [activeReplyTarget, setActiveReplyTarget] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyPreview, setReplyPreview] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const user = getUserInfoFromToken();
  // const isAdmin = user?.isAdmin;
  const isAdmin = !!user?.isAdmin;
  const location = useLocation();
const channelNameFromState = location.state?.channelName || '';
const [channelName, setChannelName] = useState('');
const { searchTerm } = useSearch();





useEffect(() => {
  fetchPost();
  fetchUserVote();

  // Get channel name from state or fallback
  if (location.state?.channelName) {
    setChannelName(location.state.channelName);
  } else {
    fetchChannelName();
  }
}, [id]);


  const fetchPost = async () => {
    try {
      const res = await getMessagesByChannel(id);
      const mainPost = res.data.find((msg) => msg.id === parseInt(postId));
      setPost(mainPost);
      setLikes(mainPost.likes || 0);
      setDislikes(mainPost.dislikes || 0);
      fetchReplies(postId);
    } catch (err) {
      console.error('Failed to fetch post');
    }
  };

  const fetchReplies = async (postId) => {
    try {
      const res = await getReplies(postId);
      const grouped = {};
      const votes = {};
      for (const reply of res.data) {
        const parentId = reply.parentReplyId || null;
        if (!grouped[parentId]) grouped[parentId] = [];
        grouped[parentId].push(reply);
        const voteRes = await getUserReplyVote(reply.id);
        reply.userVote = voteRes.data.vote;
        votes[reply.id] = voteRes.data.vote;
      }
      setReplies(grouped);
      setReplyVotes(votes);
    } catch (err) {
      console.error('Failed to fetch replies');
    }
  };

  const fetchUserVote = async () => {
    try {
      const res = await getUserVote(postId);
      setUserVote(res.data.vote);
    } catch (err) {
      console.error('Failed to fetch user vote');
    }
  };
  const fetchChannelName = async () => {
    try {
      const res = await getChannelById(id);
      setChannelName(res.data.name || `Channel ${id}`);
    } catch (err) {
      console.error('Failed to fetch channel name');
      setChannelName(`Channel ${id}`);
    }
  };
  

  const handleLike = async () => {
    if (userVote === 'up') return;
    try {
      await ratePost(post.id, 'up');
      setLikes((prev) => prev + 1);
      if (userVote === 'down') setDislikes((prev) => prev - 1);
      setUserVote('up');
    } catch (err) {
      console.error('Failed to like post');
    }
  };

  const handleDislike = async () => {
    if (userVote === 'down') return;
    try {
      await ratePost(post.id, 'down');
      setDislikes((prev) => prev + 1);
      if (userVote === 'up') setLikes((prev) => prev - 1);
      setUserVote('down');
    } catch (err) {
      console.error('Failed to dislike post');
    }
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim() || !post) return;
    try {
      await postReply(post.id, {
        content: replyText,
        parentReplyId: activeReplyTarget || null,
      });
      setReplyText('');
      setActiveReplyTarget(null);
      setReplyPreview(null);
      fetchReplies(post.id);
    } catch (err) {
      console.error('Failed to post reply');
    }
  };

  const handleSetReplyTarget = (reply) => {
    setActiveReplyTarget(reply.id);
    setReplyPreview(reply);
    document.getElementById('replyInput')?.focus();
  };

  const handleReplyLike = async (replyId) => {
    if (replyVotes[replyId] === 'up') return;
    try {
      await rateReply(replyId, 'up');
      await fetchReplies(postId); // reload to update like/dislike counts
    } catch (err) {
      console.error('Failed to like reply');
    }
  };
  
  const handleReplyDislike = async (replyId) => {
    if (replyVotes[replyId] === 'down') return;
    try {
      await rateReply(replyId, 'down');
      await fetchReplies(postId);
    } catch (err) {
      console.error('Failed to dislike reply');
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(post.id);
        window.history.back(); // navigate back to channel view
      } catch (err) {
        console.error('Failed to delete post');
      }
    }
  };
  
  const handleDeleteReply = async (replyId) => {
    if (window.confirm('Are you sure you want to delete this reply?')) {
      try {
        await deleteReply(replyId);
        fetchReplies(post.id);
      } catch (err) {
        console.error('Failed to delete reply');
      }
    }
  };
  
  
  

  const ReplyThread = ({ parentId, depth = 0 }) => {
    const term = searchTerm.toLowerCase();
  
    // Recursive filter function: returns true if reply or its children match
    const replyMatches = (reply) => {
      const matchesSelf =
        reply.content.toLowerCase().includes(term) ||
        reply.username.toLowerCase().includes(term);
  
      const childReplies = replies[reply.id] || [];
      const anyChildMatches = childReplies.some(replyMatches);
  
      return matchesSelf || anyChildMatches;
    };
  
    const nested = (replies[parentId] || []).filter(replyMatches);
  
    return (
      <ul className="mt-1">
        {nested.map((reply) => {
          const isMatch =
            reply.content.toLowerCase().includes(term) ||
            reply.username.toLowerCase().includes(term);
  
          return (
            <li
              key={reply.id}
              className={`reply-item ${
                isMatch ? 'bg-yellow-100 border-l-4 border-yellow-500 shadow-sm' : ''
              }`}
              style={{ marginLeft: `${depth * 20}px` }}
            >
              <div className="reply-header">
                <div>
                  <div className="reply-meta">
                    <span className="post-author">{reply.username}</span> at {reply.formattedTimestamp}
                  </div>
                  <div
                      className="reply-content"
                      dangerouslySetInnerHTML={{
                        __html: reply.content.replace(
                          new RegExp(`(${searchTerm})`, 'gi'),
                          '<mark class="bg-yellow-300 font-semibold">$1</mark>'
                        ),
                      }}
                    ></div>

                  <div className="reply-actions">
                    <button
                      onClick={() => handleReplyLike(reply.id)}
                      className={`reaction-button ${replyVotes[reply.id] === 'up' ? 'reacted-up' : ''}`}
                    >
                      {replyVotes[reply.id] === 'up' ? <FaThumbsUp /> : <FaRegThumbsUp />} {reply.likes}
                    </button>
                    <button
                      onClick={() => handleReplyDislike(reply.id)}
                      className={`reaction-button ${replyVotes[reply.id] === 'down' ? 'reacted-down' : ''}`}
                    >
                      {replyVotes[reply.id] === 'down' ? <FaThumbsDown /> : <FaRegThumbsDown />} {reply.dislikes}
                    </button>
                  </div>
                </div>
  
                <div className="reply-tools">
                  <button className="icon-reply-button" onClick={() => handleSetReplyTarget(reply)}>
                    <FaReply />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteReply(reply.id)}
                      className="delete-button"
                      title="Delete Reply"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
  
              {/* Recursively render child replies */}
              <ReplyThread parentId={reply.id} depth={depth + 1} />
            </li>
          );
        })}
      </ul>
    );
  };
  
  
  
  

  if (!post) return <div className="p-4">Loading...</div>;

  return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        {channelName && (
          <div className="mb-4">
            <h2 className="channel-title text-xl font-bold text-blue-800">
              {channelName}
            </h2>
          </div>
        )}

        <div className="flex-1 overflow-y-auto post-detail-container">
          {/* Post Content */}
          <div className="post-main">
            <h3 className="post-title">{post.title}</h3>
            <p className="post-body">{post.content}</p>
    
            {post.screenshotUrl && (
              <img
                src={`http://localhost:5001${post.screenshotUrl}`}
                alt="screenshot"
                className="post-detail-image"
              />
            )}
    
            <div className="post-meta">
              Posted by <span className="post-author">{post.username}</span> at {post.formattedTimestamp}
            </div>
    
            <div className="post-actions">
              <button onClick={handleLike} className={`reaction-button ${userVote === 'up' ? 'reacted-up' : ''}`}>
                {userVote === 'up' ? <FaThumbsUp /> : <FaRegThumbsUp />} {likes}
              </button>
              <button onClick={handleDislike} className={`reaction-button ${userVote === 'down' ? 'reacted-down' : ''}`}>
                {userVote === 'down' ? <FaThumbsDown /> : <FaRegThumbsDown />} {dislikes}
              </button>
              <button
                className="reaction-button"
                onClick={() => document.getElementById('replyInput')?.focus()}
              >
                <FaRegCommentDots /> {Object.values(replies).flat().length || 0}
              </button>
              {isAdmin && (
                <button
                  onClick={handleDeletePost}
                  className="delete-button"
                  title="Delete Post"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          </div>
    
          {/* Replies */}
          <ReplyThread parentId={null} />
        </div>
    
        {/* Reply Input */}
        <div className="reply-box">
          {replyPreview && (
            <div className="reply-preview">
              <div>
              Replying to <strong>{replyPreview.username}</strong>: "
              {replyPreview.content.slice(0, 50)}..."
              </div>
              <button
                onClick={() => {
                  setReplyPreview(null);
                  setActiveReplyTarget(null);
                }}
                className="cancel-reply"
              >
                Cancel
              </button>
            </div>
          )}
          <div className="reply-input-row">
            <input
              id="replyInput"
              className="reply-input"
              placeholder="Type your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button className="reply-send-button" onClick={handleReplySubmit}>
              Send
            </button>
          </div>
        </div>
      </div>
    );
    
};

export default PostDetail;
