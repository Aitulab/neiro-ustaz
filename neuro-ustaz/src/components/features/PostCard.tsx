import React from 'react';
import type { Post } from '../../types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Card elevated className={styles.postCard}>
      <div className={styles.header}>
        <div className={styles.authorInfo}>
          {post.avatarUrl ? (
            <img src={post.avatarUrl} alt={post.author} className={styles.avatar} />
          ) : (
            <div className={styles.avatarPlaceholder}>{post.avatarInitials}</div>
          )}
          <div>
            <div className={styles.authorName}>{post.author}</div>
            <div className={styles.metaTag}>{post.timeAgo}</div>
          </div>
        </div>
        <Badge variant="primary">{post.category}</Badge>
      </div>

      <h3 className={styles.title}>{post.title}</h3>
      <p className={styles.body}>{post.body}</p>

      <div className={styles.actions}>
        <button className={styles.actionBtn}>
          <span className="material-symbols-outlined">thumb_up</span>
          {post.likes}
        </button>
        <button className={styles.actionBtn}>
          <span className="material-symbols-outlined">forum</span>
          {post.comments.length}
        </button>
        <button className={styles.actionBtn}>
          <span className="material-symbols-outlined">share</span>
        </button>
      </div>

      {post.comments.length > 0 && (
        <div className={styles.comments}>
          {post.comments.map(comment => (
            <div key={comment.id} className={styles.comment}>
              <div className={styles.commentAvatar}>
                 {comment.avatarUrl ? (
                  <img src={comment.avatarUrl} alt={comment.author} className={styles.avatarSmall} />
                ) : (
                  <div className={styles.avatarPlaceholderSmall}>{comment.avatarInitials}</div>
                )}
              </div>
              <div className={styles.commentContent}>
                <div className={styles.commentHeader}>
                  <span className={styles.commentAuthor}>{comment.author}</span>
                  <span className={styles.metaTag}>{comment.timeAgo}</span>
                </div>
                <p className={styles.commentBody}>{comment.body}</p>
              </div>
            </div>
          ))}
          <Button variant="secondary" fullWidth className={styles.replyBtn}>Жауап жазу</Button>
        </div>
      )}
    </Card>
  );
};

export default PostCard;
