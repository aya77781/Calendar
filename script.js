// État de l'application
let currentDate = new Date();
let selectedDate = new Date();
let tasks = [];
let calendars = [];
let currentCalendarId = null;
let editingTaskId = null;
let editingCalendarId = null;
const API_BASE = window.location.origin;

// Palettes de couleurs pour chaque calendrier
const colorThemes = {
    rose: {
        bgPrimary: '#FFF0F5',
        bgSecondary: '#FFF8F9',
        textPrimary: '#8B4A6B',
        textSecondary: '#B87A9B',
        textMuted: '#D4A5C0',
        borderColor: '#F5D0E1',
        weekendColor: '#E91E63',
        mainColor: '#FFB6D9',
        mainColorLight: '#FFE4F0',
        mainColorDark: '#FF85B5',
        gradient: 'linear-gradient(135deg, #FFB6D9 0%, #FF9EC7 50%, #FF85B5 100%)',
        shadowColor: '233, 30, 99',
        flowerColor: '#FFB6D9'
    },
    vert: {
        bgPrimary: '#F0FFF4',
        bgSecondary: '#F8FFF9',
        textPrimary: '#4A8B5A',
        textSecondary: '#7AB88A',
        textMuted: '#A5D4B5',
        borderColor: '#D0F5E1',
        weekendColor: '#1EE963',
        mainColor: '#90EE90',
        mainColorLight: '#E4FFE4',
        mainColorDark: '#85FF85',
        gradient: 'linear-gradient(135deg, #90EE90 0%, #9EFF9E 50%, #85FF85 100%)',
        shadowColor: '30, 233, 99',
        flowerColor: '#90EE90'
    },
    jaune: {
        bgPrimary: '#FFFEF0',
        bgSecondary: '#FFFEF8',
        textPrimary: '#8B8B4A',
        textSecondary: '#B8B87A',
        textMuted: '#D4D4A5',
        borderColor: '#F5F5D0',
        weekendColor: '#E9E91E',
        mainColor: '#FFE082',
        mainColorLight: '#FFF4E4',
        mainColorDark: '#FFD585',
        gradient: 'linear-gradient(135deg, #FFE082 0%, #FFE99E 50%, #FFD585 100%)',
        shadowColor: '233, 224, 30',
        flowerColor: '#FFE082'
    },
    bleu: {
        bgPrimary: '#F0F5FF',
        bgSecondary: '#F8F9FF',
        textPrimary: '#4A6B8B',
        textSecondary: '#7A9BB8',
        textMuted: '#A5C0D4',
        borderColor: '#D0E1F5',
        weekendColor: '#1E63E9',
        mainColor: '#81D4FA',
        mainColorLight: '#E4F0FF',
        mainColorDark: '#85B5FF',
        gradient: 'linear-gradient(135deg, #81D4FA 0%, #9EC7FF 50%, #85B5FF 100%)',
        shadowColor: '30, 99, 233',
        flowerColor: '#81D4FA'
    },
    violet: {
        bgPrimary: '#F5F0FF',
        bgSecondary: '#F9F8FF',
        textPrimary: '#6B4A8B',
        textSecondary: '#9B7AB8',
        textMuted: '#C0A5D4',
        borderColor: '#E1D0F5',
        weekendColor: '#631EE9',
        mainColor: '#CE93D8',
        mainColorLight: '#F4E4FF',
        mainColorDark: '#B585FF',
        gradient: 'linear-gradient(135deg, #CE93D8 0%, #C79EFF 50%, #B585FF 100%)',
        shadowColor: '99, 30, 233',
        flowerColor: '#CE93D8'
    },
    blanc: {
        bgPrimary: '#FFFFFF',
        bgSecondary: '#F8F8F8',
        textPrimary: '#4A4A4A',
        textSecondary: '#7A7A7A',
        textMuted: '#A5A5A5',
        borderColor: '#E1E1E1',
        weekendColor: '#636363',
        mainColor: '#FFFFFF',
        mainColorLight: '#F8F8F8',
        mainColorDark: '#E8E8E8',
        gradient: 'linear-gradient(135deg, #FFFFFF 0%, #F8F8F8 50%, #E8E8E8 100%)',
        shadowColor: '99, 99, 99',
        flowerColor: '#E8E8E8'
    }
};

// Appliquer le thème de couleur du calendrier actif
function applyCalendarTheme() {
    const currentCalendar = calendars.find(c => c.id === currentCalendarId);
    if (!currentCalendar) {
        // Utiliser le thème rose par défaut
        applyTheme('rose');
        return;
    }
    
    applyTheme(currentCalendar.color || 'rose');
}

