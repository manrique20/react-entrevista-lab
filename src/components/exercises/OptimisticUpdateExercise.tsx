'use client';

import React, { useState, useTransition } from 'react';
import {
  Heart,
  Bookmark,
  MessageSquare,
  Send,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  Code2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CommentItem {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  isPending?: boolean;
}

export function OptimisticUpdateExercise() {
  // Server / true state
  const [likes, setLikes] = useState<number>(42);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: 'c1',
      author: 'Carlos Dev',
      text: 'Excellent breakdown of concurrency and transitions in React 19.',
      timestamp: '10 min ago'
    },
    {
      id: 'c2',
      author: 'Elena Frontend',
      text: 'The rollback pattern is essential for a flawless UX.',
      timestamp: '3 min ago'
    }
  ]);

  // Lab controls
  const [newCommentText, setNewCommentText] = useState('');
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showCode, setShowCode] = useState(false);

  // API simulation with delayed promise
  const fakeApiCall = async (shouldFail: boolean, delayMs = 1200): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          reject(new Error('HTTP 500: Database persistence failure'));
        } else {
          resolve(true);
        }
      }, delayMs);
    });
  };

  // Handle Like with Optimistic Update + Rollback
  const handleToggleLike = async () => {
    if (isSyncing) return;

    // 1. Snapshot previous state for possible rollback
    const prevLikes = likes;
    const prevHasLiked = hasLiked;

    // 2. Immediate OPTIMISTIC update (0ms perceived latency)
    const nextHasLiked = !hasLiked;
    const nextLikes = nextHasLiked ? likes + 1 : likes - 1;

    setHasLiked(nextHasLiked);
    setLikes(nextLikes);
    setIsSyncing(true);
    setNotification(null);

    if (nextHasLiked) {
      confetti({ particleCount: 25, spread: 45, origin: { y: 0.7 } });
    }

    try {
      // 3. Background server request
      await fakeApiCall(simulateFailure);
      setIsSyncing(false);
      setNotification({ type: 'success', message: '✓ Server synced successfully.' });
    } catch (err: any) {
      // 4. Automatic ROLLBACK if the server fails
      setLikes(prevLikes);
      setHasLiked(prevHasLiked);
      setIsSyncing(false);
      setNotification({
        type: 'error',
        message: `❌ Server error (${err.message}). Rolled back Like to previous state.`
      });
    }
  };

  // Handle Optimistic Bookmark
  const handleToggleBookmark = async () => {
    if (isSyncing) return;

    const prevBookmark = isBookmarked;
    const nextBookmark = !isBookmarked;

    // Immediate update
    setIsBookmarked(nextBookmark);
    setIsSyncing(true);
    setNotification(null);

    try {
      await fakeApiCall(simulateFailure);
      setIsSyncing(false);
      setNotification({ type: 'success', message: '✓ Bookmark updated in your profile.' });
    } catch (err: any) {
      // Rollback
      setIsBookmarked(prevBookmark);
      setIsSyncing(false);
      setNotification({
        type: 'error',
        message: '❌ Could not save bookmark. Automatically rolled back.'
      });
    }
  };

  // Handle Optimistic Comment Submission
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || isSyncing) return;

    const commentId = `temp-${Date.now()}`;
    const optimisticComment: CommentItem = {
      id: commentId,
      author: 'You (Candidate)',
      text: newCommentText.trim(),
      timestamp: 'Just now',
      isPending: true
    };

    const prevComments = [...comments];

    // 1. Optimistically insert into comments list
    setComments(prev => [optimisticComment, ...prev]);
    setNewCommentText('');
    setIsSyncing(true);
    setNotification(null);

    try {
      await fakeApiCall(simulateFailure);
      // 2. Mark as confirmed by server
      setComments(prev =>
        prev.map(c => (c.id === commentId ? { ...c, isPending: false } : c))
      );
      setIsSyncing(false);
      setNotification({ type: 'success', message: '✓ Comment posted to server successfully.' });
    } catch (err: any) {
      // 3. Rollback: remove optimistic comment that failed
      setComments(prevComments);
      setIsSyncing(false);
      setNotification({
        type: 'error',
        message: '❌ Failed to save comment. Removed from optimistic list.'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Lab Configuration Controls */}
      <div className="p-4 rounded-2xl bg-muted/30 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-foreground">
              Network & Server Failure Simulator
            </span>
          </div>
          <p className="text-xs text-muted">
            Toggle the switch to see how the UI applies changes instantly and performs a clean rollback if the server responds with an error.
          </p>
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none bg-card px-3.5 py-2 rounded-xl border border-border/80 hover:border-primary/50 transition-all shrink-0">
          <input
            type="checkbox"
            checked={simulateFailure}
            onChange={e => setSimulateFailure(e.target.checked)}
            className="w-4 h-4 text-rose-600 rounded border-gray-300 focus:ring-rose-500"
          />
          <div className="text-xs">
            <span className={`font-bold block ${simulateFailure ? 'text-rose-600 dark:text-rose-400' : 'text-foreground'}`}>
              {simulateFailure ? 'Mode: Network Failure (500 Error)' : 'Mode: Successful Connection (200 OK)'}
            </span>
            <span className="text-[10px] text-muted">
              {simulateFailure ? 'Force server error' : 'Server responds OK'}
            </span>
          </div>
        </label>
      </div>

      {/* Sync Status Banner */}
      {isSyncing && (
        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-600 dark:text-blue-400 flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2 font-semibold">
            <Clock className="w-4 h-4 animate-spin" />
            <span>Syncing optimistic mutation with backend (1.2s)...</span>
          </span>
          <span className="text-[10px] font-mono uppercase bg-blue-500/20 px-2 py-0.5 rounded">
            Simulated Latency
          </span>
        </div>
      )}

      {notification && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 animate-in fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300 font-semibold'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-[10px] underline hover:opacity-80"
          >
            Close
          </button>
        </div>
      )}

      {/* Interactive Post Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-6 shadow-sm">
        {/* Post Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="font-bold text-foreground">React Architecture Lab</span>
            <span>•</span>
            <span>Published today</span>
          </div>
          <h3 className="text-xl font-black text-foreground">
            Optimistic UI Architecture in React 19: Zero Latency with a Safety Net
          </h3>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            Modern interfaces do not make users wait on blocking spinners for predictable actions. We update the Virtual DOM in 0ms and queue the mutation in the background. If the network fails, we roll back cleanly.
          </p>
        </div>

        {/* Post Actions Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-border/60">
          <div className="flex items-center gap-3">
            {/* Like Button */}
            <button
              onClick={handleToggleLike}
              disabled={isSyncing}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                hasLiked
                  ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 shadow-xs scale-105'
                  : 'bg-muted/40 hover:bg-muted text-foreground border-border/80'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current text-rose-500' : 'text-muted'}`} />
              <span>{likes}</span>
              <span className="text-[11px] font-normal text-muted">{hasLiked ? 'Liked' : 'Like'}</span>
            </button>

            {/* Comment Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/30 text-xs font-semibold text-muted">
              <MessageSquare className="w-4 h-4" />
              <span>{comments.length} comments</span>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleToggleBookmark}
            disabled={isSyncing}
            className={`p-2 rounded-xl text-xs font-semibold transition-all border ${
              isBookmarked
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                : 'bg-muted/40 hover:bg-muted text-muted hover:text-foreground border-border/80'
            }`}
            title={isBookmarked ? 'Saved to bookmarks' : 'Save bookmark'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-amber-500' : ''}`} />
          </button>
        </div>

        {/* Optimistic Comments Section */}
        <div className="space-y-4 pt-4 border-t border-border/60">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Real-Time Comments ({comments.length})
          </h4>

          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={newCommentText}
              onChange={e => setNewCommentText(e.target.value)}
              placeholder="Write an optimistic comment..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-border/80 bg-background text-xs focus:outline-none focus:border-primary transition-colors placeholder:text-muted"
            />
            <button
              type="submit"
              disabled={!newCommentText.trim() || isSyncing}
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm shadow-primary/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Comment</span>
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {comments.map(c => (
              <div
                key={c.id}
                className={`p-3 rounded-xl border transition-all text-xs space-y-1 ${
                  c.isPending
                    ? 'bg-amber-500/5 border-amber-500/30 ring-1 ring-amber-500/20 opacity-80'
                    : 'bg-muted/20 border-border/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">{c.author}</span>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted">
                    {c.isPending && (
                      <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 animate-spin" />
                        <span>Sending...</span>
                      </span>
                    )}
                    <span>{c.timestamp}</span>
                  </div>
                </div>
                <p className="text-muted leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Code and Mental Model Snippet */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-2">
        <button
          onClick={() => setShowCode(!showCode)}
          className="flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
        >
          <Code2 className="w-4 h-4" />
          <span>{showCode ? 'Hide implementation snippet' : 'View senior pattern with useOptimistic / Rollback'}</span>
        </button>

        {showCode && (
          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 text-slate-100 font-mono text-xs overflow-x-auto shadow-inner mt-2">
            <pre className="text-emerald-300 leading-relaxed">
{`// Canonical pattern with Snapshot + Rollback:
const handleOptimisticUpdate = async () => {
  // 1. Save snapshot of previous state
  const previousState = state;

  // 2. Apply change to UI immediately
  setState(computeNextState(previousState));

  try {
    // 3. Send mutation to server in background
    await api.persistChange();
  } catch (error) {
    // 4. If network or DB fails, revert to previous snapshot
    setState(previousState);
    toast.error('Operation failed, changes rolled back');
  }
};

// In React 19 with native useOptimistic hook:
// const [optimisticLikes, setOptimisticLikes] = useOptimistic(
//   likes,
//   (current, update) => current + update
// );`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
