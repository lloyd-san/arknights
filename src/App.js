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
      operators: [],

      selectedTags: [],
      calculateOperators: []
    };
  }

  componentDidMount() {
    fetch('./data/operators-min.json')
      .then(response => {
        if (!response.ok) {
          throw new Error();
        }

        return response.json();
      })
      .then(result => {
        this.setState({ operators: result });
      })
      .catch(err => {
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
    let operators = this.state.operators;
    let selectedTags = this.state.selectedTags;

    let tagCombinations = permutations(selectedTags);
    
    let results = [];
    tagCombinations.forEach(combination => {
      let combinationOperators = operators.filter(op => {
        for (let i = 0; i < combination.length; i++) {
          if (!op.tags.includes(combination[i])) {
            return false;
          }
        }

        return true;
      });

      let combinationResults = {
        name: combination.join(' + '),
        operators: combinationOperators
      };

      results.push(combinationResults);
    });

    this.setState({ calculateOperators: results });

    console.log(JSON.stringify(results));
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
                        <TableRow key={tagCategory.name}>
                          <TableCell className='tags-table-cell tags-table-category'>
                            {tagCategory.name}
                          </TableCell>
                          <TableCell className='tags-table-cell'>
                            {
                              tagCategory.tags.map(tag => {
                                return (
                                  <Button 
                                    key={tag}
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
            <div className='tags-area'>
              <TableContainer>
                <Table>
                  <TableBody>
                  {
                    this.state.calculateOperators.map(combination => {
                      if (combination.operators.length === 0) {
                        return null;
                      }

                      return (
                        <TableRow key={combination.name}>
                          <TableCell className='tags-table-cell tags-table-category'>
                            {combination.name}
                          </TableCell>
                          <TableCell className='tags-table-cell'>
                            {
                              combination.operators.map(op => {
                                return (
                                  <Button 
                                    key={op.name}
                                    className='tag-button' 
                                    variant={'contained'} 
                                    color='primary'
                                  >
                                    {op.name}
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

function permutations(array) {
  let permutations = [];

  for (let i = 0; i < Math.pow(2, array.length); i++) {
    let binary = (i >>> 0).toString(2);

    let diff = array.length - binary.length;

    binary = new Array(diff + 1).join('0') + binary;

    let permutation = [];

    for (let y = array.length - 1; y >= 0; y--) {
      let b = binary[y];

      if (b === '1') {
        permutation.push(array[y]);
      }
    }

    if (permutation.length > 0) {
      permutations.push(permutation);
    }
  }

  return permutations.sort((a, b) => {
    if (a.length > b.length) {
      return -1;
    }
    else if (a.length < b.length) {
      return 1;
    }
    else {
      return 0;
    }
  });
}

export default App;