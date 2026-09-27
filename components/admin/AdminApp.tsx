"use client";

import { useEffect, useState } from "react";
import { apiBase, getJson, mediaSrc } from "@/lib/api";
import type { Education, Experience, HomePayload, MediaRef, Project, SkillGroup, WorkflowStep } from "@/lib/types";

const TOKEN_KEY = "signal-admin-token";

async function adminSend(path: string, token: string, method: string, body?: unknown) {
  const response = await fetch(`${apiBase()}${path}`, {
    method,
    headers: {
      "X-Admin-Token": token,
      ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    },
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json();
}

export default function AdminApp() {
  const [token, setToken] = useState("");
  const [draft, setDraft] = useState("");
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState("dashboard");
  const [home, setHome] = useState<HomePayload | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<SkillGroup[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [workflow, setWorkflow] = useState<WorkflowStep[]>([]);
  const [uploaded, setUploaded] = useState<MediaRef | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(TOKEN_KEY) || "";
    if (!saved) return;
    setToken(saved);
    setDraft(saved);
    setReady(true);
  }, []);

  async function refresh() {
    const [homeData, projectData, skillData, educationData, experienceData, workflowData] = await Promise.all([
      getJson<HomePayload>("/api/home"),
      getJson<Project[]>("/api/projects"),
      getJson<SkillGroup[]>("/api/skills"),
      getJson<Education[]>("/api/education"),
      getJson<Experience[]>("/api/experience"),
      getJson<WorkflowStep[]>("/api/workflow"),
    ]);
    setHome(homeData);
    setProjects(projectData);
    setSkills(skillData);
    setEducation(educationData);
    setExperience(experienceData);
    setWorkflow(workflowData);
  }

  useEffect(() => {
    if (!ready) return;
    refresh().catch(() => setMessage("Could not load portfolio data."));
  }, [ready]);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    try {
      await adminSend("/api/admin/session", draft, "GET");
      sessionStorage.setItem(TOKEN_KEY, draft);
      setToken(draft);
      setReady(true);
    } catch {
      setMessage("That token was rejected.");
    }
  }

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken("");
    setReady(false);
    setHome(null);
  }

  if (!ready) {
    return (
      <main className="admin-shell">
        <h1>Admin</h1>
        <form onSubmit={login} className="surface">
          <label className="field">
            Token
            <input type="password" value={draft} onChange={(event) => setDraft(event.target.value)} autoComplete="current-password" />
          </label>
          <button className="btn" type="submit">Sign in</button>
          {message && <p className="state-error">{message}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <div className="row-actions">
        <h1>Admin</h1>
        <button className="btn-secondary" type="button" onClick={logout}>Log out</button>
      </div>
      <nav className="admin-nav" aria-label="Admin sections">
        {["dashboard", "profile", "projects", "skills", "proof", "workflow", "upload"].map((item) => (
          <button key={item} type="button" className={`filter ${tab === item ? "is-on" : ""}`} onClick={() => setTab(item)}>
            {item}
          </button>
        ))}
      </nav>
      {message && <p>{message}</p>}
      {tab === "dashboard" && home && (
        <section className="metrics">
          <a className="metric" href="#projects" onClick={() => setTab("projects")}><strong>{home.stats.projects}</strong><span>Projects</span></a>
          <a className="metric" href="#proof" onClick={() => setTab("proof")}><strong>{home.stats.achievements}</strong><span>Achievements</span></a>
          <a className="metric" href="#proof" onClick={() => setTab("proof")}><strong>{home.stats.certificates}</strong><span>Certificates</span></a>
          <a className="metric" href="#skills" onClick={() => setTab("skills")}><strong>{skills.reduce((sum, group) => sum + group.skills.length, 0)}</strong><span>Skills</span></a>
        </section>
      )}
      {tab === "profile" && home?.contact && (
        <ProfileForms token={token} home={home} onSaved={refresh} setMessage={setMessage} />
      )}
      {tab === "projects" && (
        <ProjectForm token={token} projects={projects} uploaded={uploaded} onSaved={refresh} setMessage={setMessage} />
      )}
      {tab === "skills" && <SkillForm token={token} groups={skills} onSaved={refresh} setMessage={setMessage} />}
      {tab === "proof" && (
        <ProofForms
          token={token}
          education={education}
          experience={experience}
          uploaded={uploaded}
          onSaved={refresh}
          setMessage={setMessage}
        />
      )}
      {tab === "workflow" && <WorkflowForm token={token} steps={workflow} onSaved={refresh} setMessage={setMessage} />}
      {tab === "upload" && (
        <UploadWidget
          token={token}
          uploaded={uploaded}
          setUploaded={setUploaded}
          setMessage={setMessage}
          onSaved={refresh}
        />
      )}
    </main>
  );
}

function ProfileForms({
  token,
  home,
  onSaved,
  setMessage,
}: {
  token: string;
  home: HomePayload;
  onSaved: () => Promise<void>;
  setMessage: (value: string) => void;
}) {
  const [name, setName] = useState(home.profile.name);
  const [tagline, setTagline] = useState(home.profile.tagline);
  const [email, setEmail] = useState(home.contact?.email || "");

  async function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    await adminSend("/api/admin/profile", token, "PUT", { name, tagline });
    await adminSend("/api/admin/contact", token, "PUT", { email });
    setMessage("Profile saved.");
    await onSaved();
  }

  return (
    <form className="surface" onSubmit={saveProfile}>
      <label className="field">Name<input value={name} onChange={(event) => setName(event.target.value)} /></label>
      <label className="field">Tagline<textarea value={tagline} onChange={(event) => setTagline(event.target.value)} /></label>
      <label className="field">Email<input value={email} onChange={(event) => setEmail(event.target.value)} /></label>
      <button className="btn" type="submit">Save profile</button>
    </form>
  );
}

