import React, { PureComponent } from 'react';

import { 
  ThemeProvider,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Button
} from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';

import './App.css';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#eaeaea'
    },
    secondary: {
      main: '#1a1a1a'
    }
  },
});

const TAGS = [
  {
    name: 'Qualification',
    tags: ['Starter', 'Senior Operator', 'Top Operator']
  },
  {
    name: 'Position',
    tags: ['Melee', 'Ranged']
  },
  {
    name: 'Class',
    tags: ['Guard', 'Medic', 'Vanguard', 'Caster', 'Sniper', 'Defender', 'Supporter', 'Specialist'].sort()
  },
  {
    name: 'Affix',
    tags: [
      'Healing', 'Support', 'DPS', 'AoE', 'Slow', 'Survival', 'Defense', 'Debuff', 'Shift', 
      'Crowd Control', 'Nuker', 'Summon', 'Fast-Redeploy', 'DP-Recovery', 'Robot'
    ].sort()
  }
]

class App extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      operators: null,

      selectedTags: []
    };
  }

  componentDidMount() {
    fetch('/operators.json')
      .then(response => {
        if (!response.ok) {
          throw new Error();
        }

        return response.json();
      })
      .then(result => {
        this.setState({ operators: result });
      })
      .catch(() => {
        alert('Error when fetching operators data.');
      })
  }

  onTagClick = (clickedTag) => {
    let selectedTags = [...this.state.selectedTags];

    if (selectedTags.includes(clickedTag)) {
      selectedTags = selectedTags.filter(tag => tag !== clickedTag);
    }
    else {
      selectedTags.push(clickedTag);
    }

    this.setState({ selectedTags: selectedTags }, this.calculateOperators);
  }

  calculateOperators = () => {
    
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <div className='app'>
          <div className='content'>
            <h1>Arknights Recruitment Calculator</h1>

            <div className='tags-area'>
              <TableContainer>
                <Table>
                  <TableBody>
                  {
                    TAGS.map(tagCategory => {
                      return (
                        <TableRow>
                          <TableCell className='tags-table-cell tags-table-category'>
                            {tagCategory.name}
                          </TableCell>
                          <TableCell className='tags-table-cell'>
                            {
                              tagCategory.tags.map(tag => {
                                return (
                                  <Button 
                                    className='tag-button' 
                                    variant={this.state.selectedTags.includes(tag) ? 'contained' : 'outlined'} 
                                    color='primary' 
                                    onClick={() => this.onTagClick(tag)}
                                  >
                                    {tag}
                                  </Button>
                                )
                              })
                            }
                          </TableCell>                          
                        </TableRow>
                      );
                    })
                  }    
                  </TableBody>
                </Table>
              </TableContainer>
                        
            </div>
          </div>
        </div>
      </ThemeProvider>
     
    );
  }
}

export default App;