// Appliquer un thème spécifique
function applyTheme(colorName) {
    const theme = colorThemes[colorName] || colorThemes.rose;
    const root = document.documentElement;
    
    // Appliquer les variables CSS
    root.style.setProperty('--bg-primary', theme.bgPrimary);
    root.style.setProperty('--bg-secondary', theme.bgSecondary);
    root.style.setProperty('--text-primary', theme.textPrimary);
    root.style.setProperty('--text-secondary', theme.textSecondary);
    root.style.setProperty('--text-muted', theme.textMuted);
    root.style.setProperty('--border-color', theme.borderColor);
    root.style.setProperty('--weekend-color', theme.weekendColor);
    root.style.setProperty('--pink-gradient', theme.gradient);
    root.style.setProperty('--rose-light', theme.mainColorLight);
    root.style.setProperty('--rose-medium', theme.mainColor);
    root.style.setProperty('--rose-dark', theme.mainColorDark);
    root.style.setProperty('--shadow-sm', `0 1px 3px rgba(${theme.shadowColor}, 0.1)`);
    root.style.setProperty('--shadow-md', `0 4px 6px rgba(${theme.shadowColor}, 0.15)`);
    root.style.setProperty('--shadow-lg', `0 10px 25px rgba(${theme.shadowColor}, 0.2)`);
    
    // Mettre à jour le background du body avec la couleur de fleur
    const flowerColorHex = theme.flowerColor.replace('#', '');
    const body = document.body;
    body.style.backgroundImage = `
        url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 20 Q60 30 70 20 Q80 30 70 40 Q80 50 70 60 Q60 50 50 60 Q40 50 30 60 Q20 50 30 40 Q20 30 30 20 Q40 30 50 20 Z' fill='%23${flowerColorHex}' opacity='0.15'/%3E%3Cpath d='M20 50 Q30 40 40 50 Q30 60 20 50 Z' fill='%23${flowerColorHex}' opacity='0.1'/%3E%3Cpath d='M80 50 Q90 40 100 50 Q90 60 80 50 Z' fill='%23${flowerColorHex}' opacity='0.1'/%3E%3Cpath d='M50 80 Q60 70 70 80 Q80 90 70 100 Q60 90 50 100 Q40 90 30 100 Q20 90 30 80 Q40 70 50 80 Z' fill='%23${flowerColorHex}' opacity='0.15'/%3E%3C/svg%3E"),
        linear-gradient(rgba(${hexToRgb(theme.flowerColor)}, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(${hexToRgb(theme.flowerColor)}, 0.03) 1px, transparent 1px)
    `;
    
    // Mettre à jour le gradient du app-container::before
    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
        const gradientColorHex = theme.mainColor.replace('#', '');
        appContainer.style.setProperty('--pink-gradient', theme.gradient);
        // Créer ou mettre à jour un style pour le ::before
        let styleElement = document.getElementById('dynamic-theme-style');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'dynamic-theme-style';
            document.head.appendChild(styleElement);
        }
        styleElement.textContent = `
            .app-container::before {
                background: ${theme.gradient} !important;
                background-image: url("data:image/svg+xml,%3Csvg width='150' height='150' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M75 30 Q85 40 95 30 Q105 40 95 50 Q105 60 95 70 Q85 60 75 70 Q65 60 55 70 Q45 60 55 50 Q45 40 55 30 Q65 40 75 30 Z' fill='%23FFFFFF' opacity='0.2'/%3E%3Cpath d='M30 75 Q40 65 50 75 Q40 85 30 75 Z' fill='%23FFFFFF' opacity='0.15'/%3E%3Cpath d='M120 75 Q130 65 140 75 Q130 85 120 75 Z' fill='%23FFFFFF' opacity='0.15'/%3E%3Cpath d='M75 120 Q85 110 95 120 Q105 130 95 140 Q85 130 75 140 Q65 130 55 140 Q45 130 55 120 Q65 110 75 120 Z' fill='%23FFFFFF' opacity='0.2'/%3E%3C/svg%3E") !important;
            }
        `;
    }
}

// Convertir hex en rgb
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
        '255, 182, 217';
}

// Vérifier l'authentification au chargement
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }
    
    // Afficher le message de salutation avec le nom d'utilisateur
    const username = localStorage.getItem('username');
    if (username) {
        const greetingMessage = document.getElementById('greetingMessage');
        greetingMessage.textContent = `${username} Hello, Work Hard today`;
    }
    
    await loadCalendars();
    await loadTasks();
    renderCalendars();
    // Appliquer le thème du calendrier actif
    applyCalendarTheme();
    renderCalendar();
    renderTodos();
    renderHistory();
    setupEventListeners();
    updateSelectedDateDisplay();
});

