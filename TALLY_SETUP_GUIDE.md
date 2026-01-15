# Tally Form Setup Guide - Kejar Sains

## Overview
This guide explains how to set up the Tally forms to work with the Kejar Sains worksheet application.

## Current Configuration

### Form URLs
- **Dufan Worksheet**: https://tally.so/r/zxMQOk
- **Museum BI Worksheet**: https://tally.so/r/yP4qep

### JavaScript Files
- `js/tally-config.js` - Configuration and settings
- `js/tally-integration.js` - Main integration logic

---

## Setting Up Tally Forms

### Method 1: Manual Field Setup (Recommended)

For best results, set up your Tally forms with the following field structure:

#### Dufan Worksheet Form (zxMQOk)

**Section 1: Informasi Siswa**
| Field Order | Question | Suggested Field Name | Expected Data |
|-------------|----------|---------------------|---------------|
| 1 | Nama Lengkap | Student Name | Text input |
| 2 | Kelas | Class | Dropdown (7-A, 7-B, etc.) |

**Section 2: Fisika**
| Field Order | Question | Field Name |
|-------------|----------|------------|
| 3 | Prinsip kerja roller coaster | Physics Q1 |
| 4 | Perhitungan energi potensial | Physics Q2 |
| 5 | Konsep inersia & impuls | Physics Q3 |

**Section 3: Matematika**
| Field Order | Question | Field Name |
|-------------|----------|------------|
| 6 | Keliling & kecepatan sudut | Math Q1 |
| 7 | Pengurutan tinggi wahana | Math Q2 |

**Section 4: Bahasa Indonesia**
| Field Order | Question | Field Name |
|-------------|----------|------------|
| 8 | Teks observasi | Indonesian Q1 |
| 9 | Analisis kalimat | Indonesian Q2 |

**Section 5: IPS**
| Field Order | Question | Field Name |
|-------------|----------|------------|
| 10 | Sektor pariwisata | IPS Q1 |
| 11 | Strategi manajer Dufan | IPS Q2 |

**Section 6: Bahasa Inggris**
| Field Order | Question | Field Name |
|-------------|----------|------------|
| 12 | Complete sentences | English Q1 |
| 13 | Write paragraph | English Q2 |

**Section 7: PJOK**
| Field Order | Question | Field Name |
|-------------|----------|------------|
| 14 | Aktivitas fisik & kesehatan | PJOK Q1 |
| 15 | Safety briefing | PJOK Q2 |

---

#### Museum BI Worksheet Form (yP4qep)

**Section 1: Informasi Siswa**
| Field Order | Question | Suggested Field Name | Expected Data |
|-------------|----------|---------------------|---------------|
| 1 | Nama Lengkap | Student Name | Text input |
| 2 | Kelas | Class | Dropdown (7-A, 7-B, etc.) |

**Section 2: Matematika**
| Field Order | Question | Field Name |
|-------------|----------|------------|
| 3 | Perhitungan inflasi | Math Q1 |
| 4 | Koleksi mata uang | Math Q2 |

**Section 3: Bahasa Indonesia**
| Field Order | Question | Field Name |
|-------------|----------|------------|
| 5 | Paragraf persuasi | Indonesian Q1 |
| 6 | Makna kata "strategis" | Indonesian Q2 |

**Section 4: IPS**
| Field Order | Question | Field Name |
|-------------|----------|------------|
| 7 | Peran Bank Indonesia | IPS Q1 |
| 8 | Sejarah uang | IPS Q2 |

**Section 5: Bahasa Inggris**
| Field Order | Question | Field Name |
|-------------|----------|------------|
| 9 | Translate sentence | English Q1 |
| 10 | Write 5 sentences | English Q2 |

**Section 6: PKN**
| Field Order | Question | Field Name |
|-------------|----------|------------|
| 11 | Tanggung jawab warga negara | PKN Q1 |
| 12 | Hubungan BI & kedaulatan | PKN Q2 |

**Section 7: Seni Budaya**
| Field Order | Question | Field Name |
|-------------|----------|------------|
| 13 | Desain uang Rupiah | Art Q1 |
| 14 | Motif batik | Art Q2 |

---

### Method 2: Auto-Detect Field IDs

