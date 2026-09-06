const timeAgo = (iso) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const Stat = ({ label, value }) => (
  <div className="bg-slate-50 rounded-lg border border-slate-200 px-4 py-3">
    <p className="text-xs font-medium text-slate-500">{label}</p>
    <p className="mt-1 text-xl font-semibold text-slate-800">{value}</p>
  </div>
);

const AnalyticsPanel = ({ loading, error, analytics }) => {
  if (loading) {
    return <p className="text-sm text-slate-500 py-2">Loading analytics...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600 py-2">{error}</p>;
  }

  if (!analytics) return null;

  const { totalMessages, dailyMessageCount, dailyLimit, remainingToday, recentMessages } = analytics;

  return (
    <div className="space-y-5 py-2">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Sent today" value={dailyMessageCount} />
        <Stat label="Remaining today" value={remainingToday} />
        <Stat label="Daily limit" value={dailyLimit} />
        <Stat label="All-time total" value={totalMessages} />
      </div>

      <div>
        <p className="text-xs font-medium text-slate-500 mb-2">Last 5 messages</p>
        {recentMessages.length === 0 ? (
          <p className="text-sm text-slate-400">No messages received yet.</p>
        ) : (
          <ul className="space-y-2">
            {recentMessages.map((msg) => (
              <li
                key={msg.id}
                className="bg-white rounded-lg border border-slate-200 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-800 truncate">
                    {msg.sender_name || "Anonymous"}{" "}
                    <span className="font-normal text-slate-500">&lt;{msg.sender_email}&gt;</span>
                  </span>
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {timeAgo(msg.created_at)}
                  </span>
                </div>
                {msg.subject && (
                  <p className="mt-1 text-xs font-medium text-slate-600">{msg.subject}</p>
                )}
                <p className="mt-1 text-sm text-slate-600 line-clamp-2">{msg.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPanel;
