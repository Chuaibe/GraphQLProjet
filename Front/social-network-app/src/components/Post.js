import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_POSTS_QUERY = gql`
  query GetPosts {
    posts {
      id
      title
      content
      author {
        username
      }
      comments {
        text
        author {
          username
        }
      }
      likes {
        user {
          username
        }
      }
    }
  }
  `;

function Posts() {
  const { loading, error, data } = useQuery(GET_POSTS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading posts!</p>;

  return (
    <div>
      {data.posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p>Author: {post.author.username}</p>
          <p>Likes: {post.likes.length}</p>
          {post.comments.map((comment, index) => (
            <div key={index}>
              <p>{comment.text} by {comment.author.username}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Posts;