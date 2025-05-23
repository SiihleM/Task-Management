import React, { useState } from 'react';

function TaskComments({ comments = [], addComment }) {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim() === '') return;
    addComment(newComment.trim());
    setNewComment('');
  };

  return (
    <div style={{ marginTop: '15px', padding: '10px', borderTop: '1px solid #ccc' }}>
      <h3>Comments</h3>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {comments.map((comment, index) => (
            <li key={index} style={{ marginBottom: '8px', backgroundColor: '#f1f1f1', padding: '8px', borderRadius: '6px' }}>
              {comment}
            </li>
          ))}
        </ul>
      )}
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
          style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button onClick={handleAddComment} style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: '#E94E4E', color: '#fff', border: 'none', cursor: 'pointer', marginLeft: 'auto' }}>
          Add
        </button>
      </div>
    </div>
  );
}

export default TaskComments;
