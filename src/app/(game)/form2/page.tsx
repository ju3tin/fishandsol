"useState"
import { useState } from "react";

export default function Home() {
  const [tweetText, setTweetText] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [tweetUrl, setTweetUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setTweetUrl(null);

    const formData = new FormData();
    formData.append("tweetText", tweetText);
    if (image) formData.append("image", image);

    try {
      const response = await fetch("/api/tweet", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success && data.tweetUrl) {
        setTweetUrl(data.tweetUrl);
        setTweetText("");
        setImage(null);
      } else {
        setErrorMessage("❌ Failed to post tweet.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("❌ An error occurred.");
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Post a Tweet with Image</h1>
      <form onSubmit={handleSubmit} style={{ display: "inline-block", textAlign: "left" }}>
        <textarea
          placeholder="What's happening?"
          rows={3}
          cols={50}
          value={tweetText}
          onChange={(e) => setTweetText(e.target.value)}
          required
        />
        <br />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        <br /><br />
        <button type="submit" disabled={loading}>{loading ? "Tweeting..." : "Tweet"}</button>
      </form>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {tweetUrl && (
        <p>
          ✅ Tweet posted! View it here: <a href={tweetUrl} target="_blank" rel="noopener noreferrer">{tweetUrl}</a>
        </p>
      )}
    </div>
  );
}