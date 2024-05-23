import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_COMMENT, GET_POSTS } from '../graphql/queries';

const CommentForm: React.FC<{ postId: string }> = ({ postId }) => {
    const [commentContent, setCommentContent] = useState('');
    const [addComment, { error }] = useMutation(ADD_COMMENT, {
        refetchQueries: [{ query: GET_POSTS }],
    });

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
            {error && <p>Error: {error.message}</p>}
        </form>
    );
};

export default CommentForm;
