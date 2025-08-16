import React from 'react';

interface Post {
  id: number;
  title: string;
  description: string;
  likes: number;
  comments: number;
  views: number;
}

const posts: Post[] = [
  {
    id: 1,
    title: 'How to Get the Most Out of Skill exchangeping',
    description: 'In this post, I share some tips on maximizing your skill exchange experience...',
    likes: 12,
    comments: 5,
    views: 150,
  },
  {
    id: 2,
    title: 'Success Story: From Novice to Pro',
    description: "I exchangeped skills with a professional and it changed my career. Here's how...",
    likes: 20,
    comments: 10,
    views: 300,
  },
  {
    id: 3,
    title: 'Tips for Effective Skill exchangeping',
    description: 'Here are some strategies to ensure your skill exchanges are successful...',
    likes: 8,
    comments: 2,
    views: 75,
  },
  {
    id: 4,
    title: 'Skill exchange Request: Looking for a Mentor',
    description: 'I am seeking a mentor in digital marketing. Any takers?',
    likes: 5,
    comments: 1,
    views: 50,
  },
];

const Forum: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-md shadow flex justify-between items-center mb-6">
        <div className="text-2xl font-bold">Skills exchange Community Forum</div>
        <div className="flex gap-8 text-gray-600 text-sm items-center">
          <a href="#" className="hover:underline">General Discussions</a>
          <a href="#" className="hover:underline">Skill exchange Requests</a>
          <a href="#" className="hover:underline">Success Stories</a>
          <a href="#" className="hover:underline">Tips & Tricks</a>
          <button className="ml-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Create New Post
          </button>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-white p-6 rounded-md shadow">
        <h2 className="text-2xl font-semibold mb-6">Recent Posts</h2>

        {posts.map((post, index) => (
          <div key={post.id}>
            <div className="flex items-start mb-6">
              {/* Avatar Placeholder */}
              <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded-full mr-4">
                50 × 50
              </div>

              {/* Post Content */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
                <p className="text-gray-600 mb-2">{post.description}</p>
                <div className="flex gap-6 text-gray-500 text-sm">
                  <div className="flex items-center gap-1">
                    <span role="img" aria-label="like">👍</span>
                    {post.likes} Likes
                  </div>
                  <div className="flex items-center gap-1">
                    <span role="img" aria-label="comment">💬</span>
                    {post.comments} Comments
                  </div>
                  <div className="flex items-center gap-1">
                    <span role="img" aria-label="views">👁️</span>
                    {post.views} Views
                  </div>
                </div>
              </div>
            </div>

            {/* Divider except after last post */}
            {index !== posts.length - 1 && <hr className="border-gray-300 mb-6" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forum;
