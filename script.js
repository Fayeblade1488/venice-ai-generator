// Venice.ai Generator - Main JavaScript
// Created by Faye Håkansdotter

// Global state
let currentImages = [];
let currentImageBlobs = [];
let currentPromptData = null;
let isGenerating = false;
let isAssistantThinking = false;
let generationHistory = JSON.parse(localStorage.getItem('venice-ai-history') || '[]');
let selectedImageIndex = null;

// Configuration
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
const VENICE_API_BASE = 'https://api.venice.ai/api/v1';

// Enhanced Gemini System Prompt for Natural Language Responses
const GEMINI_SYSTEM_PROMPT = `You are an expert AI prompt engineer specializing in creating maximally potent image generation prompts. Your task is to transform user descriptions into highly detailed, optimized prompts that produce stunning visual results.

Analyze the user's input and create an enhanced prompt using these techniques:

1. **Deep Analysis**: Understand sentiment, intensity, abstractness, and visual themes
2. **Rich Description**: Use vivid, detailed language with sensory elements
3. **Technical Optimization**: Include appropriate artistic styles and technical terms
4. **Lighting & Atmosphere**: Specify mood-appropriate lighting and environmental details
5. **Composition**: Suggest framing, perspective, and visual structure

Always respond in natural, helpful English. Structure your response as:

**Enhanced Prompt:**
[Your optimized prompt here - make it detailed and visually rich]

**Negative Prompt Suggestions:**
[Elements to avoid - be specific to the request]

**Recommended Settings:**
- Steps: [recommend 20-30 for quality]
- CFG Scale: [recommend 6-8 for most cases]
- Style: [suggest an appropriate style preset if relevant]

**Enhancement Notes:**
[Brief explanation of what you enhanced and why]

Focus on creating prompts that are visually rich, technically optimized, and artistically sophisticated. Transform simple descriptions into professional-grade prompts that will generate stunning images.`;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadGenerationHistory();
    setupEventListeners();
    updateRangeValues();
});

function initializeApp() {
    console.log('Venice.ai Generator initialized by Faye Håkansdotter');
    
    // Check for stored API keys
    const storedVeniceKey = localStorage.getItem('venice-api-key');
    const storedGeminiKey = localStorage.getItem('gemini-api-key');
    const storedVeniceFallback = localStorage.getItem('venice-api-key-fallback');
    const storedGeminiFallback = localStorage.getItem('gemini-api-key-fallback');
    
    if (storedVeniceKey) {
        document.getElementById('venice-key').value = storedVeniceKey;
    }
    if (storedGeminiKey) {
        document.getElementById('gemini-key').value = storedGeminiKey;
    }
    if (storedVeniceFallback) {
        document.getElementById('venice-key-fallback').value = storedVeniceFallback;
    }
    if (storedGeminiFallback) {
        document.getElementById('gemini-key-fallback').value = storedGeminiFallback;
    }
}

function setupEventListeners() {
    // Range input updates
    const stepsRange = document.getElementById('steps');
    const cfgRange = document.getElementById('cfg-scale');
    
    stepsRange.addEventListener('input', () => {
        document.getElementById('steps-value').textContent = stepsRange.value;
    });
    
    cfgRange.addEventListener('input', () => {
        document.getElementById('cfg-value').textContent = cfgRange.value;
    });
    
    // API key storage with persistence
    document.getElementById('venice-key').addEventListener('change', function() {
        localStorage.setItem('venice-api-key', this.value);
    });
    
    document.getElementById('gemini-key').addEventListener('change', function() {
        localStorage.setItem('gemini-api-key', this.value);
    });
    
    document.getElementById('venice-key-fallback').addEventListener('change', function() {
        localStorage.setItem('venice-api-key-fallback', this.value);
    });
    
    document.getElementById('gemini-key-fallback').addEventListener('change', function() {
        localStorage.setItem('gemini-api-key-fallback', this.value);
    });
    
    // Enter key for assistant input
    document.getElementById('assistant-input-text').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendToAssistant();
        }
    });
    
    document.getElementById('assistant-input-modal-text').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendToAssistantModal();
        }
    });
    
    // Close action menu when clicking outside
    document.addEventListener('click', function(e) {
        const actionMenu = document.getElementById('image-action-menu');
        if (!actionMenu.contains(e.target) && !e.target.closest('.generated-image-container')) {
            actionMenu.classList.add('hidden');
        }
    });
}

