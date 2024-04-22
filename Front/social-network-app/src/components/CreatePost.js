import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const CREATE_POST_MUTATION = gql`
  mutation CreatePost($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      id
      title
      content
    }
  }
  `;

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [createPost, { data, loading, error }] = useMutation(CREATE_POST_MUTATION);

  const handleCreatePost = async () => {
    try {
      await createPost({ variables: { title, content } });
      setTitle('');
      setContent('');
      alert('Post created successfully!');
    } catch (e) {
      alert('Failed to create post.');
      console.error('Create post error:', e);
    }
  };

  return (
    <div>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={handleCreatePost}>Create Post</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error creating post. Please try again</p>}
    </div>
  );
}

export default CreatePost;
