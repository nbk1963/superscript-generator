// script.js

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadArea = document.getElementById('uploadArea');
    const selectedFileInfo = document.getElementById('selectedFileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const removeFileBtn = document.getElementById('removeFileBtn');
    const convertBtn = document.getElementById('convertBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    const progressPercentage = document.getElementById('progressPercentage');
    const progressText = document.getElementById('progressText');
    
    // File validation and state
    let selectedFile = null;
    let isConverting = false;
    
    // Event Listeners
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    removeFileBtn.addEventListener('click', removeSelectedFile);
    convertBtn.addEventListener('click', startConversion);
    downloadBtn.addEventListener('click', downloadConvertedFile);
    
    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        uploadArea.classList.add('drag-over');
    }
    
    function unhighlight() {
        uploadArea.classList.remove('drag-over');
    }
    
    uploadArea.addEventListener('drop', handleDrop, false);
    
    // File handling functions
    function handleFileSelect(event) {
        const file = event.target.files[0];
        processFile(file);
    }
    
    function handleDrop(event) {
        const file = event.dataTransfer.files[0];
        processFile(file);
    }
    
    function processFile(file) {
        if (!file) return;
        
        // Validate file size (max 500MB)
        const maxSize = 500 * 1024 * 1024; // 500MB in bytes
        if (file.size > maxSize) {
            alert('File is too large. Maximum size is 500MB.');
            return;
        }
        
        selectedFile = file;
        updateFileInfo();
        enableConvertButton();
    }
    
    function updateFileInfo() {
        if (!selectedFile) return;
        
        // Update file name and size
        fileName.textContent = selectedFile.name;
        fileSize.textContent = formatFileSize(selectedFile.size);
        
        // Show selected file info and hide upload area
        selectedFileInfo.style.display = 'block';
        uploadArea.style.display = 'none';
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    function removeSelectedFile() {
        selectedFile = null;
        fileInput.value = '';
        
        // Reset UI
        selectedFileInfo.style.display = 'none';
        uploadArea.style.display = 'block';
        convertBtn.disabled = true;
        
        // Reset conversion progress if any
        resetConversionProgress();
    }
    
    function enableConvertButton() {
        convertBtn.disabled = false;
    }
    
    function startConversion() {
        if (!selectedFile || isConverting) return;
        
        isConverting = true;
        convertBtn.disabled = true;
        
        // Show progress bar
        progressContainer.style.display = 'block';
        progressFill.style.width = '0%';
        progressPercentage.textContent = '0%';
        progressText.textContent = 'Preparing conversion...';
        
        // Simulate conversion progress
        simulateConversion();
    }
    
    function simulateConversion() {
        let progress = 0;
        const duration = 3000; // 3 seconds for simulation
        const interval = 50; // Update every 50ms
        const increment = 100 / (duration / interval);
        
        const conversionInterval = setInterval(() => {
            progress += increment;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(conversionInterval);
                conversionComplete();
            }
            
            updateProgressBar(progress);
            
            // Update progress text based on progress
            if (progress < 30) {
                progressText.textContent = 'Analyzing file...';
            } else if (progress < 60) {
                progressText.textContent = 'Converting file format...';
            } else if (progress < 90) {
                progressText.textContent = 'Optimizing quality...';
            } else {
                progressText.textContent = 'Finalizing conversion...';
            }
        }, interval);
    }
    
    function updateProgressBar(progress) {
        const roundedProgress = Math.round(progress);
        progressFill.style.width = `${progress}%`;
        progressPercentage.textContent = `${roundedProgress}%`;
    }
    
    function conversionComplete() {
        isConverting = false;
        progressText.textContent = 'Conversion complete!';
        
        // Enable download button
        downloadBtn.disabled = false;
        
        // Show success message
        setTimeout(() => {
            alert('File conversion completed successfully! Click the Download button to get your converted file.');
        }, 500);
    }
    
    function downloadConvertedFile() {
        if (!selectedFile) return;
        
        // Get selected format
        const formatSelect = document.getElementById('formatSelect');
        const selectedFormat = formatSelect.options[formatSelect.selectedIndex].text;
        
        // Create a download link for simulation
        const originalName = selectedFile.name;
        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
        
        // Get selected format extension
        const formatExt = formatSelect.value;
        
        // Create a blob with simulated content (in a real app, this would be the actual converted file)
        const content = `This is a simulation of the converted file. 
Original: ${originalName}
Converted to: ${selectedFormat}
Quality: ${document.querySelector('input[name="quality"]:checked').value}
Size: ${document.getElementById('sizeSelect').value}

In a real application, this would be your actual converted file content.`;
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        // Create download link and trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = `${nameWithoutExt}_converted.${formatExt}`;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        
        // Show success message
        alert(`File downloaded as: ${a.download}`);
    }
    
    function resetConversionProgress() {
        progressContainer.style.display = 'none';
        progressFill.style.width = '0%';
        progressPercentage.textContent = '0%';
        downloadBtn.disabled = true;
    }
    
    // Initialize UI
    function init() {
        // Set initial states
        convertBtn.disabled = true;
        downloadBtn.disabled = true;
        progressContainer.style.display = 'none';
        selectedFileInfo.style.display = 'none';
        
        // Add some sample files for testing (only in development)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Development mode: Sample file functionality enabled');
        }
    }
    
    // Initialize the application
    init();
});
