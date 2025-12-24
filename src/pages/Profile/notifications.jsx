import { useEffect, useState, useRef } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getNotificationHistory } from "../../api/protectedApi";
import { toast } from "react-toastify";

const LIMIT = 10;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loaderRef = useRef(null);

  const fetchNotifications = async (p) => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const res = await getNotificationHistory(p, LIMIT);
      const payload = res?.data;

      if (payload?.success) {
        const newData = payload.data.notifications || [];

        setNotifications((prev) => [...prev, ...newData]);

        if (newData.length < LIMIT) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(page);
  }, [page]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <div className="max-w-[600px] mx-auto min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Page Header */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 font-semibold text-gray-800">
        Notifications
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 no-scrollbar">
        {notifications.length === 0 && !loading && (
          <p className="text-center text-gray-400 text-sm mt-10">
            No notifications
          </p>
        )}

        {notifications.map((item) => (
          <div
            key={item._id}
            className="
              bg-white
              rounded-xl
              p-4
              mb-3
              shadow-sm
              border
              border-gray-200
            "
          >
            <p className="text-sm font-semibold text-gray-900">
              {item.title}
            </p>

            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              {item.body}
            </p>

            <p className="text-[11px] text-gray-400 mt-3 text-right">
              {new Date(item.createdAt).toLocaleString()}
            </p>
          </div>
        ))}

        {/* Loader */}
        {hasMore && (
          <div ref={loaderRef} className="py-6 text-center">
            {loading && (
              <span className="text-xs text-gray-400">
                Loading more...
              </span>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Notifications;
