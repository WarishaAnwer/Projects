// Initialize with sample notes from the Figma design
const initialNotes = [
    { heading: 'Buy groceries for the week ', content: '' },
    { heading: 'Finish the project report ', content: '' },
    { heading: 'Call the dentist for an appointment ', content: '' },
    { heading: 'Read a new book ', content: '' }
];

let notes = [...initialNotes];
let currentEditingIndex = -1; // -1 means new note, otherwise it's the index of the note being edited
let tempHeading = ''; // Temporary storage for new note heading

const noteInput = document.getElementById('noteInput');
const addNoteBtn = document.getElementById('addNoteBtn');
const notesList = document.getElementById('notesList');
const modalOverlay = document.getElementById('modalOverlay');
const modalContainer = document.querySelector('.modal-container');
const modalTextarea = document.getElementById('modalTextarea');
const modalSaveBtn = document.getElementById('modalSaveBtn');
const modalCancelBtn = document.getElementById('modalCancelBtn');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const errorModalOverlay = document.getElementById('errorModalOverlay');
const errorModalMessage = document.getElementById('errorModalMessage');
const errorModalOkBtn = document.getElementById('errorModalOkBtn');
const errorModalCloseBtn = document.getElementById('errorModalCloseBtn');

// Load notes from localStorage or use initial notes
function loadNotes() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        // Migrate old string format to new object format
        notes = parsedNotes.map(note => {
            if (typeof note === 'string') {
                return { heading: note, content: '' };
            }
            return note;
        });
    }
    renderNotes();
}

// Save notes to localStorage
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Render all notes with animation
function renderNotes() {
    notesList.innerHTML = '';
    
    notes.forEach((note, index) => {
        const noteItem = document.createElement('div');
        noteItem.className = 'note-item';
        noteItem.style.opacity = '0';
        noteItem.style.transform = 'translateX(-20px)';
        
        const noteText = document.createElement('div');
        noteText.className = 'note-text';
        // Display the heading, not the content
        noteText.textContent = typeof note === 'string' ? note : note.heading;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<span>x</span>';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering the note click
            deleteNote(index);
        });
        
        // Make note item clickable to open modal
        noteItem.addEventListener('click', (e) => {
            // Only open modal if clicking on the note item itself, not the delete button
            if (e.target === noteItem || e.target === noteText || e.target.closest('.note-text')) {
                openNoteModal(index);
            }
        });
        
        noteItem.appendChild(noteText);
        noteItem.appendChild(deleteBtn);
        notesList.appendChild(noteItem);
        
        // Animate note appearance
        setTimeout(() => {
            noteItem.style.transition = 'all 0.3s ease';
            noteItem.style.opacity = '1';
            noteItem.style.transform = 'translateX(0)';
        }, index * 50);
    });
}

// Open modal for editing a note
function openNoteModal(index) {
    currentEditingIndex = index;
    if (index >= 0 && index < notes.length) {
        // Editing existing note - show the content (not the heading)
        const note = notes[index];
        modalTextarea.value = typeof note === 'string' ? '' : (note.content || '');
        tempHeading = ''; // Clear temp heading for existing notes
        modalOverlay.classList.add('active');
        modalTextarea.focus();
    }
}

// Close modal with animation
function closeNoteModal() {
    if (modalContainer) {
        modalContainer.style.transform = 'scale(0.9)';
        modalContainer.style.opacity = '0';
    }
    
    setTimeout(() => {
        modalOverlay.classList.remove('active');
        currentEditingIndex = -1;
        modalTextarea.value = '';
        tempHeading = ''; // Clear temp heading
        if (modalContainer) {
            modalContainer.style.transform = '';
            modalContainer.style.opacity = '';
        }
    }, 200);
}

// Save note from modal with animation
function saveNoteFromModal() {
    const noteContent = modalTextarea.value;
    
    // Animate modal closing
    modalContainer.style.transform = 'scale(0.9)';
    modalContainer.style.opacity = '0';
    
    setTimeout(() => {
        if (currentEditingIndex >= 0 && currentEditingIndex < notes.length) {
            // Update existing note - only update content, keep heading unchanged
            const note = notes[currentEditingIndex];
            if (typeof note === 'string') {
                // Migrate old format
                notes[currentEditingIndex] = { heading: note, content: noteContent };
            } else {
                // Update only content, heading stays the same
                notes[currentEditingIndex].content = noteContent;
            }
            saveNotes();
            renderNotes();
            closeNoteModal();
        }
    }, 200);
}

// Show error message in popup
function showError(message) {
    errorModalMessage.textContent = message;
    errorModalOverlay.classList.add('active');
}

// Close error modal
function closeErrorModal() {
    errorModalOverlay.classList.remove('active');
}

// Add a new note (adds immediately, no modal)
function addNote() {
    const noteHeading = noteInput.value.trim();
    if (noteHeading) {
        // Add note immediately with empty content
        notes.push({ heading: noteHeading, content: '' });
        noteInput.value = '';
        saveNotes();
        renderNotes();
    } else {
        // Show error message
        showError('Please enter a note heading!');
    }
}

// Delete a note with animation
function deleteNote(index) {
    // Find the note item element for animation
    const noteItems = document.querySelectorAll('.note-item');
    if (noteItems[index]) {
        noteItems[index].style.transform = 'translateX(-100%) scale(0.8)';
        noteItems[index].style.opacity = '0';
        setTimeout(() => {
            notes.splice(index, 1);
            saveNotes();
            renderNotes();
        }, 300);
    } else {
        notes.splice(index, 1);
        saveNotes();
        renderNotes();
    }
}

// Add button click animation
function addButtonClickAnimation(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
}

// Event listeners
addNoteBtn.addEventListener('click', (e) => {
    addButtonClickAnimation(e.target);
    setTimeout(() => addNote(), 100);
});

// Add visual feedback for input
noteInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addButtonClickAnimation(addNoteBtn);
        setTimeout(() => addNote(), 100);
    }
});

noteInput.addEventListener('focus', function() {
    this.parentElement.style.transform = 'scale(1.01)';
});

noteInput.addEventListener('blur', function() {
    this.parentElement.style.transform = 'scale(1)';
});

// Modal event listeners with animations
modalSaveBtn.addEventListener('click', (e) => {
    addButtonClickAnimation(e.target);
    setTimeout(() => saveNoteFromModal(), 100);
});

modalCancelBtn.addEventListener('click', (e) => {
    addButtonClickAnimation(e.target);
    setTimeout(() => closeNoteModal(), 100);
});

modalCloseBtn.addEventListener('click', (e) => {
    addButtonClickAnimation(e.target);
    setTimeout(() => closeNoteModal(), 100);
});

// Close modal when clicking on overlay
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeNoteModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeNoteModal();
    }
});

// Save note with Ctrl+S or Cmd+S
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's' && modalOverlay.classList.contains('active')) {
        e.preventDefault();
        saveNoteFromModal();
    }
});

// Error modal event listeners
errorModalOkBtn.addEventListener('click', () => {
    closeErrorModal();
});

errorModalCloseBtn.addEventListener('click', () => {
    closeErrorModal();
});

// Close error modal when clicking on overlay
errorModalOverlay.addEventListener('click', (e) => {
    if (e.target === errorModalOverlay) {
        closeErrorModal();
    }
});

// Close error modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && errorModalOverlay.classList.contains('active')) {
        closeErrorModal();
    }
});

// Initialize the app
loadNotes();