function updateRangeValues() {
    document.getElementById('steps-value').textContent = document.getElementById('steps').value;
    document.getElementById('cfg-value').textContent = document.getElementById('cfg-scale').value;
}

// API key visibility toggle
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
    }
}

// Get API key with fallback support
function getApiKey(type) {
    const primaryKey = document.getElementById(`${type}-key`).value.trim();
    const fallbackKey = document.getElementById(`${type}-key-fallback`).value.trim();
    
    if (primaryKey) {
        return { key: primaryKey, isFallback: false };
    } else if (fallbackKey) {
        return { key: fallbackKey, isFallback: true };
    }
    
    return { key: null, isFallback: false };
}

// Tab switching
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update tab content
    document.getElementById('history-tab').classList.toggle('hidden', tabName !== 'history');
    document.getElementById('assistant-tab').classList.toggle('hidden', tabName !== 'assistant');
}

// Toast notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.getElementById('toast-container').appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Enhanced image generation supporting multiple images
async function generateImages() {
    if (isGenerating) {
        showToast('Generation already in progress', 'warning');
        return;
    }
    
    const prompt = document.getElementById('prompt').value.trim();
    if (!prompt) {
        showToast('Please enter a prompt', 'error');
        return;
    }
    
    const veniceApiData = getApiKey('venice');
    if (!veniceApiData.key) {
        showToast('Please enter your Venice.ai API key', 'error');
        return;
    }
    
    isGenerating = true;
    updateGenerateButton(true);
    
    const numImages = parseInt(document.getElementById('num-images').value);
    currentImages = [];
    currentImageBlobs = [];
    
    try {
        const requestData = {
            model: document.getElementById('image-model').value,
            prompt: prompt,
            negative_prompt: document.getElementById('negative-prompt').value,
            steps: parseInt(document.getElementById('steps').value),
            cfg_scale: parseFloat(document.getElementById('cfg-scale').value),
            format: document.getElementById('output-format').value,
            safe_mode: document.getElementById('safe-mode').checked,
            hide_watermark: document.getElementById('hide-watermark').checked,
            embed_exif_metadata: false
        };
        
        // Store current prompt data for regeneration
        currentPromptData = { ...requestData };
        
        // Handle aspect ratio
        const aspectRatio = document.getElementById('aspect-ratio').value;
        if (aspectRatio === 'square') {
            requestData.width = 1024;
            requestData.height = 1024;
        } else if (aspectRatio === 'tall') {
            requestData.width = 768;
            requestData.height = 1024;
        } else if (aspectRatio === 'wide') {
            requestData.width = 1024;
            requestData.height = 768;
        }
        
        // Handle seed
        const seed = document.getElementById('seed').value;
        if (seed) {
            requestData.seed = parseInt(seed);
        }
        
        // Handle style
        const style = document.getElementById('image-style').value;
        if (style !== 'none') {
            requestData.style_preset = style;
        }
        
        // Generate multiple images
        const promises = [];
        for (let i = 0; i < numImages; i++) {
            // Use different seeds for variety
            const imageRequestData = { ...requestData };
            if (seed) {
                imageRequestData.seed = parseInt(seed) + i;
            }
            
            promises.push(generateSingleImage(veniceApiData.key, imageRequestData, veniceApiData.isFallback));
        }
        
        const results = await Promise.all(promises);
        
        // Process results
        results.forEach((result, index) => {
            if (result.success) {
                currentImages.push(result.imageData);
                const imageBlob = base64ToBlob(result.imageData, `image/${requestData.format}`);
                currentImageBlobs.push(imageBlob);
            }
        });
        
        if (currentImages.length === 0) {
            throw new Error('No images were generated successfully');
        }
        
        displayGeneratedImages();
        showToast(`${currentImages.length} image(s) generated successfully!`, 'success');
        
        // Auto-upscale if enabled
        if (document.getElementById('auto-upscale').checked) {
            setTimeout(() => upscaleAllImages(), 1000);
        }
        
    } catch (error) {
        console.error('Generation error:', error);
        showToast(`Generation failed: ${error.message}`, 'error');
    } finally {
        isGenerating = false;
        updateGenerateButton(false);
    }
}

