# Icelandic Counties Financial Dashboard

A modern, interactive dashboard for visualizing financial data from Icelandic municipalities. Built with React, Plotly.js, and Material-UI.

## Features

- 📊 Interactive time series visualization
- 🏛️ Multiple county selection
- 📈 Various financial metrics
- 🎨 Modern dark theme design
- 📱 Responsive layout
- 🔍 Zoom and pan functionality
- 💾 Download charts as images

## Live Demo

[View the dashboard](https://yourusername.github.io/Sveitarfelog) (replace with your GitHub username)

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Sveitarfelog.git
cd Sveitarfelog
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:3000 in your browser

## Deployment to GitHub Pages

### Automatic Deployment (Recommended)

This project is configured for automatic deployment to GitHub Pages using GitHub Actions:

1. Push your code to the `main` branch
2. GitHub Actions will automatically build and deploy the site
3. Your dashboard will be available at `https://yourusername.github.io/Sveitarfelog`

### Manual Deployment

You can also deploy manually:

```bash
npm run deploy
```

## Data Format

The dashboard expects CSV data with the following columns:
- `sveitarfelag`: Municipality name
- `ar`: Year
- `hluti`: Financial category
- `name`: Metric name
- `y`: Metric value
- `is_percent`: Whether the value is a percentage

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool
- **Plotly.js** - Interactive charting
- **Material-UI** - Component library
- **PapaParse** - CSV parsing
- **GitHub Pages** - Hosting

## Project Structure

```
Sveitarfelog/
├── public/
│   └── data/
│       └── throun_data.csv    # Financial data
├── src/
│   ├── App.jsx                # Main application component
│   └── main.jsx               # Application entry point
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions workflow
└── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details 