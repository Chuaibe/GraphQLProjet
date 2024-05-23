import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_COMMENT, GET_POSTS } from '../graphql/queries';

const CommentForm: React.FC<{ postId: string, currentUserId?: string, setError: (message: string) => void }> = ({ postId, currentUserId, setError }) => {
    const [commentContent, setCommentContent] = useState('');
    const [addComment, { error }] = useMutation(ADD_COMMENT, {
        refetchQueries: [{ query: GET_POSTS }],
    });

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUserId) {
            setError('Vous devez être connecté pour commenter.');
            return;
        }
        await addComment({ variables: { postId, content: commentContent } });
        setCommentContent('');
    };

    return (
        <form onSubmit={handleCommentSubmit}>
            <input
                type="text"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Add a comment"
            />
            <button type="submit">Comment</button>
            {error && <p className="error-message">Error: {error.message}</p>}
        </form>
    );
};

export default CommentForm;