async function generateSingleImage(apiKey, requestData, isFallback) {
    try {
        const response = await fetch(`${VENICE_API_BASE}/image/generate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (!result.images || !result.images[0]) {
            throw new Error('No image data received');
        }
        
        return { success: true, imageData: result.images[0] };
    } catch (error) {
        console.error(`Image generation failed${isFallback ? ' (fallback key)' : ''}:`, error);
        return { success: false, error: error.message };
    }
}

function displayGeneratedImages() {
    const imagesGrid = document.getElementById('images-grid');
    imagesGrid.innerHTML = '';
    
    currentImages.forEach((imageData, index) => {
        const container = document.createElement('div');
        container.className = 'generated-image-container';
        container.onclick = (e) => showImageActions(e, index);
        
        const img = document.createElement('img');
        const imageBlob = currentImageBlobs[index];
        const imageUrl = URL.createObjectURL(imageBlob);
        img.src = imageUrl;
        img.onload = () => URL.revokeObjectURL(imageUrl);
        
        container.appendChild(img);
        imagesGrid.appendChild(container);
    });
    
    document.getElementById('current-generation').classList.remove('hidden');
}

function showImageActions(event, imageIndex) {
    event.stopPropagation();
    selectedImageIndex = imageIndex;
    
    const actionMenu = document.getElementById('image-action-menu');
    const rect = event.currentTarget.getBoundingClientRect();
    
    actionMenu.style.left = `${rect.right + 10}px`;
    actionMenu.style.top = `${rect.top}px`;
    actionMenu.classList.remove('hidden');
}

function updateGenerateButton(loading) {
    const button = document.getElementById('generate-btn');
    const spinner = button.querySelector('.loading-spinner');
    const text = button.querySelector('.btn-text');
    
    button.disabled = loading;
    spinner.classList.toggle('hidden', !loading);
    text.textContent = loading ? 'Generating...' : 'Generate Images';
}

// Image actions
function downloadImage() {
    if (selectedImageIndex === null || !currentImageBlobs[selectedImageIndex]) {
        showToast('No image selected', 'error');
        return;
    }
    
    const blob = currentImageBlobs[selectedImageIndex];
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `venice-ai-generated-${Date.now()}-${selectedImageIndex + 1}.${document.getElementById('output-format').value}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Image downloaded!', 'success');
    hideActionMenu();
}

async function upscaleImage() {
    if (selectedImageIndex === null || !currentImageBlobs[selectedImageIndex]) {
        showToast('No image selected', 'error');
        return;
    }
    
    const veniceApiData = getApiKey('venice');
    if (!veniceApiData.key) {
        showToast('Please enter your Venice.ai API key', 'error');
        return;
    }
    
    showToast('Upscaling image...', 'info');
    
    try {
        const blob = currentImageBlobs[selectedImageIndex];
        const formData = new FormData();
        formData.append('image', blob, 'image.png');
        formData.append('scale', '2');
        formData.append('enhance', 'true');
        formData.append('enhanceCreativity', '0.15');
        formData.append('replication', '0.35');
        
        const response = await fetch(`${VENICE_API_BASE}/image/upscale`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${veniceApiData.key}`
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const upscaledBlob = await response.blob();
        const upscaledUrl = URL.createObjectURL(upscaledBlob);
        
        // Update the image
        const container = document.querySelectorAll('.generated-image-container')[selectedImageIndex];
        const img = container.querySelector('img');
        img.src = upscaledUrl;
        img.onload = () => URL.revokeObjectURL(upscaledUrl);
        
        // Update blob reference
        currentImageBlobs[selectedImageIndex] = upscaledBlob;
        
        showToast('Image upscaled successfully!', 'success');
        
    } catch (error) {
        console.error('Upscale error:', error);
        showToast(`Upscaling failed: ${error.message}`, 'error');
    }
    
    hideActionMenu();
}

async function upscaleAllImages() {
    const veniceApiData = getApiKey('venice');
    if (!veniceApiData.key) {
        return;
    }
    
    for (let i = 0; i < currentImageBlobs.length; i++) {
        try {
            const blob = currentImageBlobs[i];
            const formData = new FormData();
            formData.append('image', blob, 'image.png');
            formData.append('scale', '2');
            formData.append('enhance', 'true');
            formData.append('enhanceCreativity', '0.15');
            formData.append('replication', '0.35');
            
            const response = await fetch(`${VENICE_API_BASE}/image/upscale`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${veniceApiData.key}`
                },
                body: formData
            });
            
            if (response.ok) {
                const upscaledBlob = await response.blob();
                currentImageBlobs[i] = upscaledBlob;
                
                // Update display
                const container = document.querySelectorAll('.generated-image-container')[i];
                const img = container.querySelector('img');
                const upscaledUrl = URL.createObjectURL(upscaledBlob);
                img.src = upscaledUrl;
                img.onload = () => URL.revokeObjectURL(upscaledUrl);
            }
        } catch (error) {
            console.error(`Failed to upscale image ${i + 1}:`, error);
        }
    }
    
    showToast('All images auto-upscaled!', 'success');
}

