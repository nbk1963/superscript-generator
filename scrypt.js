// script.js - Fixed Version

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const uploadArea = document.getElementById('uploadArea');
    const uploadSection = document.getElementById('uploadSection');
    const selectedFileDiv = document.getElementById('selectedFile');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const removeBtn = document.getElementById('removeBtn');
    const convertBtn = document.getElementById('convertBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const progressSection = document.getElementById('progressSection');
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    const progressText = document.getElementById('progressText');
    
    // State variables
    let selectedFile = null;
    let isConverting = false;
    let convertedFileUrl = null;
    
    // Initialize
    function init() {
        console.log('File Converter Initialized');
        updateUI();
        
        // Test function for debugging
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Debug mode active');
            // Uncomment to test with a sample file
            // simulateFileUpload();
        }
    }
    
    // Event Listeners
    browseBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and Drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadSection.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadSection.addEventListener(eventName, function() {
            uploadSection.classList.add('drag-over');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadSection.addEventListener(eventName, function() {
            uploadSection.classList.remove('drag-over');
        }, false);
    });
    
    uploadSection.addEventListener('drop', handleDrop, false);
    
    // File handling
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            processFile(file);
        }
    }
    
    function handleDrop(event) {
        const file = event.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    }
    
    function processFile(file) {
        // Validate file
        if (!validateFile(file)) {
            return;
        }
        
        selectedFile = file;
        updateFileInfo();
        updateUI();
    }
    
    function validateFile(file) {
        // Check if file exists
        if (!file) {
            showError('No file selected');
            return false;
        }
        
        // Check file size (max 500MB)
        const maxSize = 500 * 1024 * 1024; // 500MB
        if (file.size > maxSize) {
            showError('File is too large. Maximum size is 500MB.');
            return false;
        }
        
        // Check file type (basic check)
        const allowedTypes = [
            'video/', 'audio/', 'image/', 'application/', 'text/'
        ];
        
        const isValidType = allowedTypes.some(type => file.type.startsWith(type));
        if (!isValidType && file.type !== '') {
            showError('File type not supported. Please select a video, audio, image, document, or archive file.');
            return false;
        }
        
        return true;
    }
    
    function updateFileInfo() {
        if (!selectedFile) return;
        
        fileName.textContent = selectedFile.name;
        fileSize.textContent = formatFileSize(selectedFile.size);
        
        // Update file icon based on type
        const fileIcon = document.querySelector('.file-icon');
        if (selectedFile.type.startsWith('video/')) {
            fileIcon.className = 'fas fa-file-video file-icon';
        } else if (selectedFile.type.startsWith('audio/')) {
            fileIcon.className = 'fas fa-file-audio file-icon';
        } else if (selectedFile.type.startsWith('image/')) {
            fileIcon.className = 'fas fa-file-image file-icon';
        } else {
            fileIcon.className = 'fas fa-file file-icon';
        }
        
        selectedFileDiv.style.display = 'block';
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Remove file
    removeBtn.addEventListener('click', function() {
        selectedFile = null;
        fileInput.value = '';
        selectedFileDiv.style.display = 'none';
        updateUI();
        resetProgress();
    });
    
    // Convert button
    convertBtn.addEventListener('click', function() {
        if (!selectedFile || isConverting) return;
        
        startConversion();
    });
    
    function startConversion() {
        isConverting = true;
        updateUI();
        
        // Show progress section
        progressSection.style.display = 'block';
        progressFill.style.width = '0%';
        progressPercent.textContent = '0%';
        progressText.textContent = 'Starting conversion...';
        
        // Simulate conversion process
        simulateConversion();
    }
    
    function simulateConversion() {
        let progress = 0;
        const steps = [
            { percent: 10, text: 'Reading file...' },
            { percent: 30, text: 'Processing file...' },
            { percent: 60, text: 'Converting format...' },
            { percent: 80, text: 'Optimizing quality...' },
            { percent: 95, text: 'Finalizing...' },
            { percent: 100, text: 'Conversion complete!' }
        ];
        
        steps.forEach((step, index) => {
            setTimeout(() => {
                progress = step.percent;
                progressFill.style.width = progress + '%';
                progressPercent.textContent = progress + '%';
                progressText.textContent = step.text;
                
                if (progress === 100) {
                    conversionComplete();
                }
            }, index * 800); // Each step takes 0.8 seconds
        });
    }
    
    function conversionComplete() {
        isConverting = false;
        
        // Get conversion options
        const formatSelect = document.getElementById('formatSelect');
        const selectedFormat = formatSelect.value;
        const selectedQuality = document.querySelector('input[name="quality"]:checked').value;
        const selectedSize = document.getElementById('sizeSelect').value;
        
        // Create a simulated download link
        createDownloadLink(selectedFormat);
        
        // Enable download button
        downloadBtn.disabled = false;
        
        // Update progress text
        progressText.textContent = `Ready to download! Converted to ${selectedFormat.toUpperCase()} (${selectedQuality} quality, ${selectedSize})`;
        
        updateUI();
        
        // Show success message
        setTimeout(() => {
            alert('✅ Conversion completed successfully!\n\nClick the "Download File" button to save your converted file.');
        }, 500);
    }
    
    function createDownloadLink(format) {
        // Create a simulated file for download
        const content = `This is a simulated converted file.\n\n` +
                       `Original: ${selectedFile.name}\n` +
                       `Converted to: ${format.toUpperCase()}\n` +
                       `Quality: ${document.querySelector('input[name="quality"]:checked').value}\n` +
                       `Size: ${document.getElementById('sizeSelect').value}\n` +
                       `Date: ${new Date().toLocaleString()}\n\n` +
                       `In a real application, this would be your actual converted file.`;
        
        const blob = new Blob([content], { type: 'text/plain' });
        convertedFileUrl = URL.createObjectURL(blob);
    }
    
    // Download button
    downloadBtn.addEventListener('click', function() {
        if (!convertedFileUrl) return;
        
        // Get file extension from selected format
        const formatSelect = document.getElementById('formatSelect');
        const format = formatSelect.value;
        
        // Create download link
        const originalName = selectedFile.name;
        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
        const downloadName = `${nameWithoutExt}_converted.${format}`;
        
        const a = document.createElement('a');
        a.href = convertedFileUrl;
        a.download = downloadName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Show download confirmation
        showMessage('Download started!', 'success');
    });
    
    // UI Updates
    function updateUI() {
        // Update convert button state
        convertBtn.disabled = !selectedFile || isConverting;
        
        // Update download button state
        downloadBtn.disabled = !convertedFileUrl || isConverting;
        
        // Update button text based on state
        if (isConverting) {
            convertBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Converting...';
        } else {
            convertBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Convert Now';
        }
    }
    
    function resetProgress() {
        isConverting = false;
        convertedFileUrl = null;
        progressSection.style.display = 'none';
        progressFill.style.width = '0%';
        progressPercent.textContent = '0%';
        updateUI();
    }
    
    // Utility functions
    function showError(message) {
        alert('❌ ' + message);
        console.error('Error:', message);
    }
    
    function showMessage(message, type = 'info') {
        const icon = type === 'success' ? '✅' : 'ℹ️';
        alert(icon + ' ' + message);
    }
    
    // Debug function (for testing)
    function simulateFileUpload() {
        const testFile = new File(['Test file content'], 'example_video.mp4', { 
            type: 'video/mp4',
            lastModified: Date.now()
        });
        
        // Simulate file selection
        setTimeout(() => {
            processFile(testFile);
            console.log('Test file loaded:', testFile);
        }, 1000);
    }
    
    // Initialize the application
    init();
});
