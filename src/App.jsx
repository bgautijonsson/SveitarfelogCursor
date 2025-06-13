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
  Card,
  CardContent
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

    // Clean, professional color palette based on theme
    const colors = [
      'hsla(232, 20%, 35%, 1)', // Primary
      'hsla(192, 100%, 33%, 1)', // Success
      'hsla(280, 70%, 45%, 1)', // Purple
      'hsla(25, 95%, 53%, 1)', // Orange
      'hsla(348, 83%, 47%, 1)', // Red
      'hsla(142, 71%, 45%, 1)', // Green
      'hsla(45, 93%, 47%, 1)', // Yellow
      'hsla(210, 70%, 50%, 1)', // Blue
      'hsla(320, 65%, 52%, 1)', // Magenta
      'hsla(160, 60%, 45%, 1)'  // Teal
    ];

    return selectedCounties.map((county, index) => {
      const countyData = filteredData.filter(d => d.sveitarfelag === county);
      return {
        x: countyData.map(d => d.ar),
        y: countyData.map(d => isPercentage ? d.y * 100 : d.y),
        type: 'scatter',
        mode: 'lines+markers',
        name: county,
        line: {
          width: 3,
          shape: 'linear',
          color: colors[index % colors.length]
        },
        marker: {
          size: 6,
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
        gap: 3,
        backgroundColor: 'hsla(0, 9%, 98%, 1)'
      }}>
        <TrendingUp sx={{ fontSize: 48, color: 'hsla(232, 20%, 35%, 1)' }} />
        <Typography variant="h6" sx={{ fontFamily: '"Lato", sans-serif', color: 'hsla(232, 20%, 35%, 1)' }}>
          Hleð gögnum...
        </Typography>
        <LinearProgress sx={{ width: 300, '& .MuiLinearProgress-bar': { backgroundColor: 'hsla(192, 100%, 33%, 1)' } }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, backgroundColor: 'hsla(0, 9%, 98%, 1)', minHeight: '100vh' }}>
        <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto' }}>
          {error}
        </Alert>
      </Box>
    );
  }

  const drawerWidth = 320;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'hsla(0, 9%, 98%, 1)' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
            borderRight: '1px solid rgba(0,0,0,0.08)'
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <Timeline sx={{ color: 'hsla(232, 20%, 35%, 1)', fontSize: 32 }} />
            <Typography variant="h5" sx={{ 
              fontFamily: '"Playfair Display", serif',
              color: 'hsla(232, 20%, 35%, 1)',
              fontWeight: 600
            }}>
              Fjármáladashboard
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ fontFamily: '"Lato", sans-serif' }}>Sveitarfélög</InputLabel>
              <Select
                multiple
                value={selectedCounties}
                onChange={(e) => setSelectedCounties(e.target.value)}
                label="Sveitarfélög"
                sx={{ fontFamily: '"Lato", sans-serif' }}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip 
                        key={value} 
                        label={value.length > 15 ? value.substring(0, 15) + '...' : value}
                        size="small"
                        sx={{
                          backgroundColor: 'hsla(192, 100%, 33%, 1)',
                          color: 'white',
                          fontFamily: '"Lato", sans-serif'
                        }}
                      />
                    ))}
                  </Box>
                )}
              >
                {counties.map((county) => (
                  <MenuItem key={county} value={county} sx={{ fontFamily: '"Lato", sans-serif' }}>
                    {county}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel sx={{ fontFamily: '"Lato", sans-serif' }}>Hluti</InputLabel>
              <Select
                value={selectedPart}
                onChange={(e) => setSelectedPart(e.target.value)}
                label="Hluti"
                sx={{ fontFamily: '"Lato", sans-serif' }}
              >
                {parts.map((part) => (
                  <MenuItem key={part} value={part} sx={{ fontFamily: '"Lato", sans-serif' }}>
                    {part}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel sx={{ fontFamily: '"Lato", sans-serif' }}>Mælikvarði</InputLabel>
              <Select
                value={selectedVariable}
                onChange={(e) => setSelectedVariable(e.target.value)}
                label="Mælikvarði"
                sx={{ fontFamily: '"Lato", sans-serif' }}
              >
                {variables.map((variable) => (
                  <MenuItem key={variable} value={variable} sx={{ fontFamily: '"Lato", sans-serif' }}>
                    <Typography variant="body2" sx={{ 
                      whiteSpace: 'normal',
                      wordWrap: 'break-word',
                      fontFamily: '"Lato", sans-serif'
                    }}>
                      {variable}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Card sx={{ mt: 4, backgroundColor: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ 
                color: 'hsla(232, 20%, 35%, 1)',
                fontFamily: '"Lato", sans-serif',
                mb: 2
              }}>
                Yfirlit
              </Typography>
              <Typography variant="body2" sx={{ 
                color: 'hsla(232, 20%, 35%, 1)',
                fontFamily: '"Lato", sans-serif',
                mb: 1
              }}>
                {selectedCounties.length} sveitarfélög valin
              </Typography>
              <Typography variant="body2" sx={{ 
                color: 'hsla(232, 20%, 35%, 1)',
                fontFamily: '"Lato", sans-serif'
              }}>
                Mælikvarði: {selectedVariable.length > 30 ? selectedVariable.substring(0, 30) + '...' : selectedVariable}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: 'hsla(0, 9%, 98%, 1)',
          minHeight: '100vh'
        }}
      >
        <Fade in={!loading} timeout={500}>
          <Box sx={{ p: 4 }}>
            <Paper 
              elevation={1}
              sx={{ 
                p: 4,
                borderRadius: 2,
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
              }}
            >
              <Typography variant="h4" sx={{ 
                fontFamily: '"Playfair Display", serif',
                color: 'hsla(232, 20%, 35%, 1)',
                mb: 3,
                fontWeight: 600
              }}>
                {selectedVariable}
              </Typography>
              
              <Plot
                data={getPlotData()}
                layout={{
                  xaxis: {
                    title: {
                      text: 'Ár',
                      font: { 
                        color: 'hsla(232, 20%, 35%, 1)', 
                        family: '"Lato", sans-serif',
                        size: 14
                      }
                    },
                    showgrid: true,
                    gridcolor: 'rgba(0,0,0,0.1)',
                    zeroline: false,
                    color: 'hsla(232, 20%, 35%, 1)',
                    tickfont: { 
                      color: 'hsla(232, 20%, 35%, 1)', 
                      family: '"Lato", sans-serif'
                    }
                  },
                  yaxis: {
                    title: {
                      text: (() => {
                        const currentData = getCurrentVariableData();
                        return currentData && currentData.is_percent ? 'Prósenta (%)' : 'Gildi';
                      })(),
                      font: { 
                        color: 'hsla(232, 20%, 35%, 1)', 
                        family: '"Lato", sans-serif',
                        size: 14
                      }
                    },
                    showgrid: true,
                    gridcolor: 'rgba(0,0,0,0.1)',
                    zeroline: true,
                    zerolinecolor: 'rgba(0,0,0,0.3)',
                    zerolinewidth: 1,
                    color: 'hsla(232, 20%, 35%, 1)',
                    tickfont: { 
                      color: 'hsla(232, 20%, 35%, 1)', 
                      family: '"Lato", sans-serif'
                    },
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
                    bordercolor: 'rgba(0,0,0,0.1)',
                    borderwidth: 1,
                    font: { 
                      color: 'hsla(232, 20%, 35%, 1)', 
                      family: '"Lato", sans-serif'
                    }
                  },
                  margin: { t: 60, r: 50, b: 60, l: 80 },
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
                    filename: 'sveitarfelog-dashboard',
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