function saveToHistory() {
    if (selectedImageIndex === null || !currentImages[selectedImageIndex]) {
        showToast('No image selected', 'error');
        return;
    }
    
    const historyItem = {
        id: Date.now() + selectedImageIndex,
        imageData: currentImages[selectedImageIndex],
        prompt: document.getElementById('prompt').value,
        timestamp: new Date().toISOString(),
        parameters: {
            model: document.getElementById('image-model').value,
            steps: document.getElementById('steps').value,
            cfg_scale: document.getElementById('cfg-scale').value,
            aspect_ratio: document.getElementById('aspect-ratio').value,
            style: document.getElementById('image-style').value,
            format: document.getElementById('output-format').value
        }
    };
    
    generationHistory.unshift(historyItem);
    
    // Limit history to 50 items
    if (generationHistory.length > 50) {
        generationHistory = generationHistory.slice(0, 50);
    }
    
    localStorage.setItem('venice-ai-history', JSON.stringify(generationHistory));
    updateHistoryDisplay();
    
    showToast('Image saved to history!', 'success');
    hideActionMenu();
}

async function regenerateImage() {
    if (!currentPromptData) {
        showToast('No prompt data available for regeneration', 'error');
        return;
    }
    
    const veniceApiData = getApiKey('venice');
    if (!veniceApiData.key) {
        showToast('Please enter your Venice.ai API key', 'error');
        return;
    }
    
    hideActionMenu();
    showToast('Regenerating 4 images with same prompt...', 'info');
    
    try {
        // Generate 4 new images with the same prompt
        const promises = [];
        for (let i = 0; i < 4; i++) {
            const imageRequestData = { ...currentPromptData };
            // Use different seeds for variety
            if (imageRequestData.seed) {
                imageRequestData.seed = imageRequestData.seed + 100 + i;
            }
            
            promises.push(generateSingleImage(veniceApiData.key, imageRequestData, veniceApiData.isFallback));
        }
        
        const results = await Promise.all(promises);
        
        // Process results
        const newImages = [];
        const newBlobs = [];
        
        results.forEach((result) => {
            if (result.success) {
                newImages.push(result.imageData);
                const imageBlob = base64ToBlob(result.imageData, `image/${currentPromptData.format}`);
                newBlobs.push(imageBlob);
            }
        });
        
        if (newImages.length === 0) {
            throw new Error('No images were regenerated successfully');
        }
        
        // Add to current images
        currentImages = [...currentImages, ...newImages];
        currentImageBlobs = [...currentImageBlobs, ...newBlobs];
        
        displayGeneratedImages();
        showToast(`${newImages.length} additional image(s) generated!`, 'success');
        
    } catch (error) {
        console.error('Regeneration error:', error);
        showToast(`Regeneration failed: ${error.message}`, 'error');
    }
}

function hideActionMenu() {
    document.getElementById('image-action-menu').classList.add('hidden');
    selectedImageIndex = null;
}

// Load and display generation history
function loadGenerationHistory() {
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyGrid = document.getElementById('history-grid');
    
    if (generationHistory.length === 0) {
        historyGrid.innerHTML = '<p style="color: var(--comment); text-align: center; grid-column: 1 / -1;">No generation history yet</p>';
        return;
    }
    
    historyGrid.innerHTML = generationHistory.map(item => `
        <div class="history-item" onclick="loadHistoryItem('${item.id}')">
            <img src="data:image/${item.parameters?.format || 'png'};base64,${item.imageData}" alt="Generated image">
            <div class="history-item-overlay">
                <div class="history-item-actions">
                    <button class="history-action-btn" onclick="event.stopPropagation(); downloadHistoryItem('${item.id}')">📥</button>
                    <button class="history-action-btn" onclick="event.stopPropagation(); deleteHistoryItem('${item.id}')">🗑️</button>
                </div>
            </div>
        </div>
    `).join('');
}

