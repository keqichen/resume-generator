'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface WorkLog {
  id: string;
  content: string;
  created_at: string;
  log_date?: string;  
}

export default function LogsPage() {
  const [logContent, setLogContent] = useState('');
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from('work_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching logs:', error);
    } else {
      setLogs(data || []);
    }
  };

  const addLog = async () => {
    if (!logContent.trim()) return;
    const { error } = await supabase.from('work_logs').insert([{ content: logContent }]);
    if (error) {
      console.error('Error adding log:', error);
    } else {
      setLogContent('');
      fetchLogs();
    }
  };

  const deleteLog = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this log?');
    if (!confirmed) return;

    const { error } = await supabase.from('work_logs').delete().eq('id', id);
    if (error) {
        console.error('Error deleting log:', error);
    } else {
        fetchLogs();
    }
};

  const startEdit = (log: WorkLog) => {
    setEditingId(log.id);
    setEditContent(log.content);
  };

  const saveEdit = async () => {
    if (!editingId || !editContent.trim()) return;
    const { error } = await supabase
      .from('work_logs')
      .update({ content: editContent })
      .eq('id', editingId);
    if (error) {
      console.error('Error updating log:', error);
    } else {
      setEditingId(null);
      setEditContent('');
      fetchLogs();
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-mono text-2xl font-bold">📒 Work Logs</h1>
        <Link
          href="/"
          className="font-mono px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
        >
          ⬅️ Home
        </Link>
      </div>

      {/* Input Area */}
      <textarea
        className="font-mono w-full h-32 p-2 border border-gray-300 rounded"
        value={logContent}
        onChange={(e) => setLogContent(e.target.value)}
        placeholder="Write your work log..."
      />
      <button
        onClick={addLog}
        disabled={!logContent.trim()} // Disable when no content
        className={`font-mono mt-4 px-4 py-2 rounded ${
          logContent.trim()
            ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        ➕ Add Log
      </button>

      {/* Display Logs */}
      <div className="mt-8 space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="p-4 border rounded bg-gray-50 relative">
            {editingId === log.id ? (
              <>
                <textarea
                  className="font-mono w-full h-24 p-2 border border-gray-300 rounded"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <button
                  onClick={saveEdit}
                  disabled={!editContent.trim() || editContent === logs.find(log => log.id === editingId)?.content}
                  className={`font-mono mt-2 px-4 py-2 rounded ${
                    editContent.trim() && editContent !== logs.find(log => log.id === editingId)?.content
                      ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  💾 Save
                </button>
                <button
                  onClick={() => {
                  setEditingId(null);
                  setEditContent('');
                }}
                  className="font-mono ml-2 px-2 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded cursor-pointer"
                >
                ✖️ Cancel
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-700 whitespace-pre-wrap">{log.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Date: {new Date(log.created_at).toLocaleDateString()}
                </p>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => startEdit(log)}
                    className="text-blue-600 hover:underline text-sm cursor-pointer"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteLog(log.id)}
                    className="text-red-600 hover:underline text-sm cursor-pointer"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
