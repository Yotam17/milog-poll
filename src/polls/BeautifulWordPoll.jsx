import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import words from "../words";
import { track } from "../analytics";

const POLL_SLUG = "המילה-היפה-ביותר-בעברית";
const STORAGE_KEY = `milog_poll_voted_${POLL_SLUG}_v1`;

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function BeautifulWordPoll() {
  const [hasVoted, setHasVoted] = useState(false);
  const [justVoted, setJustVoted] = useState(false);
  const [customWord, setCustomWord] = useState("");

  const shuffledWords = useMemo(() => shuffle(words), []);

  useEffect(() => {
    const voted = localStorage.getItem(STORAGE_KEY) === "1";
    setHasVoted(voted);

    track("poll_view", { slug: POLL_SLUG });

    if (voted) {
      track("poll_already_voted_view", { slug: POLL_SLUG });
    }
  }, []);

  const submitVote = (payload) => {
    const isDebug =
      window.location.hostname === "localhost" ||
      window.location.search.includes("debug=1");

    // Save to localStorage first
    localStorage.setItem(STORAGE_KEY, "1");

    // Track with callback to ensure event is sent before UI changes
    track("poll_vote", { slug: POLL_SLUG, debug: isDebug, ...payload }, () => {
      setJustVoted(true);
      setHasVoted(true);
    });

    // Fallback: update UI after short delay if callback doesn't fire
    setTimeout(() => {
      setJustVoted(true);
      setHasVoted(true);
    }, 300);
  };

  const handleShare = async () => {
    const shareData = {
      title: "מהי המילה היפה ביותר בעברית?",
      text: "השתתפו בסקר ובחרו את המילה היפה ביותר בעברית",
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== "AbortError") {
          await navigator.clipboard.writeText(window.location.href);
          alert("הקישור הועתק!");
        }
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("הקישור הועתק!");
    }
  };

  if (hasVoted) {
    return (
      <div className="successPage" dir="rtl" lang="he">
        <div className="successCard">
          <div className="successIcon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>

          <h1 className="successTitle">
            {justVoted ? "תודה רבה" : "כבר השתתפת"}
          </h1>

          <p className="successMessage">
            {justVoted
              ? "ההצבעה שלך נקלטה בהצלחה"
              : "ניתן להצביע פעם אחת בלבד"}
          </p>

          <p className="successNote">
            התוצאות יפורסמו בשבוע הבא באתר מילוג ובזירה הלשונית
          </p>

          <button className="successBtn" onClick={handleShare}>
            שיתוף עם חברים
          </button>

          <Link className="successLink" to="/">
            חזרה לעמוד הראשי
          </Link>
        </div>

        <style>{`
          .successPage {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            background: #f8f9fb;
          }
          .successCard {
            width: 100%;
            max-width: 440px;
            background: #fff;
            border-radius: 14px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.06);
            padding: 48px 32px;
            text-align: center;
            animation: fadeIn 200ms ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .successIcon {
            width: 64px;
            height: 64px;
            margin: 0 auto 24px;
            background: #e6f7f2;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #0d9668;
          }
          .successTitle {
            font-size: 28px;
            font-weight: 600;
            color: #111;
            margin: 0 0 8px;
          }
          .successMessage {
            font-size: 17px;
            color: #444;
            margin: 0 0 20px;
            line-height: 1.5;
          }
          .successNote {
            font-size: 15px;
            color: #666;
            margin: 0 0 32px;
            line-height: 1.6;
          }
          .successBtn {
            display: block;
            width: 100%;
            padding: 14px 24px;
            font-size: 16px;
            font-weight: 500;
            color: #fff;
            background: #0d9668;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: background 150ms ease;
          }
          .successBtn:hover {
            background: #0a7d56;
          }
          .successBtn:focus {
            outline: 2px solid #0d9668;
            outline-offset: 2px;
          }
          .successLink {
            display: inline-block;
            margin-top: 20px;
            font-size: 15px;
            color: #666;
            text-decoration: none;
            transition: color 150ms ease;
          }
          .successLink:hover {
            color: #333;
          }
        `}</style>
      </div>
    );
  }

  return (
    <main className="page" dir="rtl" lang="he">
      <header className="header">
        <h1 className="title">מהי המילה היפה ביותר בעברית?</h1>
        <div className="intro">
          <p>
            איך בוחרים את המילה היפה ביותר בעברית? איש אינו סבור ש'חרחור' היא מילה יפה. מילה נאה ומרגשת כמו 'אהבה' נשמעת למרבה הצער מונוטונית וחסרת כוח. למילים יפות יש סגולות הקשורות בצליל המילה, במשחק בין העיצורים והתנועות, ולעיתים בקשר מסתורי עם משמעות המילה. יש להבדיל בין מילה 'אהובה' כמו 'משפחה' שצלילה דווקא אינו נעים לאוזן, או מילה 'חשובה' כמו 'אחריות', לבין מילים שיש להן סגולות יופי.
          </p>
          <p>
            כדי לבחון את טעם הדוברים בשאלת היופי, <a href="https://www.ruvik.co.il/%D7%94%D7%98%D7%95%D7%A8-%D7%94%D7%A9%D7%91%D7%95%D7%A2%D7%99/2026/23126.aspx" target="_blank" rel="noopener noreferrer" className="textLink">הזירה הלשונית</a> ומילוג מכריזים על סקר המילה היפה ביותר בעברית. לצורך הסקר מוצגות 25 מילים שנבחרו על ידינו, וכן ניתנת כמובן אפשרות לבחור מילה שאינה ברשימה. לאחר שיתקבלו התוצאות — עד יום שלישי הבא — הן יפורסמו כאן ובזירה הלשונית.
          </p>
        </div>
      </header>

      <section className="list">
        {shuffledWords.map((word, index) => (
          <button
            key={word}
            className="wordBtn"
            onClick={() =>
              submitVote({
                type: "listed_word",
                word,
                order_index: index,
              })
            }
          >
            {word}
          </button>
        ))}
      </section>

      <section className="card" style={{ marginTop: 14 }}>
        <div className="customTitle">מילה אחרת (שלא הופיעה ברשימה)</div>
        <div className="customRow">
          <input
            className="input"
            type="text"
            placeholder="הקלידו מילה בעברית"
            value={customWord}
            onChange={(e) => setCustomWord(e.target.value)}
            maxLength={40}
          />
          <button
            className="sendBtn"
            disabled={!customWord.trim()}
            onClick={() =>
              submitVote({
                type: "custom_word",
                word: customWord.trim(),
              })
            }
          >
            שליחה
          </button>
        </div>
        <div className="hint">
          אין הצגת תוצאות כעת — הן יפורסמו בשבוע הבא.
        </div>
      </section>

      <div className="shareSection">
        <button className="shareBtn" onClick={handleShare}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          שיתוף הסקר
        </button>
      </div>

      <p className="back">
        <Link className="link" to="/">
          חזרה לעמוד הסקרים
        </Link>
      </p>

      {/* CSS מינימלי מובייל-פירסט */}
      <style>{`
        .page{padding:24px; max-width:1000px; margin:0 auto; color:#111;}
        .header{margin-bottom:24px; text-align:center;}
        .title{font-size:35px; margin:0 0 20px; letter-spacing:-0.3px; font-weight:600;}
        .intro{text-align:right; font-size:17px; line-height:1.75; color:#333; max-width:800px; margin:0 auto;}
        .intro p{margin:0 0 16px;}
        .intro p:last-child{margin-bottom:0;}
        .textLink{color:#2563eb; text-decoration:none; border-bottom:1px solid #93c5fd; padding-bottom:1px; transition:all 120ms ease;}
        .textLink:hover{color:#1d4ed8; border-color:#2563eb;}
        .list{
          display:grid;
          grid-template-columns:repeat(2, 1fr);
          gap:12px;
          margin-top:20px;
        }
        @media(max-width:600px){
          .list{grid-template-columns:1fr;}
        }
        .wordBtn{
          width:100%;
          text-align:center;
          padding:16px 18px;
          border:1px solid #e0e0e0;
          border-radius:12px;
          background:#fff;
          font-size:20px;
          line-height:1.3;
          cursor:pointer;
          transition:all 120ms ease;
        }
        .wordBtn:hover{background:#f8f8f8; border-color:#ccc; transform:translateY(-1px);}
        .wordBtn:active{transform:scale(0.98); background:#f0f0f0;}
        .card{
          padding:18px;
          border:1px solid #e0e0e0;
          border-radius:14px;
          background:#fafafa;
        }
        .customTitle{font-size:17px; color:#333; margin-bottom:12px; font-weight:500;}
        .customRow{display:flex; gap:12px;}
        .input{
          flex:1;
          padding:14px 14px;
          border:1px solid #ddd;
          border-radius:10px;
          font-size:16px;
          outline:none;
          background:#fff;
          transition:border-color 120ms ease;
        }
        .input:focus{border-color:#999;}
        .sendBtn{
          padding:14px 20px;
          border-radius:10px;
          border:none;
          background:#111;
          color:#fff;
          font-size:15px;
          font-weight:500;
          cursor:pointer;
          min-width:90px;
          transition:background 120ms ease;
        }
        .sendBtn:hover{background:#333;}
        .sendBtn:disabled{opacity:0.4; cursor:not-allowed;}
        .hint{margin-top:12px; font-size:14px; color:#777;}
        .shareSection{margin-top:24px; text-align:center;}
        .back{margin-top:24px; font-size:14px; text-align:center;}
        .link{color:#555; text-decoration:none; border-bottom:1px solid #ccc; padding-bottom:1px; transition:all 120ms ease;}
        .link:hover{color:#111; border-color:#999;}

        /* Thank you screen styles */
        .thankYouContent{
          display:flex;
          flex-direction:column;
          align-items:center;
          text-align:center;
          padding:60px 20px;
        }
        .thankYouIcon{
          width:100px;
          height:100px;
          border-radius:50%;
          background:linear-gradient(135deg, #10b981 0%, #059669 100%);
          color:#fff;
          display:flex;
          align-items:center;
          justify-content:center;
          margin-bottom:32px;
          box-shadow:0 12px 32px rgba(16,185,129,0.3);
        }
        .thankYouTitle{
          font-size:48px;
          font-weight:700;
          margin:0 0 16px;
          letter-spacing:-0.5px;
          color:#111;
        }
        .thankYouMessage{
          font-size:24px;
          color:#444;
          margin:0;
          font-weight:400;
        }
        .thankYouDivider{
          width:60px;
          height:3px;
          background:linear-gradient(90deg, #e0e0e0, #ccc, #e0e0e0);
          border-radius:2px;
          margin:28px 0;
        }
        .thankYouSubtext{
          font-size:19px;
          color:#555;
          margin:0;
          max-width:450px;
          line-height:1.7;
        }
        .thankYouActions{
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:20px;
          margin-top:40px;
          width:100%;
          max-width:360px;
        }
        .shareBtnLarge{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:12px;
          width:100%;
          padding:18px 32px;
          border-radius:14px;
          border:none;
          background:linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color:#fff;
          font-size:18px;
          font-weight:600;
          cursor:pointer;
          transition:all 150ms ease;
          box-shadow:0 6px 20px rgba(37,99,235,0.35);
        }
        .shareBtnLarge:hover{transform:translateY(-2px); box-shadow:0 8px 28px rgba(37,99,235,0.45);}
        .shareBtnLarge:active{transform:translateY(0);}
        .backLinkBtn{
          display:inline-block;
          padding:14px 28px;
          font-size:17px;
          font-weight:500;
          color:#555;
          text-decoration:none;
          background:#f5f5f5;
          border-radius:12px;
          transition:all 120ms ease;
        }
        .backLinkBtn:hover{background:#eee; color:#333;}
        .shareBtn{
          display:inline-flex;
          align-items:center;
          gap:10px;
          padding:14px 32px;
          border-radius:50px;
          border:none;
          background:linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color:#fff;
          font-size:16px;
          font-weight:500;
          cursor:pointer;
          transition:all 150ms ease;
          box-shadow:0 4px 14px rgba(37,99,235,0.35);
        }
        .shareBtn:hover{transform:translateY(-2px); box-shadow:0 6px 20px rgba(37,99,235,0.4);}
        .shareBtn:active{transform:translateY(0);}
        .backLink{
          display:inline-block;
          margin-top:32px;
          font-size:15px;
          color:#666;
          text-decoration:none;
          border-bottom:1px solid #ddd;
          padding-bottom:2px;
          transition:all 120ms ease;
        }
        .backLink:hover{color:#111; border-color:#999;}
      `}</style>
    </main>
  );
}
