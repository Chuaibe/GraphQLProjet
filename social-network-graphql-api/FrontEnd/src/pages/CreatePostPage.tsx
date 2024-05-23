import React, { useState, useEffect } from 'react';
import { useMutation, gql, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import './CreatePostPage.css';

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      id
      title
      content
    }
  }
`;

const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      content
      author {
        name
      }
      comments {
        content
        author {
          name
        }
      }
      likes {
        user {
          name
        }
      }
    }
  }
`;

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
    }
  }
`;

const CreatePostPage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [createPost, { loading, error }] = useMutation(CREATE_POST, {
        refetchQueries: [{ query: GET_POSTS }],
    });
    const { data, loading: userLoading } = useQuery(GET_CURRENT_USER);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userLoading && !data?.me) {
            navigate('/login');
        }
    }, [userLoading, data, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createPost({ variables: { title, content } });
        navigate('/');
    };

    if (userLoading) return <p>Loading...</p>;

    return (
        <div className="create-post-container">
            <h1>Create Post</h1>
            <form className="create-post-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Content"
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Post'}
                </button>
                {error && <p className="error-message">Error: {error.message}</p>}
            </form>
        </div>
    );
};

export default CreatePostPage;
