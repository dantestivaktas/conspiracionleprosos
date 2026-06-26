/* ============================================
   EL JUICIO DEL REY — LÓGICA DEL JUEGO
   ============================================ */

// ==================== DATOS DEL JUEGO ====================

const CHARACTERS = {
    aldeano: {
        name: 'El Aldeano',
        role: 'Campesino de la aldea de Chinon',
        portrait: 'assets/aldeano_portrait.png',
        dialogues: [
            {
                lines: [
                    'Mi señor, gracias por escuchar a un humilde campesino...',
                    'Veréis, el otro día estaba en el mercado cuando oí a varios vecinos hablar sobre los pozos...',
                    'Uno de ellos juró haber visto a un leproso merodeando cerca del pozo principal al anochecer.',
                    'Dijo que el leproso llevaba un saco con polvos extraños y que hacía gestos como si practicara magia negra.',
                    '"¡Vi a un leproso hacer magia negra cerca del pozo!" — fueron sus palabras exactas, mi señor.',
                ],
                card: {
                    id: 'rumor_1',
                    type: 'rumor',
                    text: '"Vi a un leproso hacer magia negra cerca del pozo."',
                    shortText: 'Magia negra en el pozo',
                    source: 'Aldeano',
                    icon: '🔮'
                }
            },
            {
                lines: [
                    'Hay algo más que debería deciros, mi señor...',
                    'He vivido junto al pozo principal toda mi vida. Conozco esas aguas mejor que nadie.',
                    'La semana pasada, después de todos los rumores, fui yo mismo a examinar el agua.',
                    'El agua fluye limpia, clara como siempre. No tiene olor extraño ni color diferente.',
                    'He bebido de ese pozo cada día y no he enfermado. El agua no muestra contaminación alguna.',
                ],
                card: {
                    id: 'hecho_1',
                    type: 'hecho',
                    text: '"El agua fluye limpia y no muestra contaminación."',
                    shortText: 'Agua limpia sin contaminar',
                    source: 'Aldeano',
                    icon: '💧'
                }
            }
        ],
        currentDialogue: 0,
        currentLine: 0,
        cardsGiven: 0
    },
    monje: {
        name: 'El Monje',
        role: 'Hermano Bernardo, Monje del monasterio de Saint-Denis',
        portrait: 'assets/monje_portrait.png',
        dialogues: [
            {
                lines: [
                    'Paz sea con vos, consejero. Habéis venido a buscar la verdad, y eso os honra.',
                    'En el monasterio hemos estudiado los textos médicos de Galeno e Hipócrates durante años.',
                    'La lepra es una enfermedad de la piel y los nervios. Se manifiesta lentamente, a lo largo de años.',
                    'Los médicos árabes, que son los más sabios en estas artes, han documentado que la lepra no se contagia fácilmente.',
                    'La enfermedad no se propaga de la manera en que el pueblo cree. No se transmite por el agua ni por conjuros.',
                ],
                card: {
                    id: 'hecho_2',
                    type: 'hecho',
                    text: '"La enfermedad no se propaga de esa manera."',
                    shortText: 'No se propaga así',
                    source: 'Monje',
                    icon: '📖'
                }
            },
            {
                lines: [
                    'Debo confesar que no todos los rumores vienen del pueblo llano...',
                    'Un mercader que comercia con Aragón trajo noticias inquietantes hace un mes.',
                    'Dice que los leprosos de Francia hicieron un pacto secreto con un rey musulmán.',
                    'Supuestamente, a cambio de oro, envenenarían las fuentes del reino para debilitar la Cristiandad.',
                    '"Dicen que hicieron un pacto con un rey musulmán" — así lo relató el mercader.',
                ],
                card: {
                    id: 'rumor_2',
                    type: 'rumor',
                    text: '"Dicen que hicieron un pacto con un rey musulmán."',
                    shortText: 'Pacto con rey musulmán',
                    source: 'Monje',
                    icon: '👑'
                }
            }
        ],
        currentDialogue: 0,
        currentLine: 0,
        cardsGiven: 0
    },
    leproso: {
        name: 'El Leproso',
        role: 'Jean de Limoges, enfermo de la leprosería de Tours',
        portrait: 'assets/leproso_portrait.png',
        dialogues: [
            {
                lines: [
                    '*tose*... Os agradezco que os dignéis a hablar conmigo, mi señor...',
                    'La gente nos evita. Nos temen. Pero no somos monstruos, solo estamos enfermos.',
                    'Vivimos aislados en la leprosería por orden real, no tenemos acceso a los pozos de la aldea.',
                    'Los guardias vigilan nuestras puertas día y noche. No podríamos salir aunque quisiéramos.',
                    'Ningún enfermo ha salido de la leprosería en meses. Tenemos nuestro propio pozo.',
                ],
                card: {
                    id: 'hecho_3',
                    type: 'hecho',
                    text: '"Vivimos aislados, no tenemos acceso a los pozos de la aldea."',
                    shortText: 'Sin acceso a pozos',
                    source: 'Leproso',
                    icon: '🏥'
                }
            },
            {
                lines: [
                    'Hay algo más que os contaré, porque sé que otros no lo harán...',
                    'Antes de enfermar, yo era herrero. Tenía amigos en la taberna.',
                    'Uno de mis antiguos compañeros, borracho una noche, dijo que vio a los leprosos reunirse en secreto bajo la luna.',
                    'Dijo que preparaban brebajes con sapos y hierbas malditas para echar a las fuentes.',
                    '"Los leprosos preparan brebajes con sapos y hierbas malditas" — eso repiten en la taberna.',
                ],
                card: {
                    id: 'rumor_3',
                    type: 'rumor',
                    text: '"Los leprosos preparan brebajes con sapos y hierbas malditas."',
                    shortText: 'Brebajes malditos',
                    source: 'Leproso',
                    icon: '🐸'
                }
            }
        ],
        currentDialogue: 0,
        currentLine: 0,
        cardsGiven: 0
    }
};