// Fonction pour obtenir les headers avec authentification
function getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Charger les tâches depuis l'API (toutes les tâches pour affichage dans le calendrier)
async function loadTasks() {
    try {
        const response = await fetch(`${API_BASE}/api/tasks`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        if (data.error && data.error === 'Non authentifié') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            window.location.href = '/login.html';
            return;
        }
        // Charger toutes les tâches pour pouvoir les afficher dans le calendrier
        // Le filtrage par calendrier se fait lors de l'affichage dans renderTodos
        tasks = data.tasks || [];
    } catch (error) {
        console.error('Erreur lors du chargement des tâches:', error);
        tasks = [];
    }
}

// Sauvegarder une tâche via l'API
async function saveTaskToAPI(task) {
    try {
        const response = await fetch(`${API_BASE}/api/tasks`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(task)
        });
        const result = await response.json();
        if (result.success) {
            tasks = result.data.tasks;
            return true;
        }
        return false;
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        return false;
    }
}

// Mettre à jour une tâche via l'API
async function updateTaskInAPI(taskId, updates) {
    try {
        const response = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(updates)
        });
        const result = await response.json();
        if (result.success) {
            tasks = result.data.tasks;
            return true;
        }
        return false;
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        return false;
    }
}

// Supprimer une tâche via l'API
async function deleteTaskFromAPI(taskId) {
    try {
        const response = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        const result = await response.json();
        if (result.success) {
            tasks = result.data.tasks;
            return true;
        }
        return false;
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        return false;
    }
}

// Charger les calendriers depuis l'API
async function loadCalendars() {
    try {
        const response = await fetch(`${API_BASE}/api/calendars`, {
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('username');
                window.location.href = '/login.html';
                return;
            }
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                if (data.error && data.error === 'Non authentifié') {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('username');
                    window.location.href = '/login.html';
                    return;
                }
            }
            console.error('Erreur HTTP:', response.status);
            return;
        }
        
        const data = await response.json();
        if (data.error && data.error === 'Non authentifié') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            window.location.href = '/login.html';
            return;
        }
        calendars = data.calendars || [];
        
        // Si aucun calendrier, créer un calendrier par défaut
        if (calendars.length === 0) {
            await createDefaultCalendar();
            await loadCalendars();
        }
        
        // Sélectionner le premier calendrier si aucun n'est sélectionné
        if (!currentCalendarId && calendars.length > 0) {
            currentCalendarId = calendars[0].id;
            applyCalendarTheme();
        }
    } catch (error) {
        console.error('Erreur lors du chargement des calendriers:', error);
        if (error.message.includes('JSON')) {
            console.error('Le serveur a renvoyé une réponse non-JSON. Vérifiez que le serveur est bien démarré sur le port 3000.');
        }
        calendars = [];
    }
}

// Créer un calendrier par défaut
async function createDefaultCalendar() {
    const defaultCalendar = {
        name: 'Principal',
        color: 'rose'
    };
    await saveCalendarToAPI(defaultCalendar);
}

// Sauvegarder un calendrier via l'API
async function saveCalendarToAPI(calendar) {
    try {
        // Vérifier que le token existe
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Aucun token d\'authentification trouvé');
            alert('Vous n\'êtes pas connecté. Veuillez vous reconnecter.');
            window.location.href = '/login.html';
            return false;
        }
        
        console.log('Envoi de la requête POST /api/calendars avec:', calendar);
        const headers = getAuthHeaders();
        console.log('Headers:', { ...headers, 'Authorization': 'Bearer ***' });
        
        const response = await fetch(`${API_BASE}/api/calendars`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(calendar)
        });
        
        console.log('Réponse reçue:', response.status, response.statusText);
        console.log('Content-Type:', response.headers.get('content-type'));
        
        if (!response.ok) {
            // Si erreur 401, rediriger vers la page de connexion
            if (response.status === 401) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('username');
                alert('Votre session a expiré. Veuillez vous reconnecter.');
                window.location.href = '/login.html';
                return false;
            }
            
            let errorData;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                try {
                    errorData = await response.json();
                } catch (jsonError) {
                    const text = await response.text();
                    console.error('Erreur lors du parsing JSON:', jsonError, 'Texte reçu:', text);
                    errorData = { error: `Erreur ${response.status}: ${text}` };
                }
            } else {
                const text = await response.text();
                console.error('Réponse non-JSON:', text);
                errorData = { error: `Erreur ${response.status}: ${text}` };
            }
            console.error('Erreur HTTP complète:', response.status, errorData);
            return false;
        }
        
        const result = await response.json();
        console.log('Réponse serveur complète:', result);
        
        if (result.success) {
            calendars = result.data?.calendars || result.calendars || [];
            console.log('Calendriers mis à jour:', calendars);
            return true;
        } else {
            console.error('Erreur API:', result.error);
            return false;
        }
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du calendrier:', error);
        console.error('Stack trace:', error.stack);
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            alert('Erreur de connexion au serveur. Vérifiez que le serveur est bien démarré sur le port 3000.');
        }
        return false;
    }
}

