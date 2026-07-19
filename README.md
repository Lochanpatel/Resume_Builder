# Resume Builder

A modern resume builder app to create, preview, and export resumes with real-time updates and local storage.

## Features
- 📝 **Easy Editing** - Fill in your information with real-time preview updates
- 💾 **Auto-Save** - Resume data automatically saves to browser local storage
- 👁️ **Live Preview** - See your resume update instantly as you type
- 🎨 **Professional Templates** - Clean, modern resume layout
- 📄 **PDF Export** - Download your resume as a PDF
- 🖨️ **Print Ready** - Optimized print styling for best results
- ✅ **Form Validation** - Email, phone, and URL validation with error messages

## Project Structure
```
Resume_Builder/
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main resume builder component
│   │   ├── main.jsx         # Entry point
│   │   ├── styles.css       # Global styles
│   │   ├── utils.js         # Validation and storage utilities
│   │   └── utils.test.js    # Unit tests
│   ├── index.html           # HTML template
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration
├── backend/
│   └── requirements.txt      # Python dependencies
└── README.md                # This file
```

## Quick Start

### Frontend Setup

1. **Install dependencies**
   ```powershell
   cd frontend
   npm install
   ```

2. **Run development server**
   ```powershell
   npm run dev
   ```
   The app will open at `http://localhost:5173`

3. **Run tests**
   ```powershell
   npm test           # Watch mode
   npm run test:run   # Run once and exit
   ```

4. **Build for production**
   ```powershell
   npm run build
   npm run preview    # Preview production build locally
   ```

### Backend Setup (Optional)


1. **Install dependencies**
   ```powershell
   cd backend
   pip install -r requirements.txt
   ```

2. **Run the server** (when implemented)
   ```powershell
   python -m uvicorn main:app --reload
   ```

## Usage

1. **Create Your Resume**
   - Fill in your profile information (name, email, phone, website)
   - Add your professional summary
   - Enter work experience entries
   - Add education entries
   - List your skills (comma-separated)

2. **Real-Time Preview**
   - See your resume update instantly on the right side of the screen
   - The preview shows what your final resume will look like

3. **Save Your Work**
   - Your resume automatically saves to browser storage
   - Close and reopen the page to load your saved resume
   - Use "Reset example" to start over with default data

4. **Export Your Resume**
   - **Download PDF** - Save your resume as a PDF file to your computer
   - **Print resume** - Open the print dialog to print or save as PDF
   - **Download PDF Advantages** - Filename automatically generated from your name

## Form Validation

The form includes validation for:
- **Name** - Required field
- **Email** - Must be valid email format (e.g., user@example.com)
- **Phone** - Accepts numbers, dashes, parentheses, spaces, and plus signs
- **Website** - Must be valid URL format (e.g., github.com/username)

Invalid fields display error messages below the input.

## Technologies Used

**Frontend:**
- React 18.2 - UI component library
- Vite 5.0 - Fast build tool and dev server
- Vitest 1.0 - Unit testing framework
- html2pdf.js - PDF generation
- CSS3 - Styling with CSS variables and grid

**Backend (Future):**
- FastAPI - Python web framework
- Uvicorn - ASGI server

## Development Workflow

### Making Changes

1. Edit files in `frontend/src/`
2. Changes automatically refresh in the browser
3. Run tests with `npm test`
4. Build for production with `npm run build`

### Adding Features

When adding new features:
1. Create validation functions in `utils.js` if needed
2. Add corresponding tests in `utils.test.js`
3. Update React components to use the validated data
4. Update styles in `styles.css`

## Known Limitations

- Resume data is stored only in browser local storage (not synced across devices)
- PDF export uses html2pdf.js which has some styling limitations
- Currently supports single template style (multiple templates coming in Sprint 2)

## Next Steps (Sprint 2)

- Backend API for cloud storage
- Multiple resume templates
- Undo/Redo functionality
- Rich text editor for descriptions
- Export to Word format
- More export options

## Troubleshooting

**Issue: npm install fails**
- Make sure you're in the `frontend` directory
- Delete `node_modules` folder and `package-lock.json`, then run `npm install` again

**Issue: Port 5173 already in use**
- Change the port in `frontend/vite.config.js` or kill the process using the port

**Issue: Changes not reflecting in browser**
- Hard refresh the page with `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache for localhost

**Issue: Resume data lost after refresh**
- Check browser local storage is enabled
- Try a different browser to see if it's a storage issue
.

