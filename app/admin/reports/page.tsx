"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Report {
  _id: string;
  reason: string;
  createdAt: string;
  reporterId: {
    name: string;
    username: string;
  };
  reviewId: {
    reviewText: string;
    userId: {
      name: string;
      username: string;
    };
  };
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/admin/reports");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setReports(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

 const handleAction = async (
  reportId: string,
  action: "approve" | "reject"
) => {
  toast((t) => (
    <div className="flex flex-col gap-2">
      <p className="text-sm">
        {action === "approve"
          ? "This will DELETE the review. Continue?"
          : "Reject this report?"}
      </p>

      <div className="flex gap-2 justify-end">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3 py-1 text-sm bg-gray-300 rounded"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            toast.dismiss(t.id);

            try {
              const res = await fetch(`/api/admin/reports/${reportId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action }),
              });

              const data = await res.json();
              if (!res.ok) throw new Error(data.error);

              toast.success(`Report ${action}d`);
              setReports((prev) =>
                prev.filter((r) => r._id !== reportId)
              );
            } catch (err: any) {
              toast.error(err.message || "Action failed");
            }
          }}
          className={`px-3 py-1 text-sm rounded text-white ${
            action === "approve"
              ? "bg-red-600"
              : "bg-gray-700"
          }`}
        >
          Confirm
        </button>
      </div>
    </div>
  ), { duration: Infinity });
};


  if (loading) {
    return <p>Loading reports...</p>;
  }

  if (reports.length === 0) {
    return <p>No pending reports 🎉</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pending Reports</h1>

      <div className="space-y-6">
        {reports.map((r) => (
          <div
            key={r._id}
            className="bg-black p-5 rounded shadow border"
          >
            <p className="text-sm text-gray-500 mb-2">
              Reported by:{" "}
              <b>
                {r.reporterId.name} (@{r.reporterId.username})
              </b>
            </p>

            <p className="text-sm text-gray-500 mb-2">
              Review by:{" "}
              <b>
                {r.reviewId.userId.name} (@
                {r.reviewId.userId.username})
              </b>
            </p>

            <p className="mb-3">
              <b>Reason:</b> {r.reason}
            </p>

            <div className="bg-black-100 p-3 rounded mb-4">
              {r.reviewId.reviewText}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleAction(r._id, "approve")}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Approve (Delete Review)
              </button>

              <button
                onClick={() => handleAction(r._id, "reject")}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
