import { useEffect, useState } from "react";
import { Timeline, Spin, Tag, Empty } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { getApplicationComments } from "../services/commentService";

const ApplicationCommentsTab = ({ applicationId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (applicationId) {
      fetchComments();
    }
  }, [applicationId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getApplicationComments(applicationId);
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const getCommentTypeColor = (type) => {
    const colors = {
      REJECTION: "red",
      REVISION: "purple",
      VERIFICATION: "green",
      VALIDATION: "blue",
      GENERAL: "default",
    };
    return colors[type] || "default";
  };

  const getCommentTypeLabel = (type) => {
    const labels = {
      REJECTION: "Penolakan",
      REVISION: "Revisi",
      VERIFICATION: "Verifikasi",
      VALIDATION: "Validasi",
      GENERAL: "Umum",
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spin size="large" tip="Memuat komentar..." />
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Belum ada komentar"
      >
        <p className="text-gray-500 text-sm">
          Komentar dari verifikator/validator akan muncul di sini
        </p>
      </Empty>
    );
  }

  const timelineItems = comments.map((comment) => ({
    color: getCommentTypeColor(comment.comment_type),
    dot: <MessageOutlined />,
    children: (
      <div className="pb-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Tag color={getCommentTypeColor(comment.comment_type)}>
            {getCommentTypeLabel(comment.comment_type)}
          </Tag>
          {comment.template && (
            <Tag color="blue">{comment.template.template_name}</Tag>
          )}
        </div>
        <div
          className={`p-3 rounded border ${
            comment.comment_type === "REJECTION"
              ? "bg-red-50 border-red-200"
              : comment.comment_type === "REVISION"
              ? "bg-purple-50 border-purple-200"
              : comment.comment_type === "VERIFICATION"
              ? "bg-green-50 border-green-200"
              : comment.comment_type === "VALIDATION"
              ? "bg-blue-50 border-blue-200"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="text-sm whitespace-pre-wrap">
            {comment.comment_text}
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          <strong>{comment.commenter?.full_name || "System"}</strong>
          {" • "}
          {new Date(comment.createdAt).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Asia/Jakarta",
          })}
        </div>
      </div>
    ),
  }));

  return (
    <div>
      <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
        <h4 className="font-medium mb-1 flex items-center">Riwayat Komentar</h4>
        <p className="text-sm text-gray-600">
          Total {comments.length} komentar dari verifikator/validator
        </p>
      </div>
      <Timeline mode="left" items={timelineItems} />
    </div>
  );
};

export default ApplicationCommentsTab;
