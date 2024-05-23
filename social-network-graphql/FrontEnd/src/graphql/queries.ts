import { gql } from '@apollo/client';

export const GET_POSTS = gql`
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
          id
          name
        }
      }
      createdAt
    }
  }
`;

export const GET_POSTS_BY_AUTHOR = gql`
  query GetPostsByAuthor($authorId: ID!) {
    postsByAuthor(authorId: $authorId) {
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
      createdAt
    }
  }
`;

export const GET_POSTS_BY_LIKES = gql`
  query GetPostsByLikes {
    postsByLikes {
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
      createdAt
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
    }
  }
`;

export const ADD_COMMENT = gql`
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

export const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      user {
        name
      }
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $title: String!, $content: String!) {
    updatePost(id: $id, title: $title, content: $content) {
      id
      title
      content
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`;

export const DELETE_LIKE = gql`
  mutation DeleteLike($id: ID!) {
    deleteLike(id: $id) {
      id
    }
  }
`;