// ==================== ESTADO DEL JUEGO ====================

let gameState = {
    phase: 'start',           // 'start', 'investigation', 'trial', 'result'
    inventory: [],             // array of card objects
    totalCards: 6,
    selectedTrialCards: [],    // IDs of selected cards during trial
    activeCharacter: null,     // currently open dialogue character key
    dialogueStep: 0            // line within current dialogue
};

// ==================== NAVEGACIÓN ENTRE PANTALLAS ====================

function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
        screen.style.display = 'none';
    });

    const target = document.getElementById(screenId);
    if (target) {
        target.style.display = 'flex';
        // Force reflow for animation
        void target.offsetWidth;
        target.classList.add('active');
    }
}

// ==================== INICIO DEL JUEGO ====================

function startGame() {
    // Reset all character data
    Object.keys(CHARACTERS).forEach(key => {
        CHARACTERS[key].currentDialogue = 0;
        CHARACTERS[key].currentLine = 0;
        CHARACTERS[key].cardsGiven = 0;
    });

    // Reset game state
    gameState = {
        phase: 'investigation',
        inventory: [],
        totalCards: 6,
        selectedTrialCards: [],
        activeCharacter: null,
        dialogueStep: 0
    };

    // Reset UI
    updateInventoryUI();
    updateCardCounter();
    updateCharacterBadges();
    resetCharacterPanels();
    document.getElementById('btn-go-king').classList.add('hidden');

    showScreen('screen-investigation');
}

function restartGame() {
    showScreen('screen-start');
}

// ==================== DIÁLOGOS ====================

