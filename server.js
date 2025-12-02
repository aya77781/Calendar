const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');

const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'users.json');
const DATA_DIR = path.join(__dirname, 'user_data');

// Créer le dossier pour les données utilisateurs s'il n'existe pas
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Fonction pour lire les utilisateurs
function readUsers() {
    try {
        if (fs.existsSync(USERS_FILE)) {
            const data = fs.readFileSync(USERS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Erreur lors de la lecture des utilisateurs:', error);
    }
    return {};
}

// Fonction pour sauvegarder les utilisateurs
function saveUsers(users) {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'écriture des utilisateurs:', error);
        return false;
    }
}

// Fonction pour hasher un mot de passe
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// Fonction pour générer un token
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Fonction pour vérifier le token
function verifyToken(token) {
    const users = readUsers();
    for (const username in users) {
        if (users[username].token === token) {
            return username;
        }
    }
    return null;
}

// Fonction pour obtenir le fichier de tâches d'un utilisateur
function getUserTasksFile(username) {
    return path.join(DATA_DIR, `${username}_tasks.json`);
}

// Fonction pour obtenir le fichier de calendriers d'un utilisateur
function getUserCalendarsFile(username) {
    return path.join(DATA_DIR, `${username}_calendars.json`);
}

// Fonction pour lire les calendriers d'un utilisateur
function readUserCalendars(username) {
    try {
        const calendarsFile = getUserCalendarsFile(username);
        if (fs.existsSync(calendarsFile)) {
            const data = fs.readFileSync(calendarsFile, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Erreur lors de la lecture des calendriers:', error);
    }
    return [];
}

// Fonction pour sauvegarder les calendriers d'un utilisateur
function saveUserCalendars(username, calendars) {
    try {
        const calendarsFile = getUserCalendarsFile(username);
        fs.writeFileSync(calendarsFile, JSON.stringify(calendars, null, 2), 'utf8');
        console.log('saveUserCalendars - Saved calendars for', username, ':', calendars);
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'écriture des calendriers:', error);
        return false;
    }
}

// Fonction pour lire les tâches d'un utilisateur
function readUserTasks(username) {
    try {
        const tasksFile = getUserTasksFile(username);
        if (fs.existsSync(tasksFile)) {
            const data = fs.readFileSync(tasksFile, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Erreur lors de la lecture des tâches:', error);
    }
    return { tasks: [], history: [] };
}

// Fonction pour sauvegarder les tâches d'un utilisateur
function saveUserTasks(username, data) {
    try {
        const tasksFile = getUserTasksFile(username);
        fs.writeFileSync(tasksFile, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'écriture des tâches:', error);
        return false;
    }
}

// Fonction pour mettre à jour l'historique
function updateHistory(tasks) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const history = tasks.filter(task => {
        if (task.completed) return false;
        
        const taskDate = new Date(task.date);
        taskDate.setHours(0, 0, 0, 0);
        const daysDiff = Math.floor((today - taskDate) / (1000 * 60 * 60 * 24));
        
        return daysDiff >= 0 && daysDiff <= 30;
    }).map(task => {
        const taskDate = new Date(task.date);
        taskDate.setHours(0, 0, 0, 0);
        const daysLate = Math.floor((today - taskDate) / (1000 * 60 * 60 * 24));
        
        return {
            ...task,
            daysLate: daysLate > 0 ? daysLate : 0,
            lastUpdated: new Date().toISOString()
        };
    }).sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
    });
    
    return history;
}

