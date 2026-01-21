import { Routes, Route, Link } from "react-router-dom";

function Home() {
  return (
    <main style={{ padding: 24, maxWidth: 720 }}>
      <h1>סקרים | מילוג</h1>
      <p>
        <Link to="/המילה-היפה-ביותר-בעברית">סקר המילה היפה ביותר בעברית</Link>
      </p>
    </main>
  );
}

function ComingSoon() {
  return (
    <main style={{ padding: 24, maxWidth: 720 }} dir="rtl" lang="he">
      <h1>סקר: המילה היפה ביותר בעברית</h1>
      <p>הסקר יעלה כאן בקרוב.</p>
      <div
        style={{
          marginTop: 20,
          padding: 16,
          border: "1px solid #ddd",
          borderRadius: 14,
        }}
      >
        התוצאות יפורסמו כאן ובאתר של רוביק רוזנטל בשבוע הבא.
      </div>
      <p style={{ marginTop: 18 }}>
        <Link to="/">חזרה לעמוד הסקרים</Link>
      </p>
    </main>
  );
}

function NotFound() {
  return (
    <main style={{ padding: 24, maxWidth: 720 }}>
      <h1>לא נמצא</h1>
      <p>
        <Link to="/">חזרה לעמוד הסקרים</Link>
      </p>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/המילה-היפה-ביותר-בעברית" element={<ComingSoon />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
