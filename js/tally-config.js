/**
 * Tally Configuration
 * 
 * Centralized configuration for Tally form integration.
 * Update form IDs when creating new forms.
 */

const TallyConfig = {
  // Form IDs from Tally dashboard
  forms: {
    dufan: {
      id: 'zxMQOk',
      name: 'Worksheet Dufan - Kejar Sains',
      url: 'https://tally.so/r/zxMQOk'
    },
    museumBI: {
      id: 'yP4qep',
      name: 'Worksheet Museum BI - Kejar Sains', 
      url: 'https://tally.so/r/yP4qep'
    }
  },
  
  // CSS selectors for form fields
  selectors: {
    // Student info fields
    studentName: '[aria-label*="nama" i]',
    studentClass: '[aria-label*="kelas" i]',
    
    // Worksheet sections
    fisika: '#fisika-title',
    matematika: '#matematika-title',
    bahasaIndonesia: '#bi-title',
    ips: '#ips-title',
    bahasaInggris: '#inggris-title',
    pjok: '#pjok-title',
    pkn: '#pkn-title',
    seniBudaya: '#seni-title'
  },
  
  // Field type mappings
  fieldTypes: {
    text: 'TEXT',
    textarea: 'TEXTAREA',
    dropdown: 'DROPDOWN',
    radio: 'RADIO',
    checkbox: 'CHECKBOX'
  },
  
  // Configuration options
  options: {
    // Embed options
    embed: {
      hideTitle: true,
      opacity: 0,
      autoRefresh: false,
      inlineOnMobile: true
    },
    
    // Pre-fill options
    prefill: {
      enabled: true,
      trackViewed: true
    },
    
    // Popup options
    popup: {
      width: 600,
      height: 700,
      buttonLabel: 'Submit Jawaban'
    },
    
    // Timing options
    timing: {
      modalShowDelay: 300,
      autoSubmitDelay: 2000
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TallyConfig;
}
