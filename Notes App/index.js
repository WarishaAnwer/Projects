document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.querySelector('.add-note-btn');
    const noteInput = document.querySelector('.note-input');
    const notesContainer = document.querySelector('.notes-container');
    const popup = document.getElementById('popup');
    const noteTextArea = document.getElementById('noteText');
    const saveNoteBtn = document.getElementById('saveNote');
    const closePopupBtn = document.getElementById('closePopup');
    let selectedNote = null;

    // ===== Add delete functionality to existing HTML notes =====
    document.querySelectorAll(".note").forEach(noteDiv => {
        const delBtn = noteDiv.querySelector(".delete-btn");
        if (delBtn) {
            delBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                noteDiv.remove();
                saveAllNotes();
            });
        }
    });

    // ===== Add note to UI =====
    function addNoteToUI(title, content = "") {
        const noteDiv = document.createElement("div");
        noteDiv.className = "note";

        const p = document.createElement("p");
        p.textContent = title;
        p.dataset.content = content;

        const delBtn = document.createElement("button");
        delBtn.className = "delete-btn";
        delBtn.textContent = "×";
        delBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            noteDiv.remove();
            saveAllNotes();
        });

        noteDiv.appendChild(p);
        noteDiv.appendChild(delBtn);
        notesContainer.appendChild(noteDiv);
    }

    // ===== Save all notes to localStorage =====
    function saveAllNotes() {
        const notesData = [];
        document.querySelectorAll(".note p").forEach(p => {
            notesData.push({ title: p.textContent, content: p.dataset.content });
        });
        localStorage.setItem("notes_app_data", JSON.stringify(notesData));
    }

    // ===== Load saved notes (avoid duplicates) =====
    const savedNotes = localStorage.getItem("notes_app_data");
    if (savedNotes) {
        const existingTitles = Array.from(document.querySelectorAll(".note p")).map(p => p.textContent);
        JSON.parse(savedNotes).forEach(n => {
            if (!existingTitles.includes(n.title)) {
                addNoteToUI(n.title, n.content);
            }
        });
    }

    // ===== Add new note =====
    addBtn.addEventListener("click", () => {
        const text = noteInput.value.trim();
        if (!text) return alert("Please enter a note!");
        addNoteToUI(text);
        noteInput.value = "";
        saveAllNotes();
    });

    noteInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") addBtn.click();
    });

    // ===== Open popup to edit content =====
    notesContainer.addEventListener("click", (e) => {
        const noteDiv = e.target.closest(".note");
        if (!noteDiv || e.target.classList.contains("delete-btn")) return;

        selectedNote = noteDiv;
        noteTextArea.value = noteDiv.querySelector("p").dataset.content || "Write a note here...";
        popup.style.display = "flex";
    });

    // ===== Save content from popup =====
    saveNoteBtn.addEventListener("click", () => {
        if (selectedNote) {
            selectedNote.querySelector("p").dataset.content = noteTextArea.value;
            saveAllNotes();
        }
        popup.style.display = "none";
    });

    // ===== Close popup =====
    closePopupBtn.addEventListener("click", () => {
        popup.style.display = "none";
    });
});