function openDialogue(characterKey) {
    const char = CHARACTERS[characterKey];
    if (!char || char.cardsGiven >= 2) return;

    gameState.activeCharacter = characterKey;
    gameState.dialogueStep = 0;

    const dialogueData = char.dialogues[char.currentDialogue];
    if (!dialogueData) return;

    // Set modal content
    document.getElementById('dialogue-portrait').src = char.portrait;
    document.getElementById('dialogue-portrait').alt = char.name;
    document.getElementById('dialogue-name').textContent = char.name;
    document.getElementById('dialogue-role').textContent = char.role;

    // Show first line
    showDialogueLine(dialogueData.lines[0]);
    updateDialogueButton(dialogueData.lines.length, 0);

    // Show modal
    const modal = document.getElementById('dialogue-modal');
    modal.classList.remove('hidden');
}

function showDialogueLine(text) {
    const textEl = document.getElementById('dialogue-text');
    textEl.style.opacity = 0;
    setTimeout(() => {
        textEl.textContent = text;
        textEl.style.transition = 'opacity 0.3s ease';
        textEl.style.opacity = 1;
    }, 100);
}

function updateDialogueButton(totalLines, currentStep) {
    const btn = document.getElementById('btn-dialogue-next');
    if (currentStep >= totalLines - 1) {
        btn.innerHTML = 'Obtener Testimonio <span class="btn-arrow">📜</span>';
    } else {
        btn.innerHTML = 'Continuar <span class="btn-arrow">→</span>';
    }
}

function nextDialogue() {
    const charKey = gameState.activeCharacter;
    const char = CHARACTERS[charKey];
    const dialogueData = char.dialogues[char.currentDialogue];

    gameState.dialogueStep++;

    if (gameState.dialogueStep >= dialogueData.lines.length) {
        // Dialogue complete — give card
        giveCard(charKey, dialogueData.card);
        closeDialogue();
        return;
    }

    // Show next line
    showDialogueLine(dialogueData.lines[gameState.dialogueStep]);
    updateDialogueButton(dialogueData.lines.length, gameState.dialogueStep);
}

function closeDialogue() {
    const modal = document.getElementById('dialogue-modal');
    modal.classList.add('hidden');
    gameState.activeCharacter = null;
    gameState.dialogueStep = 0;
}

// ==================== TARJETAS / INVENTARIO ====================

function giveCard(characterKey, card) {
    const char = CHARACTERS[characterKey];

    // Add card to inventory
    gameState.inventory.push({ ...card });
    char.cardsGiven++;
    char.currentDialogue++;

    // Show notification
    showCardNotification(card);

    // Update UI
    updateInventoryUI();
    updateCardCounter();
    updateCharacterBadges();

    // Check if character is exhausted
    if (char.cardsGiven >= 2) {
        const panel = document.getElementById(`char-${characterKey}`);
        if (panel) panel.classList.add('exhausted');
    }

    // Check if all cards collected
    if (gameState.inventory.length >= gameState.totalCards) {
        setTimeout(() => {
            document.getElementById('btn-go-king').classList.remove('hidden');
            document.getElementById('instruction-banner').querySelector('p').textContent =
                '¡Has recolectado todos los testimonios! Ahora debes presentarte ante el Rey.';
        }, 2000);
    }
}

function showCardNotification(card) {
    const notif = document.getElementById('card-notification');
    const preview = document.getElementById('notif-card-text');
    preview.textContent = card.text;

    notif.classList.remove('hidden');

    // Auto-hide after 2s
    setTimeout(() => {
        notif.classList.add('hidden');
    }, 2200);
}

function updateInventoryUI() {
    for (let i = 0; i < 6; i++) {
        const slot = document.getElementById(`slot-${i}`);
        if (i < gameState.inventory.length) {
            const card = gameState.inventory[i];
            slot.classList.remove('empty');
            slot.classList.add('filled', 'just-filled');
            slot.innerHTML = `
                <div class="slot-content">
                    <span class="slot-icon">${card.icon}</span>
                    <span class="slot-label">${card.shortText}</span>
                    <span class="slot-source">${card.source}</span>
                </div>
                <div class="slot-tooltip">
                    <p class="slot-tooltip-text">${card.text}</p>
                </div>
            `;
            // Remove animation class after animation completes
            setTimeout(() => {
                slot.classList.remove('just-filled');
            }, 600);
        } else {
            slot.classList.add('empty');
            slot.classList.remove('filled');
            slot.innerHTML = `<span class="slot-number">${['I','II','III','IV','V','VI'][i]}</span>`;
        }
    }
}

