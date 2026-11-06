
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, X, LogOut } from "lucide-react";
import API from "../api";

function Dashboard() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: "", description: "" });

  const loadNotes = async () => {
    try {
      const response = await API.get("/notes/read");
      setNotes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }
    loadNotes();
  }, []);

  const saveNote = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.patch(`/notes/update/${editId}`, form);
      } else {
        await API.post("/notes/create", form);
      }
      setForm({ title: "", description: "" });
      setEditId(null);
      setShowForm(false);
      loadNotes();
    } catch {
      alert("Unable to save note.");
    }
  };

  const editNote = (note) => {
    setForm({
      title: note.title || "",
      description: note.description || "",
    });
    setEditId(note._id);
    setShowForm(true);
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await API.delete(`/notes/delete/${id}`);
      loadNotes();
    } catch {
      alert("Unable to delete note.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const filteredNotes = notes.filter((note) =>
    `${note.title || ""} ${note.description || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2 className="brand">Note<span>Space.</span></h2>
        <p className="menu-heading">MENU</p>

        <button className="menu-item active">
          <Pencil size={18} /> All Notes
          <span>{notes.length}</span>
        </button>

        <button className="logout-button" onClick={logout}>
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <div>
            <p className="welcome-text">YOUR PERSONAL SPACE</p>
            <h1>My Notes</h1>
            <p className="subtitle">Capture your thoughts and ideas.</p>
          </div>

          <button className="add-button" onClick={() => {
            setForm({ title: "", description: "" });
            setEditId(null);
            setShowForm(true);
          }}>
            <Plus size={19} /> Add New Note
          </button>
        </header>

        <div className="search-box">
          <Search size={19} />
          <input
            placeholder="Search your notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="notes-heading">
          <h2>All Notes</h2>
          <span>{filteredNotes.length} notes</span>
        </div>

        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <div className="note-card" key={note._id}>
              <span className="note-category">PERSONAL NOTE</span>
              <h3>{note.title}</h3>
              <p className="note-description">{note.description}</p>

              <div className="note-actions">
                <button onClick={() => editNote(note)}>
                  <Pencil size={16} /> Edit
                </button>
                <button className="delete-action" onClick={() => deleteNote(note._id)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}

          {filteredNotes.length === 0 && (
            <div className="empty-state">
              <h3>No notes found</h3>
              <p>Create your first note.</p>
            </div>
          )}
        </div>
      </main>

      {showForm && (
        <div className="modal-overlay">
          <div className="note-modal">
            <div className="modal-header">
              <h2>{editId ? "Edit Note" : "Create New Note"}</h2>
              <button onClick={() => setShowForm(false)}>
                <X size={21} />
              </button>
            </div>

            <form onSubmit={saveNote}>
              <label>Note Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter note title"
                required
              />

              <label>Description</label>
              <textarea
                rows="6"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Write your thoughts here..."
                required
              />

              <button className="save-button" type="submit">
                {editId ? "Update Note" : "Save Note"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
