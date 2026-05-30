// Data Storage
let issues = JSON.parse(localStorage.getItem('campusIssues')) || [];

// Initialize sample data if empty
if (issues.length === 0) {
    const sampleIssues = [
        {
            id: Date.now() + 1,
            reporterName: "John Smith",
            studentId: "STU001",
            email: "john@university.edu",
            issueType: "facility",
            location: "Science Building, Room 301",
            title: "Broken Chair in Classroom",
            description: "Several chairs in the lecture hall are broken and need replacement. About 5 chairs have broken armrests and 2 are completely unstable.",
            urgency: "medium",
            status: "pending",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: Date.now() + 2,
            reporterName: "Sarah Johnson",
            studentId: "STU002",
            email: "sarah@university.edu",
            issueType: "cleaning",
            location: "Library, 2nd Floor",
            title: "Trash Overflow",
            description: "Trash bins near study areas are overflowing and need immediate attention. Creating unpleasant smell in the area.",
            urgency: "medium",
            status: "in-progress",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: Date.now() + 3,
            reporterName: "Mike Chen",
            studentId: "STU003",
            email: "mike@university.edu",
            issueType: "electrical",
            location: "Student Center, Hallway",
            title: "Flickering Lights",
            description: "Lights in the main hallway are flickering constantly. This is a safety hazard especially during evening hours.",
            urgency: "high",
            status: "resolved",
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: Date.now() + 4,
            reporterName: "Emily Davis",
            studentId: "STU004",
            email: "emily@university.edu",
            issueType: "plumbing",
            location: "Engineering Building, 1st Floor Restroom",
            title: "Leaking Faucet",
            description: "The sink faucet in the men's restroom has been leaking continuously for 3 days. Water is being wasted.",
            urgency: "medium",
            status: "pending",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: Date.now() + 5,
            reporterName: "David Wilson",
            studentId: "STU005",
            email: "david@university.edu",
            issueType: "it",
            location: "Library Computer Lab",
            title: "Printer Not Working",
            description: "The main printer in the computer lab is showing error messages and won't print any documents.",
            urgency: "high",
            status: "in-progress",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];
    issues = sampleIssues;
    saveIssues();
}

function saveIssues() {
    localStorage.setItem('campusIssues', JSON.stringify(issues));
}

// Helper Functions
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.style.backgroundColor = type === 'success' ? '#10b981' : '#ef4444';
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
}

function updateStats() {
    const totalIssues = document.getElementById('totalIssues');
    const pendingIssues = document.getElementById('pendingIssues');
    const resolvedIssues = document.getElementById('resolvedIssues');
    
    if (totalIssues) {
        totalIssues.textContent = issues.length;
        pendingIssues.textContent = issues.filter(i => i.status === 'pending' || i.status === 'in-progress').length;
        resolvedIssues.textContent = issues.filter(i => i.status === 'resolved').length;
    }
}

// Form Submission
const issueForm = document.getElementById('issueForm');
if (issueForm) {
    issueForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newIssue = {
            id: Date.now(),
            reporterName: document.getElementById('reporterName').value,
            studentId: document.getElementById('studentId').value,
            email: document.getElementById('email').value,
            issueType: document.getElementById('issueType').value,
            location: document.getElementById('location').value,
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            urgency: document.getElementById('urgency').value,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        issues.unshift(newIssue);
        saveIssues();
        showNotification('✓ Issue reported successfully!');
        issueForm.reset();
        
        setTimeout(() => {
            window.location.href = 'view-issues.html';
        }, 1500);
    });
}

// Display Issues - CARD GRID VERSION
function displayIssues() {
    const issuesList = document.getElementById('issuesList');
    if (!issuesList) return;
    
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    const typeFilter = document.getElementById('typeFilter')?.value || 'all';
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    
    let filteredIssues = issues.filter(issue => {
        if (statusFilter !== 'all' && issue.status !== statusFilter) return false;
        if (typeFilter !== 'all' && issue.issueType !== typeFilter) return false;
        if (searchTerm && !issue.title.toLowerCase().includes(searchTerm) && 
            !issue.location.toLowerCase().includes(searchTerm)) return false;
        return true;
    });
    
    if (filteredIssues.length === 0) {
        issuesList.innerHTML = '<div class="empty-state">✨ No issues found. Try adjusting your filters or report a new issue!</div>';
        return;
    }
    
    issuesList.innerHTML = filteredIssues.map((issue, index) => {
        const urgencyEmoji = {
            low: '🟢',
            medium: '🟡',
            high: '🟠',
            critical: '🔴'
        };
        
        const urgencyText = {
            low: 'LOW',
            medium: 'MEDIUM',
            high: 'HIGH',
            critical: 'CRITICAL'
        };
        
        return `
            <div class="issue-card">
                <div class="issue-header">
                    <span class="issue-id">#${(issues.length - issues.indexOf(issue))}</span>
                    <span class="badge badge-${issue.status === 'pending' ? 'pending' : issue.status === 'in-progress' ? 'progress' : 'resolved'}">
                        ${issue.status === 'pending' ? '⏳' : issue.status === 'in-progress' ? '🔄' : '✅'} ${formatStatus(issue.status)}
                    </span>
                </div>
                <h3>${escapeHtml(issue.title)}</h3>
                <p class="issue-description">${escapeHtml(issue.description.substring(0, 100))}${issue.description.length > 100 ? '...' : ''}</p>
                <div class="issue-details">
                    <span class="detail-tag">📍 ${escapeHtml(issue.location)}</span>
                    <span class="detail-tag">📂 ${formatIssueType(issue.issueType)}</span>
                    <span class="detail-tag">${urgencyEmoji[issue.urgency]} ${urgencyText[issue.urgency]}</span>
                    <span class="detail-tag">📅 ${formatDate(issue.createdAt)}</span>
                </div>
                <div class="issue-details">
                    <span class="detail-tag">👤 ${escapeHtml(issue.reporterName)}</span>
                    <span class="detail-tag">📧 ${escapeHtml(issue.email)}</span>
                    <span class="detail-tag">🆔 ${escapeHtml(issue.studentId)}</span>
                </div>
                <button onclick="updateIssueStatus(${issue.id})" class="status-btn">
                    ${issue.status === 'pending' ? '🔄 Mark In Progress' : issue.status === 'in-progress' ? '✅ Mark Resolved' : '✓ Completed'}
                </button>
            </div>
        `;
    }).join('');
}

