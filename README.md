# UMGC Facilities Master Plan - Dashboard Project

## 📊 Project Overview

This project contains an integrated multi-dashboard system for the University of Maryland Global Campus Facilities Master Plan, combining space planning, employee commute analysis, and Power BI reporting.

## 🚀 Quick Start

**To use the integrated dashboard:**
1. Open `UMGC_Multi_Dashboard.html` in any modern web browser
2. No installation or build process required
3. Navigate between dashboards using the tab buttons

## 📁 Project Structure

```
09_PowerBIDashboard/
│
├── UMGC_Multi_Dashboard.html          # 🎯 Main integrated dashboard (USE THIS)
│   └── Contains all 3 dashboards in one file
│       ├── Dashboard 1: Space Planning
│       ├── Dashboard 2: Employee Commute Analysis (with Mapbox)
│       └── Dashboard 3: Power BI Integration
│
├── SpaceNeedDashboard/                 # 📦 Original Next.js source (reference only)
│   └── Next.js/React source code for Space Planning dashboard
│
├── CommuteAnalysis/                    # 📦 Original Next.js source (reference only)
│   └── Next.js/React source code for Commute Analysis dashboard
│
├── UMGC-logo-stacked-rgb.png          # 🎨 Official UMGC logo
├── umgc-brand-identity-guide-public.pdf # 📘 Official brand guidelines
│
├── UMGC_FMP.pbix                      # Power BI Desktop file
├── CapacityStudy.xlsx                 # Data file
├── ColorCodingPowerBI.xlsx            # Data file
├── Growth_Articulation_Legend.png     # Asset
├── PE_UMGC_Template.json              # Configuration file
│
└── Legacy HTML files (archived):
    ├── UMGC_PowerBI_Dashboard.html
    └── UMGC_Multi_Dashboard.html (old version)
```

## 🎨 Dashboard Features

### Dashboard 1: Space Planning
- **Building Parameters**: Adjust floors, GSF per floor, and efficiency
- **Space Allocation**: 10 predefined space types + custom spaces
- **Real-time Calculations**: Automatic updates of totals and utilization
- **Visualizations**: Pie and bar charts
- **Data Tables**: Category summary and detailed breakdowns
- **Alert System**: Warns when over capacity

### Dashboard 2: Employee Commute Analysis
- **Interactive Map**: Mapbox integration with color-coded markers
- **Filter Modes**: Toggle between time (0-120 min) and distance (5-100 miles)
- **Multi-Modal**: Compare car vs. public transit
- **Data**: Analyzes 749 employees assigned to Adelphi Campus
- **Charts**: Travel time distribution visualization
- **CSV Upload**: Load custom employee data

### Dashboard 3: Power BI
- **External Integration**: Embedded Power BI report
- **Authentication Modes**: Toggle between public and authenticated access
- **Interactive Reporting**: Full Power BI functionality

## 🎨 Official UMGC Brand Identity

The dashboard uses official UMGC brand colors and logo:

### Official Colors
- **Gold**: #F2A900 (Primary brand color)
- **Red**: #D50032 (Secondary brand color)
- **Black**: #000000 (Text and accents)
- **Navy**: #003366 (Web accent color)

### Brand Assets
- **Logo**: `UMGC-logo-stacked-rgb.png` (Official stacked logo with gold, red, and black swooshes)
- **Guidelines**: `umgc-brand-identity-guide-public.pdf` (Complete brand guidelines)

## 🛠️ Technology Stack

### Integrated Dashboard (UMGC_Multi_Dashboard.html)
- **Pure HTML/CSS/JavaScript** (no build process)
- **Chart.js** for data visualization
- **Mapbox GL JS** for interactive maps
- **Responsive Design** (mobile, tablet, desktop)
- **Official UMGC Branding**: Colors, logo, and typography per brand guidelines

### Original Source Folders (Reference Only)
- **Next.js 14/15** - React framework
- **TypeScript** - Type safety
- **shadcn/ui** - Component library
- **Recharts** - Charts (replaced with Chart.js in integrated version)
- **Mapbox GL** - Maps

## 📝 Development Notes

### Why Keep Original Folders?
The `SpaceNeedDashboard/` and `CommuteAnalysis/` folders contain the original Next.js/React source code. These are kept for:
- **Reference**: Original component architecture
- **Backup**: In case modifications are needed
- **Documentation**: Shows the conversion process
- **Future Development**: Can be used as starting point for updates

### Conversion Process
Both dashboards were converted from:
- React/Next.js → Vanilla JavaScript
- TypeScript → JavaScript
- Recharts → Chart.js
- Component-based → Functional
- Build process → Single HTML file

## 🎯 Usage Guidelines

### For End Users
- Simply open `UMGC_Multi_Dashboard.html`
- No technical knowledge required
- Works offline (except external data sources)

### For Developers
- Main file: `UMGC_Multi_Dashboard.html` (2,800+ lines)
- All code is self-contained and commented
- CSS uses CSS custom properties for theming
- JavaScript is organized into sections:
  - Tab navigation
  - Commute analysis functionality
  - Space planning functionality

## 📊 Data Sources

### Space Planning Dashboard
- All calculations done client-side
- Default values provided
- No external data required

### Commute Analysis Dashboard
- **Default Data**: Loaded from Vercel blob storage
  - URL: `https://hebbkx1anhila5yf.public.blob.vercel-storage.com/...`
- **Custom Data**: Upload your own CSV file
- **Format**: ZCTA5CE20, Latitude, Longitude, distances, durations, people count

### Power BI Dashboard
- Hosted on `app.powerbi.com`
- Report ID: `3f02874f-fe2a-4b19-9502-6fbec6ab4341`
- Requires Microsoft authentication

## 🔧 Customization

### Update UMGC Branding
The dashboard uses official UMGC brand colors. Edit CSS custom properties in `UMGC_Multi_Dashboard.html` if needed:
```css
:root {
    --umgc-gold: #F2A900;    /* UMGC Official Gold */
    --umgc-red: #D50032;     /* UMGC Official Red */
    --umgc-black: #000000;   /* UMGC Official Black */
    --umgc-navy: #003366;    /* Web accent */
}
```

**Note**: Always follow the official brand guidelines in `umgc-brand-identity-guide-public.pdf`

### Modify Space Types
Edit the `SPACE_TYPES` array in the JavaScript section.

### Change Default Values
Update building parameters, quantities, and thresholds in the JavaScript initialization.

## 📱 Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Internet Explorer not supported

## 🔐 Security Notes

- No sensitive data stored locally
- External data loaded via HTTPS
- Power BI uses Microsoft authentication
- Mapbox uses read-only API key

## 📞 Support

For questions or issues:
1. Check this README
2. Review inline code comments
3. Refer to original source folders for architecture

## 📅 Version History

- **v2.0** (Current) - Integrated multi-dashboard with Mapbox
- **v1.0** - Initial Power BI integration

## 🏗️ Future Enhancements

Potential improvements:
- Add data export functionality
- Implement local storage for preferences
- Add print-friendly layouts
- Create mobile app wrapper
- Add more chart types

---

**Last Updated**: October 10, 2025  
**Project**: UMGC Facilities Master Plan  
**Organization**: University of Maryland Global Campus
