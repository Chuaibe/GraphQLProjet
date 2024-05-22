import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import './HomePage.css';

const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      content
      author {
        id
        name
      }
      comments {
        id
        content
        author {
          name
        }
      }
      likes {
        id
        user {
          name
        }
      }
    }
  }
`;

const ADD_COMMENT = gql`
  mutation AddComment($postId: ID!, $content: String!) {
    addComment(postId: $postId, content: $content) {
      id
      content
      author {
        name
      }
    }
  }
`;

const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      user {
        name
      }
    }
  }
`;

const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $title: String!, $content: String!) {
    updatePost(id: $id, title: $title, content: $content) {
      id
      title
      content
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      id
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

const HomePage: React.FC = () => {
    const { loading, error, data } = useQuery(GET_POSTS);
    const { data: currentUserData } = useQuery(GET_CURRENT_USER);
    const [addComment] = useMutation(ADD_COMMENT, {
        refetchQueries: [{ query: GET_POSTS }],
    });
    const [likePost] = useMutation(LIKE_POST, {
        refetchQueries: [{ query: GET_POSTS }],
    });
    const [updatePost] = useMutation(UPDATE_POST, {
        refetchQueries: [{ query: GET_POSTS }],
    });

    const [deletePost] = useMutation(DELETE_POST, {
        refetchQueries: [{ query: GET_POSTS }],
    });


    const [commentContent, setCommentContent] = useState('');
    const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const handleCommentSubmit = async (e: React.FormEvent, postId: string) => {
        e.preventDefault();
        await addComment({ variables: { postId, content: commentContent } });
        setCommentContent('');
    };

    const handleLike = async (postId: string) => {
        await likePost({ variables: { postId } });
    };

    const handleEdit = (post: any) => {
        setEditMode({ ...editMode, [post.id]: true });
        setEditedTitle(post.title);
        setEditedContent(post.content);
    };

    const handleUpdatePost = async (e: React.FormEvent, postId: string) => {
        e.preventDefault();
        await updatePost({ variables: { id: postId, title: editedTitle, content: editedContent } });
        setEditMode({ ...editMode, [postId]: false });
    };

    const handleDeletePost = async (postId: string) => {
        await deletePost({ variables: { id: postId } });
    };


    const handleCancelEdit = (postId: string) => {
        setEditMode({ ...editMode, [postId]: false });
    };

    const isAuthor = (postAuthorId: string) => {
        return currentUserData?.me?.id === postAuthorId;
    };

    return (
        <div className="home-container">
            <div className="home-header">
                <h1>Posts</h1>
                <Link to="/create-post">Create Post</Link>
            </div>
            {data.posts.map((post: any) => (
                <div key={post.id} className="post">
                    {editMode[post.id] ? (
                        <form onSubmit={(e) => handleUpdatePost(e, post.id)} className="edit-post-form">
                            <input
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                placeholder="Title"
                            />
                            <textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                placeholder="Content"
                            />
                            <button type="submit">Update Post</button>
                            <button type="button" onClick={() => handleCancelEdit(post.id)}>
                                Cancel
                            </button>
                        </form>
                    ) : (
                        <>
                            <h2>{post.title}</h2>
                            <p>{post.content}</p>
                            <p className="post-author">Author: {post.author.name}</p>
                            {isAuthor(post.author.id) && (
                                <>
                                    <button className="post-edit" onClick={() => handleEdit(post)}>Edit Post</button>
                                    <button className="post-delete" onClick={() => handleDeletePost(post.id)}>Delete Post</button>
                                </>
                            )}
                        </>
                    )}
                    <div className="post-comments">
                        <h3>Comments</h3>
                        {post.comments.map((comment: any) => (
                            <p key={comment.id} className="comment">
                                {comment.content} - {comment.author.name}
                            </p>
                        ))}
                        <form onSubmit={(e) => handleCommentSubmit(e, post.id)}>
                            <input
                                type="text"
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                placeholder="Add a comment"
                            />
                            <button type="submit">Comment</button>
                        </form>
                    </div>
                    <div className="post-likes">
                        <h3>Likes</h3>
                        {post.likes.map((like: any) => (
                            <p key={like.id} className="like">
                                {like.user.name}
                            </p>
                        ))}
                        <button onClick={() => handleLike(post.id)}>Like</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HomePage;