// Supprimer un calendrier via l'API
async function deleteCalendarFromAPI(calendarId) {
    try {
        const response = await fetch(`${API_BASE}/api/calendars/${calendarId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        const result = await response.json();
        if (result.success) {
            calendars = result.data.calendars;
            if (currentCalendarId === calendarId && calendars.length > 0) {
                currentCalendarId = calendars[0].id;
            }
            return true;
        }
        return false;
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        return false;
    }
}

// Rendre la liste des calendriers
function renderCalendars() {
    const calendarsList = document.getElementById('calendarsList');
    calendarsList.innerHTML = '';
    
    calendars.forEach(cal => {
        const calItem = document.createElement('div');
        calItem.className = `calendar-item ${cal.id === currentCalendarId ? 'active' : ''}`;
        
        const colorMap = {
            'rose': '#FFB6D9',
            'vert': '#90EE90',
            'jaune': '#FFE082',
            'bleu': '#81D4FA',
            'violet': '#CE93D8',
            'blanc': '#FFFFFF'
        };
        
        calItem.innerHTML = `
            <div class="calendar-color-indicator" style="background: ${colorMap[cal.color] || colorMap.rose};"></div>
            <div class="calendar-item-name">${cal.name}</div>
            <div class="calendar-item-actions">
                <button onclick="editCalendar('${cal.id}')" title="Modifier">Modifier</button>
                ${calendars.length > 1 ? `<button onclick="deleteCalendar('${cal.id}')" title="Supprimer">×</button>` : ''}
            </div>
        `;
        
        calItem.addEventListener('click', async (e) => {
            if (!e.target.closest('.calendar-item-actions')) {
                currentCalendarId = cal.id;
                // Appliquer le thème de couleur du calendrier
                applyCalendarTheme();
                renderCalendars();
                await loadTasks();
                renderCalendar();
                renderTodos();
                renderHistory();
            }
        });
        
        calendarsList.appendChild(calItem);
    });
}

// Ouvrir le modal de calendrier
function openCalendarModal(calendarId = null) {
    const modal = document.getElementById('calendarModal');
    const form = document.getElementById('calendarForm');
    const deleteBtn = document.getElementById('deleteCalendarBtn');
    
    editingCalendarId = calendarId;
    
    if (calendarId) {
        const calendar = calendars.find(c => c.id === calendarId);
        document.getElementById('calendarModalTitle').textContent = 'Modifier le Calendrier';
        document.getElementById('calendarName').value = calendar.name;
        document.querySelector(`input[value="${calendar.color}"]`).checked = true;
        deleteBtn.style.display = 'inline-block';
    } else {
        document.getElementById('calendarModalTitle').textContent = 'Nouveau Calendrier';
        form.reset();
        document.querySelector('input[value="rose"]').checked = true;
        deleteBtn.style.display = 'none';
    }
    
    modal.style.display = 'block';
}

// Fermer le modal de calendrier
function closeCalendarModal() {
    document.getElementById('calendarModal').style.display = 'none';
    editingCalendarId = null;
}

// Sauvegarder un calendrier
async function saveCalendar(e) {
    e.preventDefault();
    
    const name = document.getElementById('calendarName').value.trim();
    if (!name) {
        alert('Veuillez entrer un nom pour le calendrier');
        return;
    }
    
    const colorRadio = document.querySelector('input[name="calendarColor"]:checked');
    if (!colorRadio) {
        alert('Veuillez sélectionner une couleur pour le calendrier');
        return;
    }
    const color = colorRadio.value;
    
    console.log('Sauvegarde du calendrier:', { name, color, editingCalendarId });
    
    if (editingCalendarId) {
        const updated = await saveCalendarToAPI({
            id: editingCalendarId,
            name,
            color
        });
        if (updated) {
            await loadCalendars();
            renderCalendars();
            applyCalendarTheme();
            await loadTasks();
            renderCalendar();
            renderTodos();
            renderHistory();
            closeCalendarModal();
        } else {
            alert('Erreur lors de la mise à jour du calendrier. Vérifiez la console pour plus de détails.');
        }
    } else {
        const saved = await saveCalendarToAPI({ name, color });
        if (saved) {
            await loadCalendars();
            renderCalendars();
            if (calendars.length > 0 && !currentCalendarId) {
                currentCalendarId = calendars[0].id;
            }
            applyCalendarTheme();
            await loadTasks();
            renderCalendar();
            renderTodos();
            renderHistory();
            closeCalendarModal();
        } else {
            alert('Erreur lors de la création du calendrier. Vérifiez la console pour plus de détails.');
        }
    }
}

// Modifier un calendrier
function editCalendar(calendarId) {
    openCalendarModal(calendarId);
}

// Supprimer un calendrier
async function deleteCalendar(calendarId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce calendrier ? Toutes les tâches associées seront également supprimées.')) {
        const deleted = await deleteCalendarFromAPI(calendarId);
        if (deleted) {
            await loadCalendars();
            renderCalendars();
            applyCalendarTheme();
            await loadTasks();
            renderCalendar();
            renderTodos();
            renderHistory();
        }
    }
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    document.getElementById('addTaskBtn').addEventListener('click', () => {
        openTaskModal();
    });

    document.getElementById('addCalendarBtn').addEventListener('click', () => {
        openCalendarModal();
    });

    document.getElementById('closeCalendarModal').addEventListener('click', closeCalendarModal);
    document.getElementById('cancelCalendarBtn').addEventListener('click', closeCalendarModal);
    document.getElementById('deleteCalendarBtn').addEventListener('click', async () => {
        if (editingCalendarId) {
            await deleteCalendar(editingCalendarId);
            closeCalendarModal();
        }
    });
    document.getElementById('calendarForm').addEventListener('submit', saveCalendar);

    document.getElementById('closeModal').addEventListener('click', closeTaskModal);
    document.getElementById('cancelBtn').addEventListener('click', closeTaskModal);
    document.getElementById('deleteBtn').addEventListener('click', deleteTask);
    document.getElementById('taskForm').addEventListener('submit', saveTask);

    // Toggle historique
    document.getElementById('historyToggle').addEventListener('click', () => {
        const historyList = document.getElementById('historyList');
        const toggleIcon = document.querySelector('.toggle-icon');
        historyList.classList.toggle('visible');
        toggleIcon.textContent = historyList.classList.contains('visible') ? '▼' : '▶';
    });

    // Afficher les informations utilisateur
    const username = localStorage.getItem('username');
    if (username) {
        const userInfo = document.getElementById('userInfo');
        userInfo.textContent = `Connecté en tant que: ${username}`;
        userInfo.style.cssText = 'padding: 12px; background: var(--bg-primary); border-radius: 8px; margin-bottom: 16px; font-size: 13px; color: var(--text-secondary); text-align: center;';
    }

    // Bouton de déconnexion
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        window.location.href = '/login.html';
    });

    // Toggle sidebar (tableau de bord)
    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');
    const closeSidebarBtn = document.getElementById('closeSidebar');
    const appContainer = document.querySelector('.app-container');

    toggleSidebarBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        appContainer.classList.toggle('sidebar-open');
        toggleSidebarBtn.classList.toggle('sidebar-open');
    });

    closeSidebarBtn.addEventListener('click', () => {
        sidebar.classList.remove('open');
        appContainer.classList.remove('sidebar-open');
        toggleSidebarBtn.classList.remove('sidebar-open');
    });

    // Fermer le modal en cliquant en dehors
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('taskModal');
        if (e.target === modal) {
            closeTaskModal();
        }
    });
}

// Rendre le calendrier
function renderCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Mettre à jour l'affichage du mois/année
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    document.getElementById('currentMonthYear').textContent = 
        `${monthNames[month]} ${year}`;

    // Premier jour du mois
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Jours du mois précédent
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();

    // Afficher les jours du mois précédent
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const date = new Date(year, month - 1, day);
        createCalendarDay(date, true, calendar);
    }

    // Afficher les jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        createCalendarDay(date, false, calendar);
    }

    // Afficher les jours du mois suivant pour compléter la grille
    const totalCells = calendar.children.length;
    const remainingCells = 42 - totalCells; // 6 semaines * 7 jours
    for (let day = 1; day <= remainingCells; day++) {
        const date = new Date(year, month + 1, day);
        createCalendarDay(date, true, calendar);
    }
}

// Créer un jour du calendrier
function createCalendarDay(date, isOtherMonth, calendar) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'calendar-day';
    
    // Détecter les week-ends (samedi = 6, dimanche = 0)
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        dayDiv.classList.add('weekend');
    }
    
    if (isOtherMonth) {
        dayDiv.classList.add('other-month');
    }

    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
        dayDiv.classList.add('today');
    }

    if (date.toDateString() === selectedDate.toDateString()) {
        dayDiv.classList.add('selected');
    }

    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = date.getDate();
    dayDiv.appendChild(dayNumber);

    // Afficher les tâches pour ce jour (inclure aussi les tâches terminées)
    // getTasksForDate filtre déjà par calendrier actif
    const dayTasks = getTasksForDate(date);
    
    const tasksContainer = document.createElement('div');
    tasksContainer.className = 'calendar-tasks';
    
    if (dayTasks.length > 0) {
        // Obtenir la couleur du calendrier pour chaque tâche
        const getTaskCalendarColor = (task) => {
            if (task.calendarId) {
                const calendar = calendars.find(c => c.id === task.calendarId);
                if (calendar) {
                    return calendar.color;
                }
            }
            return 'rose'; // Par défaut
        };
        
        // Séparer les tâches non terminées et terminées pour l'affichage
        const activeTasks = dayTasks.filter(t => !t.completed);
        const completedTasks = dayTasks.filter(t => t.completed);

        // Si aucune tâche active mais des tâches terminées, on utilise la première terminée
        const referenceTasks = activeTasks.length > 0 ? activeTasks : completedTasks;

        // Si une seule tâche (active ou terminée), remplir toute la cellule avec la couleur du calendrier
        const firstTask = referenceTasks[0];
        const calendarColor = getTaskCalendarColor(firstTask);
        
        if (dayTasks.length === 1) {
            dayDiv.classList.add('has-task', calendarColor);
            const taskItem = document.createElement('div');
            taskItem.className = `calendar-task-item ${calendarColor} ${firstTask.completed ? 'completed' : ''}`;
            taskItem.textContent = firstTask.title;
            taskItem.title = firstTask.title;
            tasksContainer.appendChild(taskItem);
        } else {
            // Plusieurs tâches : afficher comme des rectangles avec la couleur de leur calendrier
            const tasksToShow = dayTasks.slice(0, 3);
            tasksToShow.forEach(task => {
                const taskCalendarColor = getTaskCalendarColor(task);
                const taskItem = document.createElement('div');
                taskItem.className = `calendar-task-item ${taskCalendarColor} ${task.completed ? 'completed' : ''}`;
                taskItem.textContent = task.title;
                taskItem.title = task.title;
                tasksContainer.appendChild(taskItem);
            });
            
            if (dayTasks.length > 3) {
                const moreIndicator = document.createElement('div');
                moreIndicator.className = 'calendar-task-more';
                moreIndicator.textContent = `+${dayTasks.length - 3} autre${dayTasks.length - 3 > 1 ? 's' : ''}`;
                tasksContainer.appendChild(moreIndicator);
            }
        }
    }
    
    dayDiv.appendChild(tasksContainer);

    dayDiv.addEventListener('click', () => {
        selectedDate = new Date(date);
        renderCalendar();
        renderTodos();
        updateSelectedDateDisplay();
    });

    calendar.appendChild(dayDiv);
}

// Obtenir les tâches pour une date spécifique (filtrées par calendrier actif)
function getTasksForDate(date) {
    let filteredTasks = tasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate.toDateString() === date.toDateString();
    });
    
    // Filtrer par calendrier actif si un calendrier est sélectionné
    if (currentCalendarId) {
        filteredTasks = filteredTasks.filter(task => task.calendarId === currentCalendarId);
    }
    
    return filteredTasks;
}

// Rendre la liste des tâches
function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    let dayTasks = getTasksForDate(selectedDate);
    
    // Filtrer par calendrier actif si un calendrier est sélectionné
    if (currentCalendarId) {
        dayTasks = dayTasks.filter(task => task.calendarId === currentCalendarId);
    }

    if (dayTasks.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state">
                <p>Aucune tâche pour cette date</p>
            </div>
        `;
        return;
    }

    dayTasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        const timeStr = task.time ? task.time : '';
        
        // Créer les éléments pour éviter les problèmes d'échappement
        const header = document.createElement('div');
        header.className = 'task-item-header';
        
        const title = document.createElement('div');
        title.className = 'task-item-title';
        title.textContent = task.title;
        header.appendChild(title);
        
        if (timeStr) {
            const time = document.createElement('div');
            time.className = 'task-item-time';
            time.textContent = timeStr;
            header.appendChild(time);
        }
        
        taskDiv.appendChild(header);
        
        if (task.description) {
            const desc = document.createElement('div');
            desc.className = 'task-item-description';
            desc.textContent = task.description;
            taskDiv.appendChild(desc);
        }
        
        // Créer les boutons d'action
        const actions = document.createElement('div');
        actions.className = 'task-item-actions';
        
        const completeBtn = document.createElement('button');
        completeBtn.textContent = task.completed ? 'Annuler' : 'Terminer';
        completeBtn.onclick = () => window.toggleComplete(task.id);
        actions.appendChild(completeBtn);
        
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Modifier';
        editBtn.onclick = () => window.editTask(task.id);
        actions.appendChild(editBtn);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Supprimer';
        deleteBtn.onclick = () => window.removeTask(task.id);
        actions.appendChild(deleteBtn);
        
        taskDiv.appendChild(actions);
        todoList.appendChild(taskDiv);
    });
}