function loadHistoryItem(id) {
    const item = generationHistory.find(h => h.id == id);
    if (!item) {
        return;
    }
    
    // Load prompt and parameters
    document.getElementById('prompt').value = item.prompt;
    
    if (item.parameters) {
        if (item.parameters.model) {
            document.getElementById('image-model').value = item.parameters.model;
        }
        if (item.parameters.steps) {
            document.getElementById('steps').value = item.parameters.steps;
            document.getElementById('steps-value').textContent = item.parameters.steps;
        }
        if (item.parameters.cfg_scale) {
            document.getElementById('cfg-scale').value = item.parameters.cfg_scale;
            document.getElementById('cfg-value').textContent = item.parameters.cfg_scale;
        }
        if (item.parameters.aspect_ratio) {
            document.getElementById('aspect-ratio').value = item.parameters.aspect_ratio;
        }
        if (item.parameters.style) {
            document.getElementById('image-style').value = item.parameters.style;
        }
        if (item.parameters.format) {
            document.getElementById('output-format').value = item.parameters.format;
        }
    }
    
    // Display image
    currentImages = [item.imageData];
    currentImageBlobs = [base64ToBlob(item.imageData, 'image/png')];
    
    displayGeneratedImages();
    
    showToast('History item loaded!', 'success');
}