function ProjectForm({
  token,
  projects,
  uploaded,
  onSaved,
  setMessage,
}: {
  token: string;
  projects: Project[];
  uploaded: MediaRef | null;
  onSaved: () => Promise<void>;
  setMessage: (value: string) => void;
}) {
  const [id, setId] = useState(projects[0]?.id || 0);
  const current = projects.find((item) => item.id === id) || projects[0];
  const [title, setTitle] = useState(current?.title || "");
  const [featured, setFeatured] = useState(current?.featured || false);
  const [problem, setProblem] = useState(current?.problem || "");
  const [description, setDescription] = useState(current?.description || "");
  const [technologies, setTechnologies] = useState(current?.technologies.join(", ") || "");
  const [github, setGithub] = useState(current?.links.find((link) => link.label === "GitHub")?.url || "");
  const [live, setLive] = useState(current?.links.find((link) => link.label === "Live")?.url || "");
  const [coverId, setCoverId] = useState<number | "">(current?.cover?.id || "");

  useEffect(() => {
    if (!current) return;
    setTitle(current.title);
    setFeatured(current.featured);
    setProblem(current.problem);
    setDescription(current.description);
    setTechnologies(current.technologies.join(", "));
    setGithub(current.links.find((link) => link.label === "GitHub")?.url || "");
    setLive(current.links.find((link) => link.label === "Live")?.url || "");
    setCoverId(current.cover?.id || "");
  }, [current]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!current) return;
    const links = [];
    if (github) links.push({ label: "GitHub", url: github });
    if (live) links.push({ label: "Live", url: live });
    await adminSend(`/api/admin/projects/${current.id}`, token, "PUT", {
      title,
      slug: current.slug,
      description,
      problem,
      role: current.role,
      outcome: current.outcome,
      featured,
      status: current.status,
      stage: current.stage,
      progress: current.progress,
      category: current.category,
      impact: current.impact,
      team: current.team,
      technologies: technologies.split(",").map((item) => item.trim()).filter(Boolean),
      links,
      cover_media_id: coverId === "" ? null : Number(coverId),
      demo_media_id: current.demoVideo?.id || null,
      gallery_media_ids: current.gallery.map((item) => item.id),
    });
    setMessage("Project saved.");
    await onSaved();
  }

  return (
    <form id="projects" className="surface" onSubmit={save}>
      <label className="field">
        Project
        <select value={id} onChange={(event) => setId(Number(event.target.value))}>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>{project.title}</option>
          ))}
        </select>
      </label>
      <label className="field">Title<input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
      <label className="field">Problem<textarea value={problem} onChange={(event) => setProblem(event.target.value)} /></label>
      <label className="field">Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} /></label>
      <label className="field">Technologies<input value={technologies} onChange={(event) => setTechnologies(event.target.value)} /></label>
      <label className="field">GitHub<input value={github} onChange={(event) => setGithub(event.target.value)} /></label>
      <label className="field">Live<input value={live} onChange={(event) => setLive(event.target.value)} /></label>
      <label className="field">
        Featured
        <input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} />
      </label>
      <label className="field">
        Cover media id
        <input value={coverId} onChange={(event) => setCoverId(event.target.value ? Number(event.target.value) : "")} />
      </label>
      {uploaded && <button type="button" className="btn-secondary" onClick={() => setCoverId(uploaded.id)}>Use last upload as cover</button>}
      <div className="row-actions">
        <button className="btn" type="submit">Save project</button>
        <button
          className="btn-secondary"
          type="button"
          onClick={async () => {
            const ids = projects.map((project) => project.id);
            if (ids.length < 2) return;
            const next = [ids[1], ids[0], ...ids.slice(2)];
            await adminSend("/api/admin/reorder", token, "POST", { entity: "projects", ids: next });
            setMessage("Project order updated.");
            await onSaved();
          }}
        >
          Swap first two
        </button>
      </div>
    </form>
  );
}

