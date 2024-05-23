import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_POST, DELETE_POST, GET_POSTS, DELETE_LIKE } from '../graphql/queries';
import CommentForm from './CommentForm';
import LikeButton from './LikeButton';

const Post: React.FC<{ post: any; currentUserId?: string }> = ({ post, currentUserId }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedTitle, setEditedTitle] = useState(post.title);
    const [editedContent, setEditedContent] = useState(post.content);
    const [updatePost] = useMutation(UPDATE_POST, {
        refetchQueries: [{ query: GET_POSTS }],
    });
    const [deletePost] = useMutation(DELETE_POST, {
        refetchQueries: [{ query: GET_POSTS }],
    });

    const [deleteLike] = useMutation(DELETE_LIKE, {
        refetchQueries: [{ query: GET_POSTS }],
    });

    const handleUpdatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        await updatePost({ variables: { id: post.id, title: editedTitle, content: editedContent } });
        setEditMode(false);
    };

    const handleDeletePost = async () => {
        await deletePost({ variables: { id: post.id } });
    };

    const handleDeleteLike = async (likeId: string) => {
        console.log('Deleting like:', likeId);
        await deleteLike({ variables: { id: likeId } });
    };

    const handleCancelEdit = () => {
        setEditMode(false);
    };

    const isAuthor = currentUserId === post.author.id;
    console.log('Current User ID:', currentUserId, 'Type:', typeof currentUserId);
    console.log('Post Author ID:', post.author.id, 'Type:', typeof post.author.id);

    return (
        <div className="post">
            {editMode ? (
                <form onSubmit={handleUpdatePost} className="edit-post-form">
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
                    <div className="edit-post-buttons">
                        <button type="submit">Update Post</button>
                        <button type="button" onClick={handleCancelEdit}>
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                    <p className="post-author">Author: {post.author.name}</p>
                    <p className="post-created-at">Created At: {new Date(post.createdAt).toLocaleString()}</p>
                    {isAuthor && (
                        <>
                            <button className="post-edit" onClick={() => setEditMode(true)}>
                                Edit Post
                            </button>
                            <button className="post-delete" onClick={handleDeletePost}>
                                Delete Post
                            </button>
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
                <CommentForm postId={post.id} />
            </div>
            <div className="post-likes">
                <h3>Likes</h3>
                {post.likes.map((like: any) => {
                    console.log('Like user ID:', like.user.id, 'Type:', typeof like.user.id, 'Current user ID:', currentUserId, 'Type:', typeof currentUserId);
                    return (
                        <p key={like.id} className="like">
                            {like.user.name}
                            {String(like.user.id) === String(currentUserId) && (
                                <button onClick={() => handleDeleteLike(like.id)} className="delete-like-button">✖</button>
                            )}
                        </p>
                    );
                })}
                <LikeButton postId={post.id} userId={currentUserId}/>
            </div>
            <p>Current User ID: {currentUserId}</p>
            <p>Current post ID: {post.id}</p>
        </div>
    );
};

export default Post;
