import React from 'react';
import { useMutation } from '@apollo/client';
import { LIKE_POST, GET_POSTS, DELETE_LIKE } from '../graphql/queries';

const LikeButton: React.FC<{ postId: string; likeId?: string; userId?: string; setError: (message: string) => void }> = ({ postId, likeId, userId, setError }) => {
    const [likePost, { error }] = useMutation(LIKE_POST, {
        refetchQueries: [{ query: GET_POSTS }],
    });

    const [deleteLike] = useMutation(DELETE_LIKE, {
        refetchQueries: [{ query: GET_POSTS }],
    });

    const handleLike = async () => {
        if (!userId) {
            setError('Vous devez être connecté pour aimer.');
            return;
        }
        await likePost({ variables: { postId } });
    };

    const handleDeleteLike = async () => {
        if (!likeId) return;
        await deleteLike({ variables: { id: likeId } });
    };

    return (
        <>
            <button onClick={handleLike}>Like</button>
            {likeId && (
                <button onClick={handleDeleteLike} className="delete-like-button">✖</button>
            )}
            {error && <p className="error-message">Error: {error.message}</p>}
        </>
    );
};

export default LikeButton;
