import React, { useEffect, useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import './HomePage.css';
import Post from '../components/Post';
import Filters from '../components/Filter';
import { GET_POSTS, GET_POSTS_BY_AUTHOR, GET_POSTS_BY_LIKES, GET_CURRENT_USER } from '../graphql/queries';

const HomePage: React.FC = () => {
    const { loading, error, data, refetch } = useQuery(GET_POSTS);
    const { data: currentUserData } = useQuery(GET_CURRENT_USER);
    const [fetchPostsByAuthor, { data: authorData }] = useLazyQuery(GET_POSTS_BY_AUTHOR);
    const [fetchPostsByLikes, { data: likesData }] = useLazyQuery(GET_POSTS_BY_LIKES);

    const [filter, setFilter] = useState<'latest' | 'author' | 'likes'>('latest');
    const [authorId, setAuthorId] = useState<string>('');

    useEffect(() => {
        if (filter === 'latest') {
            refetch();
        } else if (filter === 'author' && authorId) {
            fetchPostsByAuthor({ variables: { authorId } });
        } else if (filter === 'likes') {
            fetchPostsByLikes();
        }
    }, [filter, authorId, refetch, fetchPostsByAuthor, fetchPostsByLikes]);

    const filteredPosts = filter === 'latest'
        ? data?.posts
        : filter === 'author'
            ? authorData?.postsByAuthor
            : likesData?.postsByLikes;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    console.log('Filtered Posts:', filteredPosts);

    return (
        <div className="home-container">
            <div className="home-header">
                <h1>Posts</h1>
                {currentUserData?.me && (
                    <Link to="/create-post">Create Post</Link>
                )}
            </div>
            <Filters setFilter={setFilter} setAuthorId={setAuthorId} />
            {filteredPosts?.map((post: any) => (
                <Post key={post.id} post={post} currentUserId={currentUserData?.me?.id} />
            ))}
        </div>
    );
};

export default HomePage;
