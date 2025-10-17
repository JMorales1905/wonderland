'use client';

export default function TestButton() {
  const testConnection = async () => {
    const res = await fetch('/api/test-db');
    const data = await res.json();
    console.log(data);
  };

  return <button onClick={testConnection}>Test DB Connection</button>;
}