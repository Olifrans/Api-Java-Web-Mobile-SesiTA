let editId = null;
let allAlunos = [];

// Chart instances
let matriculasChart = null;
let turmasChart = null;

// Page navigation
document.addEventListener("DOMContentLoaded", () => {
    carregar();
    initNavigation();
    initSidebarToggle();
    
    // Initialize charts
    initMatriculasChart();
    initTurmasChart();
});

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const pageTitle = document.getElementById('pageTitle');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            
            // Update active class
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Show selected page
            pages.forEach(p => p.classList.remove('active'));
            document.getElementById(`${page}-page`).classList.add('active');
            
            // Update title
            const titles = {
                dashboard: 'Dashboard',
                alunos: 'Alunos',
                professores: 'Professores',
                turmas: 'Turmas'
            };
            pageTitle.textContent = titles[page];
            
            // Refresh data if needed
            if (page === 'alunos') {
                carregarAlunos();
            } else if (page === 'dashboard') {
                atualizarDashboard();
            }
        });
    });
}

function initSidebarToggle() {
    const toggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (toggle) {
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
}

function initMatriculasChart() {
    const ctx = document.getElementById('matriculasChart')?.getContext('2d');
    if (ctx) {
        matriculasChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                datasets: [{
                    label: 'Matrículas',
                    data: [5, 8, 12, 15, 18, 22, 25, 28, 30, 32, 35, 38],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

function initTurmasChart() {
    const ctx = document.getElementById('turmasChart')?.getContext('2d');
    if (ctx) {
        turmasChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['1º Ano A', '1º Ano B', '2º Ano A', '2º Ano B', '3º Ano A'],
                datasets: [{
                    data: [12, 15, 18, 14, 20],
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

function carregar() {
    carregarAlunos();
    atualizarDashboard();
}

function carregarAlunos() {
    fetch("http://localhost:8080/alunos")
        .then(r => r.json())
        .then(data => {
            allAlunos = data;
            renderAlunosTable(data);
            
            // Add search functionality
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.oninput = (e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    const filtered = allAlunos.filter(a => 
                        a.nome.toLowerCase().includes(searchTerm) ||
                        a.email.toLowerCase().includes(searchTerm) ||
                        a.telefone.includes(searchTerm)
                    );
                    renderAlunosTable(filtered);
                };
            }
        })
        .catch(error => {
            console.error('Erro ao carregar alunos:', error);
            showNotification('Erro ao carregar alunos', 'error');
        });
}

function renderAlunosTable(alunos) {
    const tbody = document.getElementById("aluno-tbody");
    if (!tbody) return;
    
    tbody.innerHTML = "";
    
    alunos.forEach(a => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${a.id}</td>
            <td><strong>${escapeHtml(a.nome)}</strong></td>
            <td>${escapeHtml(a.email)}</td>
            <td>${escapeHtml(a.telefone)}</td>
            <td>
                <button class="btn btn-edit" onclick="editar(${a.id}, \`${escapeHtml(a.nome)}\`, \`${escapeHtml(a.email)}\`, \`${escapeHtml(a.telefone)}\`)">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-delete" onclick="excluir(${a.id})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function atualizarDashboard() {
    fetch("http://localhost:8080/alunos")
        .then(r => r.json())
        .then(data => {
            // Update total alunos
            const totalAlunos = document.getElementById('totalAlunos');
            if (totalAlunos) totalAlunos.textContent = data.length;
            
            // Update recent students
            renderRecentStudents(data.slice(-5).reverse());
        })
        .catch(error => {
            console.error('Erro ao atualizar dashboard:', error);
        });
}

function renderRecentStudents(alunos) {
    const tbody = document.getElementById('recent-alunos-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    alunos.forEach(aluno => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${escapeHtml(aluno.nome)}</strong></td>
            <td>${escapeHtml(aluno.email)}</td>
            <td>${escapeHtml(aluno.telefone)}</td>
            <td>${new Date().toLocaleDateString('pt-BR')}</td>
        `;
        tbody.appendChild(tr);
    });
}

function abrirModal() {
    editId = null;
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modalTitle");
    if (modalTitle) modalTitle.textContent = "Novo Aluno";
    if (modal) modal.style.display = "flex";
    limpar();
}

function fecharModal() {
    const modal = document.getElementById("modal");
    if (modal) modal.style.display = "none";
}

function limpar() {
    document.getElementById("nome").value = "";
    document.getElementById("email").value = "";
    document.getElementById("telefone").value = "";
}

function salvar() {
    const aluno = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        telefone: document.getElementById("telefone").value
    };
    
    if (!aluno.nome || !aluno.email) {
        showNotification('Preencha nome e email', 'warning');
        return;
    }
    
    const url = editId == null 
        ? "http://localhost:8080/alunos"
        : `http://localhost:8080/alunos/${editId}`;
    
    const method = editId == null ? "POST" : "PUT";
    
    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aluno)
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro ao salvar');
        fecharModal();
        carregar();
        showNotification(editId == null ? 'Aluno cadastrado!' : 'Aluno atualizado!', 'success');
    })
    .catch(error => {
        console.error('Erro:', error);
        showNotification('Erro ao salvar aluno', 'error');
    });
}

function excluir(id) {
    if (!confirm("Tem certeza que deseja excluir este aluno?")) return;
    
    fetch(`http://localhost:8080/alunos/${id}`, {
        method: "DELETE"
    })
    .then(() => {
        carregar();
        showNotification('Aluno excluído!', 'success');
    })
    .catch(error => {
        console.error('Erro:', error);
        showNotification('Erro ao excluir aluno', 'error');
    });
}

function editar(id, nome, email, telefone) {
    editId = id;
    document.getElementById("nome").value = nome;
    document.getElementById("email").value = email;
    document.getElementById("telefone").value = telefone;
    
    const modalTitle = document.getElementById("modalTitle");
    if (modalTitle) modalTitle.textContent = "Editar Aluno";
    
    const modal = document.getElementById("modal");
    if (modal) modal.style.display = "flex";
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Style notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '12px';
    notification.style.backgroundColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#f59e0b';
    notification.style.color = 'white';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '10px';
    notification.style.zIndex = '1001';
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    notification.style.fontSize = '14px';
    notification.style.fontWeight = '500';
    notification.style.animation = 'slideUp 0.3s ease';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}