// Mettre à jour l'affichage de la date sélectionnée
function updateSelectedDateDisplay() {
    const dateStr = selectedDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('selectedDate').textContent = 
        `${dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}`;
}

// Ouvrir le modal de tâche
function openTaskModal(taskId = null) {
    const modal = document.getElementById('taskModal');
    const form = document.getElementById('taskForm');
    const deleteBtn = document.getElementById('deleteBtn');
    const calendarSelect = document.getElementById('taskCalendar');
    
    // Remplir la liste des calendriers
    calendarSelect.innerHTML = '<option value="">Sélectionner un calendrier</option>';
    calendars.forEach(cal => {
        const option = document.createElement('option');
        option.value = cal.id;
        option.textContent = cal.name;
        calendarSelect.appendChild(option);
    });
    
    editingTaskId = taskId;
    
    if (taskId) {
        const task = tasks.find(t => t.id === taskId);
        document.getElementById('modalTitle').textContent = 'Modifier la Tâche';
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDate').value = task.date;
        document.getElementById('taskTime').value = task.time || '';
        document.getElementById('taskDescription').value = task.description || '';
        calendarSelect.value = task.calendarId || '';
        deleteBtn.style.display = 'inline-block';
    } else {
        document.getElementById('modalTitle').textContent = 'Nouvelle Tâche';
        form.reset();
        document.getElementById('taskDate').value = formatDateForInput(selectedDate);
        calendarSelect.value = currentCalendarId || '';
        deleteBtn.style.display = 'none';
    }
    
    modal.style.display = 'block';
}

