"use client"
import { useState } from "react";

export default function Home() {
  const [tweetText, setTweetText] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("tweetText", tweetText);
    if (image) formData.append("image", image);

    try {
      const response = await fetch("/api/tweet", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setMessage("✅ Tweet posted successfully!");
        setTweetText("");
        setImage(null);
      } else {
        setMessage("❌ Failed to post tweet.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ An error occurred.");
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
      {message && <p>{message}</p>}
    </div>
  );
}