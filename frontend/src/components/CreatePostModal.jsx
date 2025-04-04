// CreatePostModal.jsx
import React, { useState } from 'react';

const CreatePostModal = ({ isOpen, onClose, onSubmit, channelId, channelName }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);


  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (screenshotFile) {
      formData.append('screenshot', screenshotFile);
    }
  
    try {
      await onSubmit(formData);  // send FormData to backend
      setTitle('');
      setContent('');
      setScreenshotFile(null);
      onClose();
    } catch (err) {
      console.error('Failed to submit post', err);
    }
  };
  

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Create a post in: {channelName}</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Post Title"
            className="w-full p-2 mb-3 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Post Content"
            className="w-full p-2 mb-3 border rounded"
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <input
            type="file"
            className="w-full p-2 mb-3 border rounded"
            accept="image/*"
            onChange={(e) => setScreenshotFile(e.target.files[0])}
          />
          <button type="submit" disabled={!title.trim() || !content.trim()}>
            Post
          </button>
        </form>
      </div>
    </div>
  );
  
  
};

export default CreatePostModal;
