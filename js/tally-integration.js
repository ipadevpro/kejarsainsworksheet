/**
 * Tally Integration Module
 * 
 * Handles embedding Tally forms and pre-filling data from worksheets.
 * Provides seamless submission experience for students.
 */

(function() {
  'use strict';

  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  const state = {
    isInitialized: false,
    isSubmitting: false,
    currentForm: null,
    collectedData: null
  };

  // ========================================
  // DOM UTILITIES
  // ========================================
  
  const DOM = {
    // Get all textareas in a section
    getSectionInputs: (sectionId) => {
      const section = document.getElementById(sectionId);
      if (!section) return [];
      
      return Array.from(section.querySelectorAll('textarea.essay-input'))
        .map((textarea, index) => ({
          element: textarea,
          value: textarea.value.trim(),
          questionNumber: index + 1,
          isRequired: textarea.hasAttribute('aria-required')
        }));
    },

    // Get all questions from a section
    getSectionQuestions: (section) => {
      const questions = section.querySelectorAll('.question');
      return Array.from(questions).map((question, index) => {
        const questionText = question.querySelector('.question-text');
        const textarea = question.querySelector('textarea.essay-input');
        
        return {
          element: question,
          number: index + 1,
          text: questionText ? questionText.textContent.trim().slice(0, 100) : '',
          answer: textarea ? textarea.value.trim() : '',
          isEmpty: !textarea || !textarea.value.trim()
        };
      });
    },

    // Get student info
    getStudentInfo: () => {
      // Try to find student info inputs
      const nameInput = document.querySelector('[aria-label*="nama" i], #student-name, .student-name input');
      const classInput = document.querySelector('[aria-label*="kelas" i], #student-class, .student-class input');
      
      // If no specific inputs, use prompt
      if (!nameInput || !classInput) {
        return null;
      }
      
      return {
        name: nameInput.value.trim(),
        class: classInput.value.trim()
      };
    },

    // Create student info modal
    createStudentInfoModal: () => {
      const modal = document.createElement('div');
      modal.id = 'student-info-modal';
      modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
          <h3>Informasi Siswa</h3>
          <p class="modal-description">Mohon lengkapi data berikut sebelum提交 jawaban.</p>
          
          <form id="student-info-form">
            <div class="form-group">
              <label for="student-name">Nama Lengkap *</label>
              <input type="text" id="student-name" name="name" required 
                     placeholder="Contoh: Ahmad Surya">
            </div>
            
            <div class="form-group">
              <label for="student-class">Kelas *</label>
              <select id="student-class" name="class" required>
                <option value="">Pilih Kelas</option>
                <option value="7-A">7-A</option>
                <option value="7-B">7-B</option>
                <option value="7-C">7-C</option>
                <option value="7-D">7-D</option>
                <option value="7-E">7-E</option>
              </select>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn-cancel">Batal</button>
              <button type="submit" class="btn-continue">Lanjutkan</button>
            </div>
          </form>
        </div>
      `;
      
      // Add modal styles
      const style = document.createElement('style');
      style.textContent = `
        #student-info-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        #student-info-modal .modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
        }
        
        #student-info-modal .modal-content {
          position: relative;
          background: white;
          border-radius: 16px;
          padding: 32px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        #student-info-modal h3 {
          margin: 0 0 8px 0;
          color: #1a2a3a;
          font-size: 1.5rem;
        }
        
        #student-info-modal .modal-description {
          color: #5a6a7a;
          margin-bottom: 24px;
        }
        
        #student-info-modal .form-group {
          margin-bottom: 20px;
        }
        
        #student-info-modal label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #2c3e50;
        }
        
        #student-info-modal input,
        #student-info-modal select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e0e6ed;
          border-radius: 10px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        
        #student-info-modal input:focus,
        #student-info-modal select:focus {
          outline: none;
          border-color: #3498db;
        }
        
        #student-info-modal .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }
        
        #student-info-modal button {
          flex: 1;
          padding: 14px 24px;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        #student-info-modal .btn-cancel {
          background: #f0f4f8;
          color: #5a6a7a;
        }
        
        #student-info-modal .btn-cancel:hover {
          background: #e8eef4;
        }
        
        #student-info-modal .btn-continue {
          background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
          color: white;
        }
        
        #student-info-modal .btn-continue:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
        }
      `;
      
      document.head.appendChild(style);
      document.body.appendChild(modal);
      
      return modal;
    },

    // Create loading overlay
    createLoadingOverlay: (message = 'Memproses...') => {
      const overlay = document.createElement('div');
      overlay.id = 'tally-loading-overlay';
      overlay.innerHTML = `
        <div class="loading-content">
          <div class="loading-spinner"></div>
          <p>${message}</p>
        </div>
      `;
      
      const style = document.createElement('style');
      style.textContent = `
        #tally-loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }
        
        #tally-loading-overlay .loading-content {
          text-align: center;
        }
        
        #tally-loading-overlay .loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e0e6ed;
          border-top-color: #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px 0;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        #tally-loading-overlay p {
          color: #5a6a7a;
          font-size: 1rem;
        }
      `;
      
      document.head.appendChild(style);
      document.body.appendChild(overlay);
      
      return overlay;
    },

    // Create success message
    showSuccessMessage: () => {
      const message = document.createElement('div');
      message.id = 'tally-success-message';
      message.innerHTML = `
        <div class="success-content">
          <div class="success-icon">✓</div>
          <h2>Berhasil!</h2>
          <p>Jawaban Anda telah berhasil disimpan di Tally.</p>
          <p class="success-note">Terima kasih telah mengerjakan worksheet dengan teliti!</p>
          <button class="btn-close">Tutup</button>
        </div>
      `;
      
      const style = document.createElement('style');
      style.textContent = `
        #tally-success-message {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.98);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10001;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        #tally-success-message .success-content {
          text-align: center;
          padding: 40px;
          max-width: 400px;
        }
        
        #tally-success-message .success-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px 0;
          font-size: 40px;
          color: white;
        }
        
        #tally-success-message h2 {
          margin: 0 0 12px 0;
          color: #1a2a3a;
          font-size: 2rem;
        }
        
        #tally-success-message p {
          color: #5a6a7a;
          margin-bottom: 12px;
          line-height: 1.6;
        }
        
        #tally-success-message .success-note {
          font-size: 0.9rem;
          color: #7a8a9a;
        }
        
        #tally-success-message .btn-close {
          margin-top: 24px;
          padding: 14px 40px;
          background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        #tally-success-message .btn-close:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
        }
      `;
      
      document.head.appendChild(style);
      document.body.appendChild(message);
      
      // Close button handler
      message.querySelector('.btn-close').addEventListener('click', () => {
        message.remove();
      });
      
      return message;
    },

    // Create error message
    showErrorMessage: (errorMessage) => {
      const error = document.createElement('div');
      error.id = 'tally-error-message';
      error.innerHTML = `
        <div class="error-content">
          <div class="error-icon">⚠</div>
          <h2>Terjadi Kesalahan</h2>
          <p>${errorMessage}</p>
          <button class="btn-retry">Coba Lagi</button>
          <button class="btn-close-error">Tutup</button>
        </div>
      `;
      
      const style = document.createElement('style');
      style.textContent = `
        #tally-error-message {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.98);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10001;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        #tally-error-message .error-content {
          text-align: center;
          padding: 40px;
          max-width: 400px;
        }
        
        #tally-error-message .error-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px 0;
          font-size: 40px;
          color: white;
        }
        
        #tally-error-message h2 {
          margin: 0 0 12px 0;
          color: #1a2a3a;
          font-size: 2rem;
        }
        
        #tally-error-message p {
          color: #5a6a7a;
          margin-bottom: 24px;
          line-height: 1.6;
        }
        
        #tally-error-message .btn-retry,
        #tally-error-message .btn-close-error {
          padding: 14px 24px;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin: 0 8px;
          transition: all 0.2s;
        }
        
        #tally-error-message .btn-retry {
          background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
          color: white;
        }
        
        #tally-error-message .btn-close-error {
          background: #f0f4f8;
          color: #5a6a7a;
        }
      `;
      
      document.head.appendChild(style);
      document.body.appendChild(error);
      
      return error;
    }
  };

  // ========================================
  // DATA COLLECTION
  // ========================================
  
  const DataCollector = {
    // Collect all worksheet data
    collectWorksheetData: (worksheetType) => {
      const data = {
        worksheetType,
        studentInfo: null,
        sections: {},
        collectedAt: new Date().toISOString()
      };
      
      // Collect student info from modal
      const nameInput = document.getElementById('student-name');
      const classInput = document.getElementById('student-class');
      
      if (nameInput && classInput) {
        data.studentInfo = {
          name: nameInput.value.trim(),
          class: classInput.value.trim()
        };
      }
      
      // Collect section data based on worksheet type
      const sections = worksheetType === 'dufan' 
        ? ['fisika', 'matematika', 'bahasaIndonesia', 'ips', 'bahasaInggris', 'pjok']
        : ['matematika', 'bahasaIndonesia', 'ips', 'bahasaInggris', 'pkn', 'seniBudaya'];
      
      sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
          data.sections[sectionId] = DOM.getSectionQuestions(section);
        }
      });
      
      return data;
    },

    // Convert to Tally pre-fill format
    toTallyPrefillFormat: (worksheetData) => {
      const prefill = {};
      
      // Add student info
      if (worksheetData.studentInfo) {
        // Note: You'll need to match these to actual field IDs in your Tally form
        prefill.field_1 = worksheetData.studentInfo.name; // Nama
        prefill.field_2 = worksheetData.studentInfo.class; // Kelas
      }
      
      // Add answers by section
      let fieldIndex = 3;
      
      Object.entries(worksheetData.sections).forEach(([section, questions]) => {
        questions.forEach((question, qIndex) => {
          const fieldKey = `field_${fieldIndex}`;
          prefill[fieldKey] = question.answer;
          fieldIndex++;
        });
      });
      
      return prefill;
    },

    // Validate collected data
    validate: (worksheetData) => {
      const errors = [];
      
      // Check student info
      if (!worksheetData.studentInfo?.name) {
        errors.push('Nama lengkap harus diisi');
      }
      
      if (!worksheetData.studentInfo?.class) {
        errors.push('Kelas harus dipilih');
      }
      
      // Check for empty answers
      let emptyCount = 0;
      Object.values(worksheetData.sections).forEach(questions => {
        questions.forEach(question => {
          if (!question.answer) {
            emptyCount++;
          }
        });
      });
      
      if (emptyCount > 0) {
        // Warning, not error - allow submission with empty answers
        console.warn(`${emptyCount} pertanyaan belum dijawab`);
      }
      
      return {
        isValid: errors.length === 0,
        errors
      };
    }
  };

  // ========================================
  // TALLY EMBED FUNCTIONS
  // ========================================
  
  const TallyEmbed = {
    // Load Tally embed script
    loadScript: () => {
      return new Promise((resolve, reject) => {
        if (window.Tally) {
          resolve(window.Tally);
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://tally.so/widgets/embed.js';
        script.async = true;
        
        script.onload = () => resolve(window.Tally);
        script.onerror = () => reject(new Error('Failed to load Tally embed script'));
        
        document.head.appendChild(script);
      });
    },

    // Open form in popup with pre-fill
    openPopup: async (formId, prefillData) => {
      try {
        await TallyEmbed.loadScript();
        
        const config = TallyConfig.options;
        
        // Build pre-fill URL parameters
        const prefillParams = new URLSearchParams();
        Object.entries(prefillData).forEach(([key, value]) => {
          if (value) {
            prefillParams.append(key, encodeURIComponent(value));
          }
        });
        
        const formUrl = prefillParams.toString() 
          ? `${TallyConfig.forms[formId].url}?${prefillParams.toString()}`
          : TallyConfig.forms[formId].url;
        
        // Open Tally popup
        if (window.Tally && window.Tally.loadEmbeds) {
          window.Tally.loadEmbeds();
          
          // Create popup manually if Tally API doesn't work
          const popup = document.createElement('div');
          popup.id = 'tally-popup';
          popup.innerHTML = `
            <div class="tally-popup-overlay"></div>
            <div class="tally-popup-content">
              <button class="tally-popup-close">&times;</button>
              <iframe src="${formUrl}" 
                      frameborder="0" 
                      marginheight="0" 
                      marginwidth="0" 
                      title="Tally Form"></iframe>
            </div>
          `;
          
          const style = document.createElement('style');
          style.textContent = `
            #tally-popup {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              z-index: 9998;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            #tally-popup .tally-popup-overlay {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.6);
              backdrop-filter: blur(4px);
            }
            
            #tally-popup .tally-popup-content {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 90%;
              max-width: ${config.popup.width}px;
              max-height: 90vh;
              background: white;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            
            #tally-popup iframe {
              width: 100%;
              height: ${config.popup.height}px;
              max-height: 80vh;
              border: none;
            }
            
            #tally-popup .tally-popup-close {
              position: absolute;
              top: 12px;
              right: 12px;
              width: 32px;
              height: 32px;
              border: none;
              background: rgba(0, 0, 0, 0.5);
              color: white;
              border-radius: 50%;
              font-size: 20px;
              cursor: pointer;
              z-index: 10;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            @media (max-width: 768px) {
              #tally-popup .tally-popup-content {
                width: 95%;
                max-width: none;
              }
              
              #tally-popup iframe {
                height: 600px;
              }
            }
          `;
          
          document.head.appendChild(style);
          document.body.appendChild(popup);
          
          // Close button handler
          popup.querySelector('.tally-popup-close').addEventListener('click', () => {
            popup.remove();
          });
          
          // Close on overlay click
          popup.querySelector('.tally-popup-overlay').addEventListener('click', () => {
            popup.remove();
          });
          
          return popup;
        }
        
      } catch (error) {
        console.error('Failed to open Tally popup:', error);
        throw error;
      }
    },

    // Open form as embedded widget
    openWidget: async (formId, containerId, prefillData) => {
      try {
        await TallyEmbed.loadScript();
        
        const container = document.getElementById(containerId);
        if (!container) {
          throw new Error(`Container ${containerId} not found`);
        }
        
        // Build form URL with pre-fill
        const prefillParams = new URLSearchParams();
        Object.entries(prefillData).forEach(([key, value]) => {
          if (value) {
            prefillParams.append(key, encodeURIComponent(value));
          }
        });
        
        const formUrl = prefillParams.toString()
          ? `${TallyConfig.forms[formId].url}?${prefillParams.toString()}`
          : TallyConfig.forms[formId].url;
        
        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.src = formUrl;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('marginheight', '0');
        iframe.setAttribute('marginwidth', '0');
        iframe.style.width = '100%';
        iframe.style.height = '700px';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '12px';
        
        container.appendChild(iframe);
        
        return iframe;
        
      } catch (error) {
        console.error('Failed to embed Tally widget:', error);
        throw error;
      }
    }
  };

  // ========================================
  // MAIN CONTROLLER
  // ========================================
  
  const TallyIntegration = {
    // Initialize for a worksheet
    init: (worksheetType) => {
      if (state.isInitialized) {
        console.warn('Tally integration already initialized');
        return;
      }
      
      state.currentForm = worksheetType;
      state.isInitialized = true;
      
      console.log(`Tally integration initialized for ${worksheetType}`);
    },

    // Start submission process
    startSubmission: async (worksheetType) => {
      if (state.isSubmitting) {
        console.warn('Submission already in progress');
        return;
      }
      
      state.isSubmitting = true;
      state.currentForm = worksheetType;
      
      try {
        // Show loading
        const loadingOverlay = DOM.createLoadingOverlay('Mempersiapkan data...');
        
        // Collect worksheet data
        const worksheetData = DataCollector.collectWorksheetData(worksheetType);
        
        // Validate
        const validation = DataCollector.validate(worksheetData);
        
        if (!validation.isValid) {
          loadingOverlay.remove();
          state.isSubmitting = false;
          
          // Show validation errors
          const errorModal = DOM.showErrorMessage(validation.errors.join('\n'));
          
          errorModal.querySelector('.btn-close-error').addEventListener('click', () => {
            errorModal.remove();
          });
          
          return;
        }
        
        // Show student info modal if not already collected
        if (!worksheetData.studentInfo?.name || !worksheetData.studentInfo?.class) {
          loadingOverlay.remove();
          await TallyIntegration.showStudentInfoModal(worksheetData);
          return;
        }
        
        // Convert to Tally format
        const prefillData = DataCollector.toTallyPrefillFormat(worksheetData);
        
        // Open Tally form
        loadingOverlay.remove();
        
        const formId = worksheetType === 'dufan' ? 'dufan' : 'museumBI';
        await TallyEmbed.openPopup(formId, prefillData);
        
      } catch (error) {
        console.error('Submission failed:', error);
        state.isSubmitting = false;
        
        const errorModal = DOM.showErrorMessage(error.message);
        
        errorModal.querySelector('.btn-retry').addEventListener('click', () => {
          errorModal.remove();
          TallyIntegration.startSubmission(worksheetType);
        });
        
        errorModal.querySelector('.btn-close-error').addEventListener('click', () => {
          errorModal.remove();
        });
      }
    },

    // Show student info modal
    showStudentInfoModal: async (worksheetData) => {
      const modal = DOM.createStudentInfoModal();
      const form = modal.querySelector('#student-info-form');
      
      // Cancel button
      modal.querySelector('.btn-cancel').addEventListener('click', () => {
        modal.remove();
        state.isSubmitting = false;
      });
      
      // Continue button
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Update worksheet data
        const nameInput = document.getElementById('student-name');
        const classInput = document.getElementById('student-class');
        
        worksheetData.studentInfo = {
          name: nameInput.value.trim(),
          class: classInput.value.trim()
        };
        
        // Validate again
        const validation = DataCollector.validate(worksheetData);
        
        if (!validation.isValid) {
          alert(validation.errors.join('\n'));
          return;
        }
        
        modal.remove();
        
        // Proceed with submission
        const loadingOverlay = DOM.createLoadingOverlay('Membuka form Tally...');
        
        const prefillData = DataCollector.toTallyPrefillFormat(worksheetData);
        const formId = state.currentForm === 'dufan' ? 'dufan' : 'museumBI';
        
        await TallyEmbed.openPopup(formId, prefillData);
        
        loadingOverlay.remove();
      });
    },

    // Handle successful submission callback
    onSubmitSuccess: () => {
      state.isSubmitting = false;
      
      const successMessage = DOM.showSuccessMessage();
      
      successMessage.querySelector('.btn-close').addEventListener('click', () => {
        successMessage.remove();
        
        // Optionally scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },

    // Handle submission error
    onSubmitError: (error) => {
      state.isSubmitting = false;
      
      const errorModal = DOM.showErrorMessage(error.message || 'Terjadi kesalahan saat提交.');
      
      errorModal.querySelector('.btn-retry').addEventListener('click', () => {
        errorModal.remove();
        TallyIntegration.startSubmission(state.currentForm);
      });
      
      errorModal.querySelector('.btn-close-error').addEventListener('click', () => {
        errorModal.remove();
      });
    }
  };

  // ========================================
  // EXPOSE TO GLOBAL SCOPE
  // ========================================
  
  window.TallyIntegration = TallyIntegration;
  window.TallyConfig = TallyConfig;
  
  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('Tally Integration Module Ready');
    });
  } else {
    console.log('Tally Integration Module Ready');
  }

})();
