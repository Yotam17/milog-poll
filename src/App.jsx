import { Routes, Route, Link, Navigate } from "react-router-dom";
import BeautifulWordPoll from "./polls/BeautifulWordPoll.jsx";

function Home() {
  return (
    <main dir="rtl" lang="he" style={{ padding: 24, maxWidth: 1000, margin: "0 auto", color: "#111" }}>
      <h1 style={{ fontSize: 32, fontWeight: 600, marginBottom: 16 }}>סקרים | מילוג</h1>
      <p style={{ fontSize: 18 }}>
        <Link
          to="/המילה-היפה-ביותר-בעברית"
          style={{ color: "#2563eb", textDecoration: "none", borderBottom: "1px solid #93c5fd", paddingBottom: 2 }}
        >
          סקר המילה היפה ביותר בעברית
        </Link>
      </p>
    </main>
  );
}

function ComingSoon() {
  return (
    <main dir="rtl" lang="he" style={{ padding: 24, maxWidth: 1000, margin: "0 auto", color: "#111" }}>
      <h1 style={{ fontSize: 32, fontWeight: 600, marginBottom: 16 }}>סקר: המילה היפה ביותר בעברית</h1>
      <p style={{ fontSize: 18 }}>הסקר יעלה כאן בקרוב.</p>
      <div
        style={{
          marginTop: 20,
          padding: 16,
          border: "1px solid #e0e0e0",
          borderRadius: 14,
          background: "#fafafa",
          fontSize: 16,
        }}
      >
        התוצאות יפורסמו כאן ובאתר של רוביק רוזנטל בשבוע הבא.
      </div>
      <p style={{ marginTop: 18, fontSize: 18 }}>
        <Link
          to="/"
          style={{ color: "#2563eb", textDecoration: "none", borderBottom: "1px solid #93c5fd", paddingBottom: 2 }}
        >
          חזרה לעמוד הסקרים
        </Link>
      </p>
    </main>
  );
}

function NotFound() {
  return (
    <main dir="rtl" lang="he" style={{ padding: 24, maxWidth: 1000, margin: "0 auto", color: "#111" }}>
      <h1 style={{ fontSize: 32, fontWeight: 600, marginBottom: 16 }}>לא נמצא</h1>
      <p style={{ fontSize: 18 }}>
        <Link
          to="/"
          style={{ color: "#2563eb", textDecoration: "none", borderBottom: "1px solid #93c5fd", paddingBottom: 2 }}
        >
          חזרה לעמוד הסקרים
        </Link>
      </p>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/המילה-היפה-ביותר-בעברית" element={<BeautifulWordPoll />} />
      <Route path="/seker" element={<Navigate to="/המילה-היפה-ביותר-בעברית" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
