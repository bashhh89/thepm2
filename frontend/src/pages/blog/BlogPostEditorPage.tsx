import React from 'react';
import { useParams } from 'react-router-dom';
import BlogPostEditor from '../../components/blog/BlogPostEditor';

export default function BlogPostEditorPage() {
  const { id } = useParams();
  
  return (
    <div className="p-4">
      <BlogPostEditor postId={id} />
    </div>
  );
}