// Fonction pour extraire le token depuis les headers
function getTokenFromRequest(req) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    return null;
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const pathname = parsedUrl.pathname;

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Servir les fichiers statiques
    if (method === 'GET' && pathname === '/login.html') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync(path.join(__dirname, 'login.html')));
        return;
    }

    if (method === 'GET' && pathname === '/login.css') {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(fs.readFileSync(path.join(__dirname, 'login.css')));
        return;
    }

    if (method === 'GET' && pathname === '/login.js') {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(fs.readFileSync(path.join(__dirname, 'login.js')));
        return;
    }

    if (method === 'GET' && pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync(path.join(__dirname, 'index.html')));
        return;
    }

    if (method === 'GET' && pathname === '/styles.css') {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(fs.readFileSync(path.join(__dirname, 'styles.css')));
        return;
    }

    if (method === 'GET' && pathname === '/script.js') {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(fs.readFileSync(path.join(__dirname, 'script.js')));
        return;
    }

    // API d'authentification
    if (method === 'POST' && pathname === '/api/auth/register') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const { username, password } = JSON.parse(body);
                const users = readUsers();
                
                if (!username || !password) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Nom d\'utilisateur et mot de passe requis' }));
                    return;
                }
                
                if (users[username]) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Ce nom d\'utilisateur existe déjà' }));
                    return;
                }
                
                const token = generateToken();
                users[username] = {
                    password: hashPassword(password),
                    token: token,
                    createdAt: new Date().toISOString()
                };
                
                saveUsers(users);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, token, username }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
        return;
    }

    if (method === 'POST' && pathname === '/api/auth/login') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const { username, password } = JSON.parse(body);
                const users = readUsers();
                
                if (!users[username] || users[username].password !== hashPassword(password)) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Nom d\'utilisateur ou mot de passe incorrect' }));
                    return;
                }
                
                const token = generateToken();
                users[username].token = token;
                saveUsers(users);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, token, username }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
        return;
    }

    // Routes API protégées - nécessitent une authentification
    const token = getTokenFromRequest(req);
    const username = token ? verifyToken(token) : null;
    
    if (!username && pathname.startsWith('/api/')) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Non authentifié' }));
        return;
    }

    // API Routes pour les calendriers
    if (method === 'GET' && pathname === '/api/calendars') {
        const calendars = readUserCalendars(username);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, calendars }));
        return;
    }

    if (method === 'POST' && pathname === '/api/calendars') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                console.log('POST /api/calendars - Body:', body);
                const calendar = JSON.parse(body);
                console.log('POST /api/calendars - Parsed calendar:', calendar);
                
                if (!calendar.name || !calendar.color) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Le nom et la couleur sont requis' }));
                    return;
                }
                
                const calendars = readUserCalendars(username);
                console.log('POST /api/calendars - Existing calendars:', calendars);
                
                if (calendar.id && calendars.find(c => c.id === calendar.id)) {
                    const index = calendars.findIndex(c => c.id === calendar.id);
                    calendars[index] = { ...calendars[index], ...calendar };
                    console.log('POST /api/calendars - Updated calendar at index:', index);
                } else {
                    if (!calendar.id) {
                        calendar.id = Date.now().toString();
                    }
                    calendar.createdAt = new Date().toISOString();
                    calendars.push(calendar);
                    console.log('POST /api/calendars - Added new calendar:', calendar);
                }
                
                const saved = saveUserCalendars(username, calendars);
                if (!saved) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Erreur lors de la sauvegarde' }));
                    return;
                }
                
                console.log('POST /api/calendars - Success, returning calendars:', calendars);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, data: { calendars } }));
            } catch (error) {
                console.error('POST /api/calendars - Error:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
        return;
    }

    if (method === 'DELETE' && pathname.startsWith('/api/calendars/')) {
        const calendarId = pathname.split('/')[3];
        const calendars = readUserCalendars(username);
        const index = calendars.findIndex(c => c.id === calendarId);
        
        if (index !== -1) {
            // Supprimer toutes les tâches de ce calendrier
            const data = readUserTasks(username);
            data.tasks = data.tasks.filter(t => t.calendarId !== calendarId);
            saveUserTasks(username, data);
            
            calendars.splice(index, 1);
            saveUserCalendars(username, calendars);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: { calendars } }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Calendrier non trouvé' }));
        }
        return;
    }

    // API Routes pour les tâches
    if (method === 'GET' && pathname === '/api/tasks') {
        const data = readUserTasks(username);
        // Retourner toutes les tâches (le filtrage par calendrier se fait côté client)
        data.history = updateHistory(data.tasks);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
        return;
    }

    if (method === 'POST' && pathname === '/api/tasks') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const newTask = JSON.parse(body);
                const data = readUserTasks(username);
                
                if (newTask.id && data.tasks.find(t => t.id === newTask.id)) {
                    const index = data.tasks.findIndex(t => t.id === newTask.id);
                    data.tasks[index] = newTask;
                } else {
                    if (!newTask.id) {
                        newTask.id = Date.now().toString();
                    }
                    if (!newTask.createdAt) {
                        newTask.createdAt = new Date().toISOString();
                    }
                    data.tasks.push(newTask);
                }
                
                data.history = updateHistory(data.tasks);
                saveUserTasks(username, data);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, data }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
        return;
    }

    if (method === 'PUT' && pathname.startsWith('/api/tasks/')) {
        const taskId = pathname.split('/')[3];
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const updatedTask = JSON.parse(body);
                const data = readUserTasks(username);
                const index = data.tasks.findIndex(t => t.id === taskId);
                
                if (index !== -1) {
                    data.tasks[index] = { ...data.tasks[index], ...updatedTask };
                    data.history = updateHistory(data.tasks);
                    saveUserTasks(username, data);
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, data }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Tâche non trouvée' }));
                }
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
        return;
    }

    if (method === 'DELETE' && pathname.startsWith('/api/tasks/')) {
        const taskId = pathname.split('/')[3];
        const data = readUserTasks(username);
        const index = data.tasks.findIndex(t => t.id === taskId);
        
        if (index !== -1) {
            data.tasks.splice(index, 1);
            data.history = updateHistory(data.tasks);
            saveUserTasks(username, data);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Tâche non trouvée' }));
        }
        return;
    }

    // 404 pour les autres routes
    if (pathname.startsWith('/api/')) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Route non trouvée' }));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📁 Fichier utilisateurs: ${USERS_FILE}`);
    console.log(`📁 Dossier données: ${DATA_DIR}`);
});
