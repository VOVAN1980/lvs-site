const demoProfile = {
  id: "acc_vovan1980",
  username: "Volodymyr Podkorytov",
  role: "Founder · LVS / IBITI",
  location: "Windesheim, Germany",
  avatar: "assets/img/default-avatar.png",
  tags: ["Human", "Builder", "Early LVS participant"],
  tc: 0.87,
  vu: 4200,
  stability: 0.93,
  bio: "Early participant of Living Value System. Building autonomous value layer, IBITI ecosystem and real-world services.",
  skills: ["Distributed systems", "Crypto / DeFi", "Rust", "Product strategy"],
  nodes: [
    { id: "node1", label: "Home gateway node" },
    { id: "node2", label: "Mobile browser node" }
  ],
  activity: [
    { ts: "2025-11-27 02:30", text: "Opened LVS account dashboard." },
    { ts: "2025-11-26 22:31", text: "Joined LVS global map (Windesheim)." },
    { ts: "2025-11-26 21:10", text: "Connected browser node to public gateway." }
  ],
  reviews: [
    { author: "LVS System", text: "Stable behaviour and high trust score.", score: 5 },
    { author: "Testnet participant", text: "Fast responses, clear communication.", score: 5 }
  ]
};

function byId(id) {
  return document.getElementById(id);
}

function renderProfile(p) {
  if (byId("profile-avatar") && p.avatar) {
    byId("profile-avatar").src = p.avatar;
  }
  if (byId("profile-name")) byId("profile-name").textContent = p.username;
  if (byId("profile-role")) byId("profile-role").textContent = p.role || "";
  if (byId("profile-location")) byId("profile-location").textContent = p.location || "";

  const tagsEl = byId("profile-tags");
  if (tagsEl) {
    tagsEl.innerHTML = "";
    (p.tags || []).forEach(t => {
      const span = document.createElement("span");
      span.className = "lvs-tag";
      span.textContent = t;
      tagsEl.appendChild(span);
    });
  }

  if (byId("profile-tc")) byId("profile-tc").textContent = `${Math.round(p.tc * 100)}%`;
  if (byId("profile-vu")) byId("profile-vu").textContent = p.vu.toLocaleString("en-US");
  if (byId("profile-stability")) byId("profile-stability").textContent = `${Math.round(p.stability * 100)}%`;

  if (byId("profile-bio")) byId("profile-bio").textContent = p.bio || "";

  const skillsEl = byId("profile-skills");
  if (skillsEl) {
    skillsEl.innerHTML = "";
    (p.skills || []).forEach(s => {
      const li = document.createElement("li");
      li.textContent = s;
      skillsEl.appendChild(li);
    });
  }

  const nodesEl = byId("profile-nodes");
  if (nodesEl) {
    nodesEl.innerHTML = "";
    (p.nodes || []).forEach(n => {
      const li = document.createElement("li");
      li.textContent = `${n.id} — ${n.label}`;
      nodesEl.appendChild(li);
    });
  }

  const actEl = byId("profile-activity");
  if (actEl) {
    actEl.innerHTML = "";
    (p.activity || []).forEach(a => {
      const li = document.createElement("li");
      li.className = "lvs-activity-item";
      li.innerHTML = `
        <span class="lvs-activity-ts">${a.ts}</span>
        <span class="lvs-activity-text">${a.text}</span>
      `;
      actEl.appendChild(li);
    });
  }

  const revEl = byId("profile-reviews");
  if (revEl) {
    revEl.innerHTML = "";
    (p.reviews || []).forEach(r => {
      const li = document.createElement("li");
      li.className = "lvs-review-item";
      li.innerHTML = `
        <div class="lvs-review-header">
          <span class="lvs-review-author">${r.author}</span>
          <span class="lvs-review-score">${"★".repeat(r.score || 5)}</span>
        </div>
        <p class="lvs-review-text">${r.text}</p>
      `;
      revEl.appendChild(li);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderProfile(demoProfile);
});
