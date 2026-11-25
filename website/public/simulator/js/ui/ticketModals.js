/**
 * NammaRide QR Ticket Vault, Turnstile Fullscreen Gate View & Pass Advisor Modals
 */

import { T_STATION } from '../utils/helpers.js';

let pendingTicketFile = null;
let wakeLockSentinel = null;

export function getActiveTicketData() {
    try {
        return sessionStorage.getItem('activeJourneyTicketImage') || localStorage.getItem('nammaride_active_ticket') || null;
    } catch (e) {
        return null;
    }
}

export function setActiveTicketData(data) {
    try {
        if (data) {
            sessionStorage.setItem('activeJourneyTicketImage', data);
            localStorage.setItem('nammaride_active_ticket', data);
        } else {
            sessionStorage.removeItem('activeJourneyTicketImage');
            localStorage.removeItem('nammaride_active_ticket');
        }
    } catch (e) {
        console.warn('[TicketStorage] Storage quota/write error:', e);
    }
    const dot = document.getElementById('qr-pill-dot');
    if (dot) {
        if (data) dot.classList.remove('hidden');
        else dot.classList.add('hidden');
    }
}

async function requestScreenWakeLock() {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
        try {
            wakeLockSentinel = await navigator.wakeLock.request('screen');
        } catch (err) {}
    }
}

function releaseScreenWakeLock() {
    if (wakeLockSentinel) {
        try { wakeLockSentinel.release(); } catch (e) {}
        wakeLockSentinel = null;
    }
}

export function openPassAdvisorModal() {
    const modal = document.getElementById('pass-advisor-modal');
    if (modal) {
        modal.classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
    }
}

export function closePassAdvisorModal() {
    const modal = document.getElementById('pass-advisor-modal');
    if (modal) modal.classList.add('hidden');
}

