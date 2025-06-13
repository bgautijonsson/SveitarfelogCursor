import React, { useState, useEffect } from 'react';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography, 
  Paper, 
  Drawer,
  Chip,
  Fade,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { Timeline, BarChart, TrendingUp } from '@mui/icons-material';
import Plot from 'react-plotly.js';
import Papa from 'papaparse';

function App() {
  const [data, setData] = useState([]);
  const [counties, setCounties] = useState([]);
  const [parts, setParts] = useState([]);
  const [variables, setVariables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedCounties, setSelectedCounties] = useState([
    'Reykjavíkurborg',
    'Garðabær',
    'Kópavogsbær',
    'Hafnarfjarðarkaupstaður',
    'Seltjarnarnesbær'
  ]);
  const [selectedPart, setSelectedPart] = useState('A-hluti');
  const [selectedVariable, setSelectedVariable] = useState('Nettóskuldir sem hlutfall af tekjum');

  useEffect(() => {
    Papa.parse('./data/throun_data.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value) => value.trim(),
      complete: (results) => {
        if (results.errors.length > 0) {
          console.error('CSV parsing errors:', results.errors);
          setError('Villa við að hlaða gögnum: ' + results.errors[0].message);
          setLoading(false);
          return;
        }

        const parsedData = results.data
          .filter(d => d.sveitarfelag && d.ar && d.hluti && d.name && d.y)
          .map(d => ({
            ...d,
            ar: Number(d.ar),
            y: Number(d.y),
            is_percent: d.is_percent === 'true' || d.is_percent === true
          }));
        
        setData(parsedData);
        
        const uniqueCounties = [...new Set(parsedData.map(d => d.sveitarfelag))].sort();
        const uniqueParts = [...new Set(parsedData.map(d => d.hluti))].sort();
        const uniqueVariables = [...new Set(parsedData.map(d => d.name))].sort();
        
        setCounties(uniqueCounties);
        setParts(uniqueParts);
        setVariables(uniqueVariables);
        setLoading(false);
      },
      error: (error) => {
        console.error('Error loading data:', error);
        setError('Villa við að hlaða gögnum: ' + error.message);
        setLoading(false);
      }
    });
  }, []);

  const getPlotData = () => {
    if (!data.length || !selectedCounties.length || !selectedPart || !selectedVariable) return [];

    const filteredData = data.filter(d => 
      selectedCounties.includes(d.sveitarfelag) &&
      d.hluti === selectedPart &&
      d.name === selectedVariable
    );

    // Check if the current variable is a percentage
    const isPercentage = filteredData.length > 0 && filteredData[0].is_percent;

    // Light theme color palette that matches your website
    const colors = [
      'hsla(232, 20%, 35%, 1)', // Your primary color
      'hsla(192, 100%, 33%, 1)', // Your success color
      'hsla(280, 70%, 45%, 1)', // Purple
      'hsla(25, 95%, 53%, 1)', // Orange
      'hsla(348, 83%, 47%, 1)', // Red
      'hsla(142, 71%, 45%, 1)', // Green
      'hsla(45, 93%, 47%, 1)', // Yellow
      'hsla(262, 83%, 58%, 1)' // Violet
    ];

    return selectedCounties.map((county, index) => {
      const countyData = filteredData.filter(d => d.sveitarfelag === county);
      return {
        x: countyData.map(d => d.ar),
        y: countyData.map(d => d.y),
        type: 'scatter',
        mode: 'lines+markers',
        name: county,
        line: {
          width: 3,
          shape: 'linear',
          color: colors[index % colors.length]
        },
        marker: {
          size: 7,
          symbol: 'circle',
          color: colors[index % colors.length],
          line: {
            width: 2,
            color: '#ffffff'
          }
        },
        hovertemplate: 
          '<b>%{fullData.name}</b><br>' +
          'Ár: %{x}<br>' +
          'Gildi: ' + (isPercentage ? '%{y:.1f}%' : '%{y:.2f}') + '<br>' +
          '<extra></extra>'
      };
    });
  };

  const getCurrentVariableData = () => {
    if (!data.length || !selectedPart || !selectedVariable) return null;
    
    const sample = data.find(d => 
      d.hluti === selectedPart &&
      d.name === selectedVariable
    );
    
    return sample;
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        gap: 2,
        backgroundColor: 'background.default'
      }}>
        <TrendingUp sx={{ fontSize: 48, color: 'primary.main' }} />
        <Typography variant="h6" sx={{ fontFamily: '"Lato", sans-serif' }}>Hleð gögnum...</Typography>
        <LinearProgress sx={{ width: 300 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, backgroundColor: 'background.default', minHeight: '100vh' }}>
        <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto' }}>
          {error}
        </Alert>
      </Box>
    );
  }

  const drawerWidth = 320;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
            <Timeline sx={{ color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h6">
              Valmynd
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Sveitarfélög</InputLabel>
              <Select
                multiple
                value={selectedCounties}
                onChange={(e) => setSelectedCounties(e.target.value)}
                label="Sveitarfélög"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip 
                        key={value} 
                        label={value.length > 15 ? value.substring(0, 15) + '...' : value}
                        size="small"
                      />
                    ))}
                  </Box>
                )}
                sx={{
                  '& .MuiSelect-select': {
                    minHeight: '56px'
                  }
                }}
              >
                {counties.map((county) => (
                  <MenuItem key={county} value={county}>
                    {county}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Hluti</InputLabel>
              <Select
                value={selectedPart}
                onChange={(e) => setSelectedPart(e.target.value)}
                label="Hluti"
              >
                {parts.map((part) => (
                  <MenuItem key={part} value={part}>
                    {part}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Mælikvarði</InputLabel>
              <Select
                value={selectedVariable}
                onChange={(e) => setSelectedVariable(e.target.value)}
                label="Mælikvarði"
              >
                {variables.map((variable) => (
                  <MenuItem key={variable} value={variable}>
                    <Typography variant="body2" sx={{ 
                      whiteSpace: 'normal',
                      wordWrap: 'break-word'
                    }}>
                      {variable}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Paper sx={{ mt: 4, p: 2, backgroundColor: 'rgba(135, 139, 168, 0.08)' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
              Yfirlit
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              {selectedCounties.length} sveitarfélög valin
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Sýni: {selectedVariable}
            </Typography>
          </Paper>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: 'background.default',
          minHeight: '100vh'
        }}
      >
        <Fade in={!loading} timeout={800}>
          <Box sx={{ p: 4 }}>
            <Paper 
              elevation={2}
              sx={{ 
                p: 4,
                borderRadius: 2,
              }}
            >
              <Plot
                data={getPlotData()}
                layout={{
                  title: {
                    text: selectedVariable,
                    font: { 
                      size: 20, 
                      color: 'hsla(232, 20%, 35%, 1)',
                      family: '"Playfair Display", serif'
                    },
                    x: 0.5,
                    xanchor: 'center'
                  },
                  xaxis: {
                    title: {
                      text: 'Ár',
                      font: { color: 'hsla(232, 20%, 35%, 1)', family: '"Lato", sans-serif' }
                    },
                    showgrid: true,
                    gridcolor: 'hsla(0, 0%, 85%, 1)',
                    zeroline: false,
                    color: 'hsla(232, 20%, 35%, 1)',
                    tickfont: { color: 'hsla(232, 20%, 35%, 1)', family: '"Lato", sans-serif' }
                  },
                  yaxis: {
                    title: {
                      text: (() => {
                        const currentData = getCurrentVariableData();
                        return currentData && currentData.is_percent ? 'Prósenta (%)' : 'Gildi';
                      })(),
                      font: { color: 'hsla(232, 20%, 35%, 1)', family: '"Lato", sans-serif' }
                    },
                    showgrid: true,
                    gridcolor: 'hsla(0, 0%, 85%, 1)',
                    zeroline: true,
                    zerolinecolor: 'hsla(0, 0%, 70%, 1)',
                    zerolinewidth: 2,
                    color: 'hsla(232, 20%, 35%, 1)',
                    tickfont: { color: 'hsla(232, 20%, 35%, 1)', family: '"Lato", sans-serif' },
                    tickformat: (() => {
                      const currentData = getCurrentVariableData();
                      return currentData && currentData.is_percent ? '.1f' : '.2f';
                    })(),
                    ticksuffix: (() => {
                      const currentData = getCurrentVariableData();
                      return currentData && currentData.is_percent ? '%' : '';
                    })()
                  },
                  hovermode: 'closest',
                  showlegend: true,
                  shapes: [
                    {
                      type: 'line',
                      x0: 0,
                      y0: 0,
                      x1: 1,
                      y1: 0,
                      xref: 'paper',
                      yref: 'y',
                      line: {
                        color: 'rgba(0, 0, 0, 0.3)',
                        width: 1,
                        dash: 'dot'
                      }
                    }
                  ],
                  legend: {
                    x: 1,
                    xanchor: 'right',
                    y: 1,
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    bordercolor: 'hsla(0, 0%, 85%, 1)',
                    borderwidth: 1,
                    font: { color: 'hsla(232, 20%, 35%, 1)', family: '"Lato", sans-serif' }
                  },
                  margin: { t: 60, r: 50, b: 60, l: 60 },
                  plot_bgcolor: '#ffffff',
                  paper_bgcolor: '#ffffff',
                  font: {
                    family: '"Lato", sans-serif',
                    color: 'hsla(232, 20%, 35%, 1)'
                  }
                }}
                style={{ width: '100%', height: '600px' }}
                config={{
                  responsive: true,
                  displayModeBar: true,
                  displaylogo: false,
                  modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                  toImageButtonOptions: {
                    format: 'png',
                    filename: 'sveitarfelog-gogn',
                    height: 600,
                    width: 1200,
                    scale: 1
                  }
                }}
              />
            </Paper>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
}

export default App; 