// Fermer le modal de tâche
function closeTaskModal() {
    document.getElementById('taskModal').style.display = 'none';
    editingTaskId = null;
}

// Sauvegarder une tâche
async function saveTask(e) {
    e.preventDefault();
    
    const title = document.getElementById('taskTitle').value;
    const date = document.getElementById('taskDate').value;
    const time = document.getElementById('taskTime').value;
    const description = document.getElementById('taskDescription').value;
    const calendarId = document.getElementById('taskCalendar').value;
    
    if (!calendarId) {
        alert('Veuillez sélectionner un calendrier');
        return;
    }
    
    if (editingTaskId) {
        // Modifier une tâche existante
        const task = tasks.find(t => t.id === editingTaskId);
        if (task) {
            const updated = await updateTaskInAPI(editingTaskId, {
                title,
                date,
                time,
                description,
                calendarId
            });
            if (updated) {
                await loadTasks();
                renderCalendar();
                renderTodos();
                renderHistory();
                closeTaskModal();
            }
        }
    } else {
        // Créer une nouvelle tâche
        const newTask = {
            title,
            date,
            time,
            description,
            calendarId,
            completed: false,
            createdAt: new Date().toISOString()
        };
        const saved = await saveTaskToAPI(newTask);
        if (saved) {
            await loadTasks();
            renderCalendar();
            renderTodos();
            renderHistory();
            closeTaskModal();
        }
    }
}