function downloadHistoryItem(id) {
    const item = generationHistory.find(h => h.id == id);
    if (!item) {
        return;
    }
    
    const blob = base64ToBlob(item.imageData, 'image/png');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `venice-ai-history-${item.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function deleteHistoryItem(id) {
    generationHistory = generationHistory.filter(h => h.id != id);
    localStorage.setItem('venice-ai-history', JSON.stringify(generationHistory));
    updateHistoryDisplay();
    showToast('History item deleted', 'info');
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all history?')) {
        generationHistory = [];
        localStorage.setItem('venice-ai-history', JSON.stringify(generationHistory));
        updateHistoryDisplay();
        showToast('History cleared', 'info');
    }
}

// Gemini AI Assistant functions
function openGeminiAssist() {
    document.getElementById('gemini-modal').classList.remove('hidden');
}

function closeGeminiAssist() {
    document.getElementById('gemini-modal').classList.add('hidden');
}

async function sendToAssistant() {
    const input = document.getElementById('assistant-input-text');
    const message = input.value.trim();
    
    if (!message || isAssistantThinking) {
        return;
    }
    
    addMessageToChat(message, 'user', 'assistant-chat');
    input.value = '';
    
    await processAssistantMessage(message, 'assistant-chat');
}

async function sendToAssistantModal() {
    const input = document.getElementById('assistant-input-modal-text');
    const button = input.parentElement.querySelector('.assistant-send-btn');
    const message = input.value.trim();
    
    if (!message || isAssistantThinking) {
        return;
    }
    
    addMessageToChat(message, 'user', 'assistant-chat-modal');
    input.value = '';
    
    // Update button state
    updateAssistantButton(button, true);
    
    try {
        const response = await processAssistantMessage(message, 'assistant-chat-modal');
        
        // Parse the response and populate form if we can extract values
        if (response && typeof response === 'string') {
            parseAndPopulateFromResponse(response);
            showToast('Prompt suggestions applied!', 'success');
            closeGeminiAssist();
        }
    } finally {
        updateAssistantButton(button, false);
    }
}

function parseAndPopulateFromResponse(response) {
    // Extract enhanced prompt (look for text after "Enhanced Prompt:")
    const promptMatch = response.match(/\*\*Enhanced Prompt:\*\*\s*\n(.*?)(?=\n\*\*|$)/s);
    if (promptMatch) {
        document.getElementById('prompt').value = promptMatch[1].trim();
    }
    
    // Extract negative prompt suggestions
    const negativeMatch = response.match(/\*\*Negative Prompt Suggestions?:\*\*\s*\n(.*?)(?=\n\*\*|$)/s);
    if (negativeMatch) {
        const negativeText = negativeMatch[1].trim();
        if (negativeText && negativeText.toLowerCase() !== 'none' && !negativeText.toLowerCase().includes('none specified')) {
            document.getElementById('negative-prompt').value = negativeText;
        }
    }
    
    // Extract recommended settings
    const stepsMatch = response.match(/Steps:\s*(\d+)/i);
    if (stepsMatch) {
        const steps = parseInt(stepsMatch[1]);
        if (steps >= 1 && steps <= 50) {
            document.getElementById('steps').value = steps;
            document.getElementById('steps-value').textContent = steps;
        }
    }
    
    const cfgMatch = response.match(/CFG Scale:\s*([\d.]+)/i);
    if (cfgMatch) {
        const cfg = parseFloat(cfgMatch[1]);
        if (cfg >= 1 && cfg <= 20) {
            document.getElementById('cfg-scale').value = cfg;
            document.getElementById('cfg-value').textContent = cfg;
        }
    }
    
    const styleMatch = response.match(/Style:\s*([^\n\r]+)/i);
    if (styleMatch) {
        const style = styleMatch[1].trim();
        const styleSelect = document.getElementById('image-style');
        const option = Array.from(styleSelect.options).find(opt => 
            opt.text.toLowerCase().includes(style.toLowerCase()) || 
            style.toLowerCase().includes(opt.text.toLowerCase())
        );
        if (option && option.value !== 'none') {
            styleSelect.value = option.value;
        }
    }
}

function updateAssistantButton(button, loading) {
    const spinner = button.querySelector('.loading-spinner');
    const text = button.querySelector('.btn-text');
    
    button.disabled = loading;
    spinner.classList.toggle('hidden', !loading);
    text.textContent = loading ? 'Thinking...' : 'Generate Prompt';
}

async function processAssistantMessage(message, chatId) {
    const geminiApiData = getApiKey('gemini');
    if (!geminiApiData.key) {
        addMessageToChat('Please enter your Google Gemini API key to use the AI assistant.', 'assistant', chatId);
        return;
    }
    
    isAssistantThinking = true;
    addMessageToChat('Thinking...', 'assistant', chatId, true);
    
    try {
        const response = await fetch(`${GEMINI_API_BASE}?key=${geminiApiData.key}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${GEMINI_SYSTEM_PROMPT}\n\nUser request: ${message}`
                    }]
                }],
                generationConfig: {
                    temperature: 1.8,
                    topP: 0.95,
                    maxOutputTokens: 8192,
                    responseMimeType: "text/plain"
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_NONE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_NONE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_NONE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_NONE"
                    }
                ]
            })
        });
        
        if (!response.ok) {
            // Try fallback key if primary failed
            if (!geminiApiData.isFallback) {
                const fallbackData = getApiKey('gemini');
                if (fallbackData.isFallback && fallbackData.key !== geminiApiData.key) {
                    return await processAssistantMessage(message, chatId);
                }
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const assistantResponse = data.candidates[0].content.parts[0].text;
            
            // Remove the thinking message
            removeThinkingMessage(chatId);
            
            // Format the response nicely
            const formattedResponse = assistantResponse
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');
            
            addMessageToChat(formattedResponse, 'assistant', chatId);
            return assistantResponse;
        } else {
            throw new Error('No response from Gemini');
        }
        
    } catch (error) {
        console.error('Assistant error:', error);
        removeThinkingMessage(chatId);
        addMessageToChat(`Sorry, I encountered an error: ${error.message}${geminiApiData.isFallback ? ' (using fallback key)' : ''}`, 'assistant', chatId);
    } finally {
        isAssistantThinking = false;
    }
}

function addMessageToChat(message, role, chatId, isThinking = false) {
    const chat = document.getElementById(chatId);
    const messageDiv = document.createElement('div');
    messageDiv.className = `${role}-message${isThinking ? ' thinking-message' : ''}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (isThinking) {
        contentDiv.innerHTML = '<div class="thinking-indicator">Thinking...</div>';
    } else {
        contentDiv.innerHTML = message;
    }
    
    messageDiv.appendChild(contentDiv);
    chat.appendChild(messageDiv);
    chat.scrollTop = chat.scrollHeight;
}

function removeThinkingMessage(chatId) {
    const chat = document.getElementById(chatId);
    const thinkingMessage = chat.querySelector('.thinking-message');
    if (thinkingMessage) {
        thinkingMessage.remove();
    }
}

// Utility functions
function base64ToBlob(base64, mimeType = 'image/png') {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
}

// Add CSS for thinking indicator
const thinkingCSS = `
.thinking-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    font-style: italic;
    color: var(--comment);
}

.thinking-indicator::after {
    content: '';
    width: 20px;
    height: 20px;
    border: 2px solid transparent;
    border-top: 2px solid var(--comment);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}
`;

// Inject thinking CSS
const style = document.createElement('style');
style.textContent = thinkingCSS;
document.head.appendChild(style);