function updateIssueStatus(issueId) {
    const issue = issues.find(i => i.id === issueId);
    if (issue) {
        const statuses = ['pending', 'in-progress', 'resolved'];
        const currentIndex = statuses.indexOf(issue.status);
        const nextStatus = statuses[(currentIndex + 1) % statuses.length];
        issue.status = nextStatus;
        saveIssues();
        displayIssues();
        updateStats();
        if (typeof updateDashboard === 'function') updateDashboard();
        showNotification(`✓ Status updated to ${formatStatus(nextStatus)}`);
    }
}

// Dashboard Functions
function updateDashboard() {
    const totalIssues = issues.length;
    const pendingIssues = issues.filter(i => i.status === 'pending').length;
    const inProgressIssues = issues.filter(i => i.status === 'in-progress').length;
    const resolvedIssues = issues.filter(i => i.status === 'resolved').length;
    
    const dashTotal = document.getElementById('dashTotal');
    if (dashTotal) dashTotal.textContent = totalIssues;
    const dashPending = document.getElementById('dashPending');
    if (dashPending) dashPending.textContent = pendingIssues;
    const dashProgress = document.getElementById('dashProgress');
    if (dashProgress) dashProgress.textContent = inProgressIssues;
    const dashResolved = document.getElementById('dashResolved');
    if (dashResolved) dashResolved.textContent = resolvedIssues;
    
    // Charts
    if (typeof Chart !== 'undefined') {
        const statusCtx = document.getElementById('statusChart')?.getContext('2d');
        if (statusCtx) {
            new Chart(statusCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Pending', 'In Progress', 'Resolved'],
                    datasets: [{
                        data: [pendingIssues, inProgressIssues, resolvedIssues],
                        backgroundColor: ['#f59e0b', '#6366f1', '#10b981'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#f1f5f9'
                            }
                        }
                    }
                }
            });
        }
        
        const issueTypes = ['facility', 'cleaning', 'safety', 'electrical', 'plumbing', 'it'];
        const typeCounts = issueTypes.map(type => 
            issues.filter(i => i.issueType === type).length
        );
        
        const typeCtx = document.getElementById('typeChart')?.getContext('2d');
        if (typeCtx) {
            new Chart(typeCtx, {
                type: 'bar',
                data: {
                    labels: issueTypes.map(t => formatIssueType(t)),
                    datasets: [{
                        label: 'Number of Issues',
                        data: typeCounts,
                        backgroundColor: '#6366f1',
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#f1f5f9'
                            }
                        }
                    },
                    scales: {
                        y: {
                            ticks: { color: '#cbd5e1' },
                            grid: { color: 'rgba(255,255,255,0.1)' }
                        },
                        x: {
                            ticks: { color: '#cbd5e1' },
                            grid: { color: 'rgba(255,255,255,0.1)' }
                        }
                    }
                }
            });
        }
    }
    
    // Recent Issues
    const recentIssuesList = document.getElementById('recentIssuesList');
    if (recentIssuesList) {
        const recentIssues = issues.slice(0, 5);
        recentIssuesList.innerHTML = recentIssues.map(issue => `
            <div class="issue-card" style="margin-bottom: 0.75rem;">
                <div class="issue-header">
                    <h3 style="font-size: 1rem;">${escapeHtml(issue.title)}</h3>
                    <span class="badge badge-${issue.status === 'pending' ? 'pending' : issue.status === 'in-progress' ? 'progress' : 'resolved'}">
                        ${formatStatus(issue.status)}
                    </span>
                </div>
                <div class="issue-details">
                    <span class="detail-tag">📍 ${escapeHtml(issue.location)}</span>
                    <span class="detail-tag">📅 ${formatDate(issue.createdAt)}</span>
                </div>
            </div>
        `).join('');
    }
}

// Utility Functions
function formatIssueType(type) {
    const types = {
        facility: '🏢 Facility',
        cleaning: '🧹 Cleaning',
        safety: '⚠️ Safety',
        electrical: '⚡ Electrical',
        plumbing: '🚰 Plumbing',
        it: '💻 IT',
        other: '📌 Other'
    };
    return types[type] || type;
}

function formatStatus(status) {
    const statuses = {
        pending: 'Pending',
        'in-progress': 'In Progress',
        resolved: 'Resolved'
    };
    return statuses[status] || status;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    // Update stats on all pages
    updateStats();
    
    // Display issues only on view-issues page
    if (document.getElementById('issuesList')) {
        displayIssues();
    }
    
    // Update dashboard only on dashboard page
    if (document.getElementById('dashTotal')) {
        updateDashboard();
    }
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Filter event listeners
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('typeFilter');
    const searchInput = document.getElementById('searchInput');
    
    if (statusFilter) statusFilter.addEventListener('change', displayIssues);
    if (typeFilter) typeFilter.addEventListener('change', displayIssues);
    if (searchInput) searchInput.addEventListener('input', displayIssues);
});

// Make functions global for onclick handlers
window.updateIssueStatus = updateIssueStatus;