The integration code will automatically detect field IDs when the form is loaded. To enable this:

1. Open your Tally form in edit mode
2. Open browser developer tools (F12)
3. Right-click on a field and select "Inspect"
4. Look for the field ID in the element attributes

Example:
```html
<input id="c1cbc8e4-b2f3-4e63-a683-ec9eadbcb022" type="text">
```

The ID format is: `c1cbc8e4-b2f3-4e63-a683-ec9eadbcb022`

Update `tally-config.js` with these field IDs:
```javascript
const TallyConfig = {
  forms: {
    dufan: {
      id: 'zxMQOk',
      name: 'Worksheet Dufan',
      fieldIds: {
        studentName: 'c1cbc8e4-b2f3-4e63-a683-ec9eadbcb022',
        studentClass: 'c2dbc8e4-b2f3-4e63-a683-ec9eadbcb023',
        // ... etc
      }
    }
  }
};
```

---

## How It Works

### User Flow
1. Student opens worksheet (e.g., `worksheet-dufan.html`)
2. Student fills in answers in textareas
3. Student clicks "Selesai Mengerjakan" button
4. **If no student info yet:**
   - Modal appears asking for Name & Class
   - Student fills in info
   - Click "Lanjutkan"
5. **Tally Form Opens:**
   - Modal popup with embedded Tally form
   - Data is pre-filled from worksheet answers
   - Student can review and edit answers
   - Student clicks "Submit" in Tally form
6. **Success:**
   - Success message appears
   - Data saved to Tally dashboard

### Data Flow
```
Worksheet Textareas → JavaScript Collection → Pre-fill Parameters → Tally Form → Tally Dashboard
```

---

## Testing the Integration

### Local Testing
1. Open `worksheet-dufan.html` in a browser
2. Fill in some test answers
3. Click "Selesai Mengerjakan"
4. Verify:
   - [ ] Student info modal appears
   - [ ] Data is collected correctly
   - [ ] Tally form opens in popup
   - [ ] Pre-filled data shows correctly

### Browser Console Testing
Open browser developer tools (F12) and run:
```javascript
// Check if TallyIntegration is loaded
console.log(window.TallyIntegration);

// Test data collection
const testData = {
  worksheetType: 'dufan',
  studentInfo: { name: 'Test Student', class: '7-A' },
  sections: {}
};

// Validate data
const validation = window.TallyIntegration ? 
  { /* test validation */ } : 'Not loaded';
```

---

## Troubleshooting

### Common Issues

#### Issue: Tally form doesn't open
**Solution:**
1. Check browser console for errors
2. Ensure `tally-config.js` and `tally-integration.js` are loaded
3. Verify form IDs are correct in `tally-config.js`

#### Issue: Pre-fill data not showing
**Solution:**
1. Check URL parameters in the iframe
2. Verify field IDs match between Tally and config
3. Ensure data is collected before opening form

#### Issue: Modal doesn't close after submit
**Solution:**
1. Tally forms automatically redirect on completion
2. Update `popup.onClose` callback in `tally-integration.js`
3. Add close button to modal

#### Issue: Field IDs not detected
**Solution:**
1. Open Tally form in preview mode
2. Use browser dev tools to inspect fields
3. Manually update field IDs in config

---

## Production Deployment

### Checklist
- [ ] Tally forms are published and accessible
- [ ] All field IDs are correctly mapped
- [ ] Tested with multiple students
- [ ] Backup of worksheet files created
- [ ] Error handling tested
- [ ] Mobile responsiveness verified

### Performance Considerations
- Tally embed script loads asynchronously
- Pre-fill data uses URL parameters (no extra API calls)
- Modal opens only when needed

### Security Considerations
- No sensitive data stored locally
- All submissions go directly to Tally
- Form access controlled by Tally settings

---

## Next Steps

1. **Set up Tally forms** with the correct field structure
2. **Test the integration** with a few students
3. **Gather feedback** and make improvements
4. **Deploy to all 350 students**

---

## Support

For issues or questions:
1. Check browser console for error messages
2. Review Tally form settings
3. Verify field ID mappings
4. Test with smaller group first

---

**Happy Teaching! 🎓**