function SkillForm({
  token,
  groups,
  onSaved,
  setMessage,
}: {
  token: string;
  groups: SkillGroup[];
  onSaved: () => Promise<void>;
  setMessage: (value: string) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("AI & ML Frameworks");
  const [icon, setIcon] = useState("");
  const [editId, setEditId] = useState<number | "">("");
  const [editIcon, setEditIcon] = useState("");
  const flat = groups.flatMap((group) => group.skills.map((skill) => ({ ...skill, category: group.category })));

  async function save(event: React.FormEvent) {
    event.preventDefault();
    await adminSend("/api/admin/skills", token, "POST", { name, category, icon, project_ids: [] });
    setName("");
    setIcon("");
    setMessage("Skill added.");
    await onSaved();
  }

  async function saveIcon(event: React.FormEvent) {
    event.preventDefault();
    const skill = flat.find((item) => item.id === editId);
    if (!skill) return;
    await adminSend(`/api/admin/skills/${skill.id}`, token, "PUT", {
      name: skill.name,
      category: skill.category,
      icon: editIcon,
    });
    setMessage("Skill icon saved.");
    await onSaved();
  }

  return (
    <div id="skills">
      <form className="surface" onSubmit={save}>
        <label className="field">Category<input value={category} onChange={(event) => setCategory(event.target.value)} /></label>
        <label className="field">Skill<input value={name} onChange={(event) => setName(event.target.value)} required /></label>
        <label className="field">Icon key<input value={icon} onChange={(event) => setIcon(event.target.value)} placeholder="SiPython" /></label>
        <button className="btn" type="submit">Add skill</button>
      </form>
      <form className="surface" onSubmit={saveIcon} style={{ marginTop: "1rem" }}>
        <label className="field">
          Existing skill
          <select
            value={editId}
            onChange={(event) => {
              const next = Number(event.target.value);
              const skill = flat.find((item) => item.id === next);
              setEditId(next || "");
              setEditIcon(skill?.icon || "");
            }}
          >
            <option value="">Choose a skill</option>
            {flat.map((skill) => (
              <option key={skill.id} value={skill.id}>{skill.name}</option>
            ))}
          </select>
        </label>
        <label className="field">Icon key<input value={editIcon} onChange={(event) => setEditIcon(event.target.value)} placeholder="SiPython" /></label>
        <button className="btn" type="submit" disabled={editId === ""}>Save icon</button>
      </form>
    </div>
  );
}

function ProofForms({
  token,
  education,
  experience,
  uploaded,
  onSaved,
  setMessage,
}: {
  token: string;
  education: Education[];
  experience: Experience[];
  uploaded: MediaRef | null;
  onSaved: () => Promise<void>;
  setMessage: (value: string) => void;
}) {
  const [degree, setDegree] = useState("");
  const [institution, setInstitution] = useState("");
  const [eventName, setEventName] = useState("");
  const [caption, setCaption] = useState("Certificate");

  return (
    <div id="proof" className="timeline">
      <form
        className="surface"
        onSubmit={async (event) => {
          event.preventDefault();
          await adminSend("/api/admin/education", token, "POST", { degree, institution, university: "" });
          setDegree("");
          setInstitution("");
          setMessage("Education added.");
          await onSaved();
        }}
      >
        <h2>Education</h2>
        <ul>{education.map((item) => <li key={item.id}>{item.degree}</li>)}</ul>
        <label className="field">Degree<input value={degree} onChange={(event) => setDegree(event.target.value)} required /></label>
        <label className="field">Institution<input value={institution} onChange={(event) => setInstitution(event.target.value)} /></label>
        <button className="btn" type="submit">Add education</button>
      </form>
      <section className="surface">
        <h2>Experience</h2>
        <ul>{experience.map((item) => <li key={item.id}>{item.title}</li>)}</ul>
        <button
          className="btn-secondary"
          type="button"
          onClick={async () => {
            const ids = experience.map((item) => item.id);
            if (ids.length < 2) return;
            await adminSend("/api/admin/reorder", token, "POST", { entity: "experience", ids: [ids[1], ids[0], ...ids.slice(2)] });
            setMessage("Experience order updated.");
            await onSaved();
          }}
        >
          Swap first two roles
        </button>
      </section>
      <form
        className="surface"
        onSubmit={async (event) => {
          event.preventDefault();
          await adminSend("/api/admin/achievements", token, "POST", {
            event_name: eventName,
            description: "",
            media_ids: [],
          });
          setEventName("");
          setMessage("Achievement added.");
          await onSaved();
        }}
      >
        <h2>Achievement</h2>
        <label className="field">Event<input value={eventName} onChange={(event) => setEventName(event.target.value)} required /></label>
        <button className="btn" type="submit">Add achievement</button>
      </form>
      <form
        className="surface"
        onSubmit={async (event) => {
          event.preventDefault();
          if (!uploaded) {
            setMessage("Upload an image first.");
            return;
          }
          await adminSend("/api/admin/certificates", token, "POST", {
            media_id: uploaded.id,
            alt: caption,
            description: caption,
            caption,
          });
          setMessage("Certificate published.");
          await onSaved();
        }}
      >
        <h2>Certificate from last upload</h2>
        <label className="field">Caption<input value={caption} onChange={(event) => setCaption(event.target.value)} /></label>
        <button className="btn" type="submit">Publish certificate</button>
      </form>
    </div>
  );
}

function WorkflowForm({
  token,
  steps,
  onSaved,
  setMessage,
}: {
  token: string;
  steps: WorkflowStep[];
  onSaved: () => Promise<void>;
  setMessage: (value: string) => void;
}) {
  const [rows, setRows] = useState(steps);
  useEffect(() => setRows(steps), [steps]);

  return (
    <form
      className="surface"
      onSubmit={async (event) => {
        event.preventDefault();
        for (const step of rows) {
          await adminSend(`/api/admin/workflow/${step.id}`, token, "PUT", {
            step_number: step.stepNumber,
            title: step.title,
            body: step.body,
            example_project_slug: step.exampleProjectSlug,
          });
        }
        setMessage("Workflow saved.");
        await onSaved();
      }}
    >
      {rows.map((step, index) => (
        <label key={step.id} className="field">
          {step.stepNumber}. Title
          <input
            value={step.title}
            onChange={(event) => {
              const next = [...rows];
              next[index] = { ...step, title: event.target.value };
              setRows(next);
            }}
          />
        </label>
      ))}
      <button className="btn" type="submit">Save workflow</button>
    </form>
  );
}

function UploadWidget({
  token,
  uploaded,
  setUploaded,
  setMessage,
  onSaved,
}: {
  token: string;
  uploaded: MediaRef | null;
  setUploaded: (media: MediaRef) => void;
  setMessage: (value: string) => void;
  onSaved: () => Promise<void>;
}) {
  const [caption, setCaption] = useState("");
  const [kind, setKind] = useState("");

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    data.append("caption", caption);
    if (kind) data.append("kind", kind);
    const media = await adminSend("/api/admin/upload", token, "POST", data);
    setUploaded(media);
    setMessage(`Uploaded media ${media.id}.`);
    await onSaved();
  }

  return (
    <form className="surface" onSubmit={upload}>
      <label className="field">
        Kind
        <select value={kind} onChange={(event) => setKind(event.target.value)}>
          <option value="">Detect from file</option>
          <option value="image">image</option>
          <option value="video">video</option>
          <option value="audio">audio</option>
          <option value="pdf">pdf</option>
        </select>
      </label>
      <label className="field">Caption<input value={caption} onChange={(event) => setCaption(event.target.value)} /></label>
      <label className="field">File<input name="file" type="file" required /></label>
      <button className="btn" type="submit">Upload</button>
      {uploaded && !uploaded.missing && uploaded.kind === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={mediaSrc(uploaded.thumbUrl || uploaded.url)} alt={uploaded.caption || "Uploaded image"} />
      )}
      {uploaded && <p>Media id {uploaded.id}</p>}
    </form>
  );
}
