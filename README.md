# UMGC Facilities Master Plan Dashboard

A professional, responsive HTML dashboard that embeds University of Maryland Global Campus (UMGC) Power BI reports with official branding and styling.

## 🎯 Overview

This project provides a clean, institutional-grade web interface for displaying UMGC's Facilities Master Plan dashboard. The HTML page features:

- **Official UMGC Branding**: Colors, fonts, and styling that match UMGC's website
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Large Dashboard Display**: Maximized screen real estate for Power BI content
- **Professional Layout**: Clean header and footer with institutional messaging

## 🚀 Features

### Visual Design
- **UMGC Color Scheme**: Official blue (#1e3a8a), red (#dc2626), and gold (#f59e0b) colors
- **Modern Typography**: Inter font family for professional appearance
- **Responsive Layout**: Adapts to all screen sizes
- **Clean Header**: Compact branding without taking up dashboard space

### Technical Features
- **Power BI Integration**: Seamlessly embeds UMGC Power BI reports
- **Loading States**: Professional loading indicators
- **Error Handling**: Graceful fallbacks for connection issues
- **Cross-browser Compatible**: Works on all modern browsers

## 📁 Files

- `UMGC_PowerBI_Dashboard.html` - Main dashboard HTML file
- `PE_UMGC_Template.json` - UMGC theme configuration (Power BI template)
- `README.md` - This documentation file

## 🔧 Setup Instructions

### Prerequisites
- A published Power BI report with "Publish to web" enabled
- Web browser (Chrome, Firefox, Safari, Edge)

### Installation
1. **Clone this repository**:
   ```bash
   git clone [your-repo-url]
   cd umgc-powerbi-dashboard
   ```

2. **Open the dashboard**:
   - Double-click `UMGC_PowerBI_Dashboard.html` to open in your browser
   - Or serve via a web server for production use

3. **Update Power BI URL** (if needed):
   - Edit the iframe `src` attribute in the HTML file
   - Replace with your Power BI report's embed URL

## 🎨 Customization

### Colors
The dashboard uses CSS custom properties for easy color customization:
```css
:root {
    --umgc-primary: #1e3a8a;    /* UMGC Blue */
    --umgc-secondary: #dc2626;  /* UMGC Red */
    --umgc-accent: #f59e0b;     /* UMGC Gold */
    /* ... more colors */
}
```

### Content
- **Header**: Update the university name and dashboard title
- **Footer**: Modify contact information and links
- **Dashboard Title**: Change "FMP Campus" to your specific dashboard name

## 🌐 Deployment Options

### Option 1: GitHub Pages
1. Enable GitHub Pages in your repository settings
2. Set source to "Deploy from a branch"
3. Choose "main" branch and "/ (root)" folder
4. Your dashboard will be available at: `https://[username].github.io/[repository-name]`

### Option 2: Web Server
Upload the HTML file to any web server:
- University web servers
- Cloud hosting (AWS S3, Azure Static Sites, etc.)
- Content delivery networks

### Option 3: Local Sharing
- Share the HTML file directly
- Use local web servers like Live Server (VS Code extension)

## 🔗 Power BI Integration

### Getting Your Power BI URL
1. Open your Power BI report in Power BI Desktop
2. Click **Publish** → **Publish to Power BI**
3. In Power BI Service, go to your report
4. Click **File** → **Embed** → **Publish to web**
5. Copy the generated embed URL
6. Replace the URL in the HTML file's iframe

### Security Considerations
- **Public Reports**: "Publish to web" makes reports publicly accessible
- **Data Sensitivity**: Ensure your data is safe for public viewing
- **Organization Policies**: Check UMGC's data sharing policies

## 📱 Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🛠️ Development

### Local Development
1. Open the HTML file in your browser
2. Use browser developer tools to test responsive design
3. Modify CSS variables for quick styling changes

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across different browsers and devices
5. Submit a pull request

## 📄 License

This project is created for University of Maryland Global Campus internal use. Please ensure compliance with UMGC's branding guidelines and data policies.

## 🤝 Support

For questions or issues:
- **UMGC IT Support**: Contact your local IT department
- **Power BI Help**: [Microsoft Power BI Documentation](https://docs.microsoft.com/en-us/power-bi/)
- **Web Development**: Standard HTML/CSS/JavaScript resources

## 🏢 About UMGC

University of Maryland Global Campus is a public university serving working adults worldwide. Learn more at [umgc.edu](https://www.umgc.edu/).

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Maintained by**: UMGC IT Department