// Supprimer une tâche
async function deleteTask() {
    if (editingTaskId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
            const deleted = await deleteTaskFromAPI(editingTaskId);
            if (deleted) {
                await loadTasks();
                renderCalendar();
                renderTodos();
                renderHistory();
                closeTaskModal();
            }
        }
    }
}

// Modifier une tâche (exposée globalement pour onclick)
window.editTask = function(taskId) {
    openTaskModal(taskId);
};

// Supprimer une tâche (exposée globalement pour onclick)
window.removeTask = async function(taskId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
        const deleted = await deleteTaskFromAPI(taskId);
        if (deleted) {
            await loadTasks();
            renderCalendar();
            renderTodos();
            renderHistory();
        } else {
            alert('Erreur lors de la suppression de la tâche');
        }
    }
};

// Basculer l'état de complétion d'une tâche (exposée globalement pour onclick)
window.toggleComplete = async function(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        const updated = await updateTaskInAPI(taskId, {
            completed: !task.completed
        });
        if (updated) {
            await loadTasks();
            renderCalendar();
            renderTodos();
            renderHistory();
        } else {
            alert('Erreur lors de la mise à jour de la tâche');
        }
    } else {
        alert('Tâche non trouvée');
    }
};

// Obtenir les tâches pendantes des derniers jours (filtrées par calendrier actif)
function getPendingTasksFromLastDays(days = 7) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - days);
    
    let filteredTasks = tasks.filter(task => {
        if (task.completed) return false;
        
        const taskDate = new Date(task.date);
        taskDate.setHours(0, 0, 0, 0);
        
        return taskDate >= startDate && taskDate < today;
    });
    
    // Filtrer par calendrier actif si un calendrier est sélectionné
    if (currentCalendarId) {
        filteredTasks = filteredTasks.filter(task => task.calendarId === currentCalendarId);
    }
    
    return filteredTasks.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
    });
}