function updateCardCounter() {
    const current = document.getElementById('counter-current');
    if (current) {
        current.textContent = gameState.inventory.length;
    }
}

function updateCharacterBadges() {
    Object.keys(CHARACTERS).forEach(key => {
        const char = CHARACTERS[key];
        const badge = document.getElementById(`badge-${key}`);
        if (badge) {
            badge.querySelector('span').textContent = char.cardsGiven;
            if (char.cardsGiven >= 2) {
                badge.classList.add('complete');
            } else {
                badge.classList.remove('complete');
            }
        }
    });
}

function resetCharacterPanels() {
    Object.keys(CHARACTERS).forEach(key => {
        const panel = document.getElementById(`char-${key}`);
        if (panel) panel.classList.remove('exhausted');
    });
}

// ==================== FASE 2: JUICIO ====================

function goToKing() {
    gameState.phase = 'trial';
    gameState.selectedTrialCards = [];
    renderTrialCards();
    showScreen('screen-trial');
}

function renderTrialCards() {
    const container = document.getElementById('trial-cards');
    container.innerHTML = '';

    // Shuffle cards for the trial display
    const shuffled = [...gameState.inventory].sort(() => Math.random() - 0.5);

    shuffled.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'trial-card';
        cardEl.id = `trial-card-${card.id}`;
        cardEl.dataset.cardId = card.id;
        cardEl.innerHTML = `
            <div class="trial-card-source">${card.source}</div>
            <div class="trial-card-icon">${card.icon}</div>
            <p class="trial-card-text">${card.text}</p>
        `;
        cardEl.addEventListener('click', () => toggleTrialCard(card.id, cardEl));
        container.appendChild(cardEl);
    });

    updateTrialSelectionCount();
    document.getElementById('btn-present').classList.add('hidden');
}

function toggleTrialCard(cardId, element) {
    const idx = gameState.selectedTrialCards.indexOf(cardId);

    if (idx > -1) {
        // Deselect
        gameState.selectedTrialCards.splice(idx, 1);
        element.classList.remove('selected');
    } else {
        // Select (max 3)
        if (gameState.selectedTrialCards.length >= 3) {
            // Flash a warning — can't select more
            shakeElement(element);
            return;
        }
        gameState.selectedTrialCards.push(cardId);
        element.classList.add('selected');
    }

    updateTrialSelectionCount();

    // Show/hide present button
    const btn = document.getElementById('btn-present');
    if (gameState.selectedTrialCards.length === 3) {
        btn.classList.remove('hidden');
    } else {
        btn.classList.add('hidden');
    }
}

function shakeElement(el) {
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = 'shake 0.4s ease';
}

// Add shake keyframes dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);

function updateTrialSelectionCount() {
    document.getElementById('selected-count').textContent = gameState.selectedTrialCards.length;
}

// ==================== PRESENTAR EVIDENCIA ====================

function presentEvidence() {
    if (gameState.selectedTrialCards.length !== 3) return;

    // Check if any rumor card is selected
    const hasRumor = gameState.selectedTrialCards.some(cardId => {
        const card = gameState.inventory.find(c => c.id === cardId);
        return card && card.type === 'rumor';
    });

    if (hasRumor) {
        // DEFEAT — at least one rumor was selected
        showScreen('screen-defeat');
    } else {
        // VICTORY — all 3 are facts
        showScreen('screen-victory');
    }
}

// ==================== INICIALIZACIÓN ====================

document.addEventListener('DOMContentLoaded', () => {
    showScreen('screen-start');
});
