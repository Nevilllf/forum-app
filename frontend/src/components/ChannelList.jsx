import React, { useState, useEffect } from 'react';
import { getChannels, createChannel, incrementChannelView } from '../services/api';
import { useNavigate } from 'react-router-dom';
import ChannelCard from './ChannelCard';
import CreateChannelModal from './CreateChannelModal';
import { deleteChannel } from '../services/api';
import { getUserInfoFromToken } from '../utils/auth'; 
import { useSearch } from '../context/SearchContext';

// import { incrementChannelView } from '../services/api';

const ChannelList = () => {
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const user = getUserInfoFromToken();
  const isAdmin = user?.isAdmin;
  const { searchTerm } = useSearch();



  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    try {
      const res = await getChannels();
      setChannels(res.data);
    } catch (err) {
      setError('Failed to load channels');
    }
  };

  const filteredChannels = channels.filter((channel) => {
    const term = searchTerm.toLowerCase();
    return (
      channel.name.toLowerCase().includes(term) ||
      channel.description?.toLowerCase().includes(term)
    );
  });

  const handleCreateChannel = async ({ name, description }) => {
    try {
      await createChannel({ name, description });
      loadChannels();
      setShowModal(false);
    } catch (err) {
      setError('Failed to create channel');
    }
  };

  const handleChannelClick = async (channelId) => {
    try {
      await incrementChannelView(channelId); // Increment view count
      navigate(`/channels/${channelId}`);
    } catch (err) {
      console.error('Failed to increment channel view', err);
      navigate(`/channels/${channelId}`); // fallback navigation
    }
  };

  const handleDeleteChannel = async (channelId) => {
    try {
      await deleteChannel(channelId);
      loadChannels(); // refresh list
    } catch (err) {
      console.error('Failed to delete channel');
      setError('Failed to delete channel');
    }
  };

  return (
    <div className="channel-list-container">
  {/* Page Header */}
  <div className="channel-list-header">
    <h2 className="channel-list-title">Channels</h2>
    <button
      className="create-channel-button"
      onClick={() => setShowModal(true)}
    >
      + Create Channel
    </button>
  </div>

  {/* Error Message */}
  {error && <p className="text-red-500 mb-4">{error}</p>}

  {/* Channel Cards */}
  <div className="channel-grid">
    {filteredChannels.map((channel) => (
      <ChannelCard
        key={channel.id}
        channel={channel}
        onClick={() => handleChannelClick(channel.id)}
        onDelete={isAdmin ? handleDeleteChannel : null}
      />
    ))}
  </div>

  {/* Modal */}
  {showModal && (
    <CreateChannelModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      onSubmit={handleCreateChannel}
    />
  )}
</div>
  );
};

export default ChannelList;