// Rendre l'historique des tâches pendantes
function renderHistory() {
    const historyList = document.getElementById('historyList');
    const pendingTasks = getPendingTasksFromLastDays(7);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (pendingTasks.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <p>Aucune tâche en retard !</p>
            </div>
        `;
        return;
    }
    
    historyList.innerHTML = '';
    
    // Grouper les tâches par date
    const tasksByDate = {};
    pendingTasks.forEach(task => {
        const taskDate = new Date(task.date);
        const dateKey = taskDate.toDateString();
        if (!tasksByDate[dateKey]) {
            tasksByDate[dateKey] = [];
        }
        tasksByDate[dateKey].push(task);
    });
    
    // Afficher les tâches groupées par date
    Object.keys(tasksByDate).sort().forEach(dateKey => {
        const date = new Date(dateKey);
        date.setHours(0, 0, 0, 0);
        const dateTasks = tasksByDate[dateKey];
        
        const dateHeader = document.createElement('div');
        dateHeader.className = 'history-date-header';
        const dateStr = date.toLocaleDateString('fr-FR', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });
        dateHeader.innerHTML = `<span class="history-date">${dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}</span>`;
        historyList.appendChild(dateHeader);
        
        dateTasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.className = `task-item history-item`;
            
            const timeStr = task.time ? task.time : '';
            const daysLate = Math.floor((today - date) / (1000 * 60 * 60 * 24));
            
            // Créer le header
            const header = document.createElement('div');
            header.className = 'task-item-header';
            
            const title = document.createElement('div');
            title.className = 'task-item-title';
            title.textContent = task.title;
            
            if (daysLate > 0) {
                const badge = document.createElement('span');
                badge.className = 'late-badge';
                badge.textContent = `${daysLate} jour${daysLate > 1 ? 's' : ''} de retard`;
                title.appendChild(document.createTextNode(' '));
                title.appendChild(badge);
            }
            
            header.appendChild(title);
            
            if (timeStr) {
                const time = document.createElement('div');
                time.className = 'task-item-time';
                time.textContent = timeStr;
                header.appendChild(time);
            }
            
            taskDiv.appendChild(header);
            
            if (task.description) {
                const desc = document.createElement('div');
                desc.className = 'task-item-description';
                desc.textContent = task.description;
                taskDiv.appendChild(desc);
            }
            
            // Créer les boutons d'action
            const actions = document.createElement('div');
            actions.className = 'task-item-actions';
            
            const completeBtn = document.createElement('button');
            completeBtn.textContent = 'Terminer';
            completeBtn.onclick = (e) => {
                e.stopPropagation();
                window.toggleComplete(task.id);
            };
            actions.appendChild(completeBtn);
            
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Modifier';
            editBtn.onclick = (e) => {
                e.stopPropagation();
                window.editTask(task.id);
            };
            actions.appendChild(editBtn);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Supprimer';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                window.removeTask(task.id);
            };
            actions.appendChild(deleteBtn);
            
            taskDiv.appendChild(actions);
            
            taskDiv.addEventListener('click', (e) => {
                if (!e.target.closest('.task-item-actions')) {
                    selectedDate = new Date(task.date);
                    renderCalendar();
                    renderTodos();
                    updateSelectedDateDisplay();
                }
            });
            
            historyList.appendChild(taskDiv);
        });
    });
}

// Formater une date pour l'input date
function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
