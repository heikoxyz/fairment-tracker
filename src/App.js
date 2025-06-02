import React, { useState, useEffect } from "react";

const habits = [
  "Guter Stuhlgang",
  "Mindestens 2 Liter Flüssigkeit getrunken",
  "Alkoholfrei",
  "Zucker- und Süßigkeitenfrei",
  "Keine Fertigprodukte mit mehr als 3 Zutaten gegessen",
  "Kein glutenhaltiges Getreide gegessen",
  "Keine unfermentierten Milchprodukte gegessen",
  "Super-Mikroben eingenommen",
  "Mindestens 1 Ferment gegessen",
  "Präbiotika eingenommen",
  "Alle Mahlzeiten vor 19h gegessen",
  "Vor 22:30h im Bett gewesen oder min. 8 Stunden geschlafen",
  "Mehr als 45 Minuten spaziert oder 15 Minuten Sport gemacht",
];

const days = Array.from({ length: 30 }, (_, i) => i + 1);
const allowedUsers = {
  Heiko: "blubber",
  Margit: "blubber",
};

const getInitialState = (username) => {
  const saved = localStorage.getItem(`habitData_${username}`);
  try {
    const parsed = saved ? JSON.parse(saved) : null;
    if (!Array.isArray(parsed) || parsed.length !== habits.length) {
      return habits.map(() => Array(30).fill(""));
    }
    return parsed.map((row) =>
      Array.isArray(row) && row.length === 30 ? row : Array(30).fill("")
    );
  } catch {
    return habits.map(() => Array(30).fill(""));
  }
};

export default function HabitTrackerApp() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(habits.map(() => Array(30).fill("")));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      const initialData = getInitialState(user);
      setData(initialData);
    }
  }, [user]);

  useEffect(() => {
    if (user && data.length === habits.length) {
      localStorage.setItem(`habitData_${user}`, JSON.stringify(data));
    }
  }, [data, user]);

  const cycleColor = (habitIdx, dayIdx) => {
    const newData = [...data.map((row) => [...row])];
    const current = newData[habitIdx][dayIdx];
    const next =
      current === ""
        ? "green"
        : current === "green"
        ? "yellow"
        : current === "yellow"
        ? "red"
        : "";
    newData[habitIdx][dayIdx] = next;
    setData(newData);
  };

  const handleLogin = () => {
    if (allowedUsers[username] === password) {
      setUser(username);
      setError("");
    } else {
      setError("Falscher Benutzername oder Passwort");
    }
  };

  if (!user) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          type="text"
          placeholder="Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Login
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Tägliche Routine Tracker – {user}
      </h1>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse text-sm">
          <thead>
            <tr>
              <th className="text-left p-2">Tägliche Routine / Tag</th>
              {days.map((day) => (
                <th key={day} className="p-2 text-center whitespace-nowrap">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map((habit, i) => (
              <tr key={i} className="border-t">
                <td className="p-2 whitespace-nowrap text-left">{habit}</td>
                {days.map((_, j) => (
                  <td key={j} className="p-1 text-center">
                    <button
                      onClick={() => cycleColor(i, j)}
                      className={`w-6 h-6 rounded-full border border-gray-400 ${
                        data[i][j] === "green"
                          ? "bg-green-400"
                          : data[i][j] === "yellow"
                          ? "bg-yellow-300"
                          : data[i][j] === "red"
                          ? "bg-red-400"
                          : ""
                      }`}
                    ></button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
