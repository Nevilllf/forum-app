import { FaTrash } from 'react-icons/fa';


const ChannelCard = ({ channel, onClick, onDelete }) => {
  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent triggering `onClick`
    if (window.confirm('Are you sure you want to delete this channel?')) {
      onDelete(channel.id);
    }
  };
    return (
      <div
        onClick={onClick}
        className="channel-card"
      >
        <h3>{channel.name}</h3>
  
        {channel.description && (
          <p>{channel.description}</p>
        )}
  
        <div className="channel-meta">
          📄 {channel.postCount || 0} posts · 👁 {channel.views || 0} views
        </div>
  
        <span className="channel-view-link">
          View Posts →
        </span>

        {onDelete && (
        <button
          onClick={handleDelete}
          className="delete-button"
          title="Delete Channel"
        >
          <FaTrash />
        </button>
      )}

      </div>
    );
  };
  export default ChannelCard