export function initTicketModule({ getCurrentJourney, getSimulationState, onStartWithoutOrWithTicket, onRerenderRoute }) {
    const uploadModal = document.getElementById('ticket-upload-modal');
    const dropzone = document.getElementById('ticket-dropzone');
    const fileInput = document.getElementById('ticket-file-input');
    const previewContainer = document.getElementById('ticket-preview-container');
    const previewImg = document.getElementById('ticket-preview-img');
    const dropzonePrompt = document.getElementById('ticket-dropzone-prompt');
    const confirmBtn = document.getElementById('ticket-upload-confirm');
    const skipBtn = document.getElementById('ticket-upload-skip');
    const closeUploadBtn = document.getElementById('ticket-upload-close');

    const qrScannerModal = document.getElementById('qr-scanner-modal');
    const qrCloseBtn = document.getElementById('qr-scanner-close');
    const qrModalImg = document.getElementById('qr-modal-img');
    const qrEmptyState = document.getElementById('qr-modal-empty-state');
    const qrReuploadBtn = document.getElementById('qr-modal-reupload-btn');
    const qrRemoveBtn = document.getElementById('qr-modal-remove-btn');
    const floatingQrBtn = document.getElementById('floating-qr-btn');

    const qrFullscreenOverlay = document.getElementById('qr-fullscreen-overlay');
    const qrFsImg = document.getElementById('qr-fs-img');
    const qrFsCloseBtn = document.getElementById('qr-fullscreen-close');
    const openFsBtn = document.getElementById('open-qr-fullscreen-btn');
    const imgWrapper = document.getElementById('qr-modal-img-wrapper');

    function handleTicketFileSelect(file) {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            pendingTicketFile = e.target.result;
            if (previewImg) previewImg.src = pendingTicketFile;
            if (previewContainer) previewContainer.classList.remove('hidden');
            if (dropzonePrompt) dropzonePrompt.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }

    if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());
        ['dragenter', 'dragover'].forEach((eventName) => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault(); e.stopPropagation();
                dropzone.classList.add('drag-over');
            }, false);
        });
        ['dragleave', 'drop'].forEach((eventName) => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault(); e.stopPropagation();
                dropzone.classList.remove('drag-over');
            }, false);
        });
        dropzone.addEventListener('drop', (e) => {
            if (e.dataTransfer?.files?.[0]) handleTicketFileSelect(e.dataTransfer.files[0]);
        });
        fileInput.addEventListener('change', (e) => {
            if (e.target.files?.[0]) handleTicketFileSelect(e.target.files[0]);
        });
    }

    window.openTicketUploadModal = function () {
        if (!uploadModal) return;
        const currentSaved = getActiveTicketData();
        if (currentSaved && !pendingTicketFile) {
            pendingTicketFile = currentSaved;
            if (previewImg) previewImg.src = currentSaved;
            if (previewContainer) previewContainer.classList.remove('hidden');
            if (dropzonePrompt) dropzonePrompt.classList.add('hidden');
        }
        uploadModal.classList.add('modal-active');
        if (window.lucide) window.lucide.createIcons();
    };

    window.closeTicketUploadModal = function () {
        if (uploadModal) uploadModal.classList.remove('modal-active');
    };

    if (closeUploadBtn) closeUploadBtn.addEventListener('click', window.closeTicketUploadModal);
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            window.closeTicketUploadModal();
            const currentJourney = getCurrentJourney();
            const simulationState = getSimulationState();
            if (currentJourney && !simulationState.isActive && !simulationState.arrivedAtDestination) {
                onStartWithoutOrWithTicket(currentJourney);
            }
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (pendingTicketFile) setActiveTicketData(pendingTicketFile);
            window.closeTicketUploadModal();
            const currentJourney = getCurrentJourney();
            const simulationState = getSimulationState();
            if (simulationState.arrivedAtDestination) {
                window.openQRScannerModal();
            } else if (currentJourney && !simulationState.isActive) {
                onStartWithoutOrWithTicket(currentJourney);
            } else if (currentJourney) {
                onRerenderRoute(currentJourney);
            }
        });
    }

    window.openQRFullscreen = function () {
        const ticketData = getActiveTicketData();
        if (!ticketData || !qrFullscreenOverlay) return;
        if (qrFsImg) qrFsImg.src = ticketData;

        const currentJourney = getCurrentJourney();
        const routeTitleEl = document.getElementById('qr-fs-route-title');
        if (currentJourney && routeTitleEl) {
            const startPart = currentJourney.parts[0]?.stations[0];
            const lastPart = currentJourney.parts[currentJourney.parts.length - 1];
            const endStation = lastPart?.stations[lastPart.stations.length - 1];
            if (startPart && endStation) {
                routeTitleEl.innerText = `${T_STATION(startPart.name)} -> ${T_STATION(endStation.name)} • Platform ${currentJourney.parts[0]?.startPlatform || 1}`;
            }
        }
        qrFullscreenOverlay.classList.add('modal-active');
        requestScreenWakeLock();
        if (window.lucide) window.lucide.createIcons();
    };

    window.closeQRFullscreen = function () {
        if (!qrFullscreenOverlay) return;
        qrFullscreenOverlay.classList.remove('modal-active');
        releaseScreenWakeLock();
    };

    window.openQRScannerModal = function () {
        if (!qrScannerModal) return;
        const ticketData = getActiveTicketData();
        const routeSubEl = document.getElementById('qr-modal-route-sub');
        const currentJourney = getCurrentJourney();

        if (currentJourney) {
            const startPart = currentJourney.parts[0]?.stations[0];
            const lastPart = currentJourney.parts[currentJourney.parts.length - 1];
            const endStation = lastPart?.stations[lastPart.stations.length - 1];
            if (startPart && endStation && routeSubEl) {
                routeSubEl.innerText = `${T_STATION(startPart.name)} -> ${T_STATION(endStation.name)} • Platform ${currentJourney.parts[0]?.startPlatform || 1}`;
            }
        }

        if (ticketData) {
            if (qrModalImg) { qrModalImg.src = ticketData; qrModalImg.classList.remove('hidden'); }
            if (qrEmptyState) qrEmptyState.classList.add('hidden');
            if (openFsBtn) openFsBtn.classList.remove('hidden');
        } else {
            if (qrModalImg) qrModalImg.classList.add('hidden');
            if (qrEmptyState) qrEmptyState.classList.remove('hidden');
            if (openFsBtn) openFsBtn.classList.add('hidden');
        }
        qrScannerModal.classList.add('modal-active');
        if (window.lucide) window.lucide.createIcons();
    };

    window.closeQRScannerModal = function () {
        if (!qrScannerModal) return;
        qrScannerModal.classList.remove('modal-active');
        window.closeQRFullscreen();
    };

    qrCloseBtn?.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        window.closeQRScannerModal();
    });
    qrScannerModal?.addEventListener('click', (e) => {
        if (e.target === qrScannerModal) { e.preventDefault(); e.stopPropagation(); window.closeQRScannerModal(); }
    });
    document.getElementById('qr-empty-upload-btn')?.addEventListener('click', () => {
        window.closeQRScannerModal(); window.openTicketUploadModal();
    });
    qrReuploadBtn?.addEventListener('click', () => {
        window.closeQRScannerModal(); window.openTicketUploadModal();
    });
    qrRemoveBtn?.addEventListener('click', () => {
        setActiveTicketData(null);
        pendingTicketFile = null;
        if (previewImg) previewImg.src = '';
        if (previewContainer) previewContainer.classList.add('hidden');
        if (dropzonePrompt) dropzonePrompt.classList.remove('hidden');
        window.closeQRScannerModal();
        const currentJourney = getCurrentJourney();
        if (currentJourney) onRerenderRoute(currentJourney);
    });

    openFsBtn?.addEventListener('click', window.openQRFullscreen);
    imgWrapper?.addEventListener('click', window.openQRFullscreen);
    qrFsCloseBtn?.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        window.closeQRFullscreen();
    });
    qrFullscreenOverlay?.addEventListener('click', (e) => {
        if (e.target === qrFullscreenOverlay) { e.preventDefault(); e.stopPropagation(); window.closeQRFullscreen(); }
    });
    floatingQrBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (getActiveTicketData()) window.openQRScannerModal();
        else window.openTicketUploadModal();
    });

    const qrDot = document.getElementById('qr-pill-dot');
    if (qrDot) {
        if (getActiveTicketData()) qrDot.classList.remove('hidden');
        else qrDot.classList.add('hidden');
    }
}

