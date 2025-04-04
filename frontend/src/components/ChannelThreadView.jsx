import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMessagesByChannel } from '../services/api';
import PostCard from './PostCard'; // import your component
import { Link } from 'react-router-dom';
import CreatePostModal from './CreatePostModal';
import { postMessageToChannel } from '../services/api';
import { getChannelById } from '../services/api';
import { useSearch } from '../context/SearchContext';





const ChannelThreadView = () => {
  const { id } = useParams(); // channel ID
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [channelName, setChannelName] = useState('');
  const { searchTerm } = useSearch();



  useEffect(() => {
    fetchPosts();
    fetchChannelName();
  }, [id, refreshFlag]);

    const handleCreatePost = async (formData) => {
    try {
      await postMessageToChannel(id, formData); // Send to API
      fetchPosts();
    } catch (err) {
      console.error('Failed to create post');
    }
    };

    const fetchChannelName = async () => {
      try {
        const res = await getChannelById(id);
        setChannelName(res.data.name || 'Untitled');
      } catch {
        setChannelName(`ID: ${id}`);
      }
    };    
  
  

  const fetchPosts = async () => {
    try {
      const res = await getMessagesByChannel(id);
      const postsOnly = res.data.filter(msg => !msg.parentReplyId); // if you support replies as top-level messages
      setPosts(postsOnly);
    } catch (err) {
      console.error(err);
      setError('Failed to load posts');
    }
  };

  const filteredPosts = posts.filter((post) => {
    const term = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(term) ||
      post.content.toLowerCase().includes(term) ||
      post.username.toLowerCase().includes(term)
    );
  });
  

  return (
    <div className="channel-thread">
    {/* Header with title and create post button */}
    <div className="channel-header">
      <h2 className="channel-title"> {channelName}</h2>
      <button
        className="create-post-button"
        onClick={() => setShowModal(true)}
      >
        + Create Post
      </button>
    </div>
  
    {/* Error message if any */}
    {error && <p className="text-red-500">{error}</p>}
  
    {/* Post Cards */}
    <div className="post-list">
      {filteredPosts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          channelName={channelName}
          onVoted={() => setRefreshFlag((f) => !f)}
        />
      ))}
    </div>
  
    {/* Create Post Modal */}
    {showModal && (
      <CreatePostModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreatePost}
        channelId={id}
        channelName={channelName}
      />
    )}
  </div>
  

  );
  
};

export default ChannelThreadView;
