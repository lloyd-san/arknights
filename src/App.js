import React, { PureComponent } from 'react';

import { 
  ThemeProvider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Button,
  Link
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
      'Crowdcontrol', 'Nuker', 'Summon', 'Fast-Redeploy', 'DP-Recovery', 'Robot'
    ].sort()
  }
];

const MAX_TAGS = 7;

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
    else if (selectedTags.length < MAX_TAGS) {
      selectedTags.push(clickedTag);
    }

    this.setState({ selectedTags: selectedTags }, this.calculateOperators);
  }

  onClear = () => {
    this.setState({ selectedTags: [], calculateOperators: [] });
  }

  calculateOperators = () => {
    let operators = this.state.operators;
    let selectedTags = this.state.selectedTags;

    let tagCombinations = permutations(selectedTags);
    
    let results = [];
    tagCombinations.forEach(combination => {
      let qualificationFilter = (op) => { return op.stars !== 1 && op.stars !== 6};
      if (combination.includes('Robot')) {
        qualificationFilter = (op) => { return op.stars === 1};
      }
      else if (combination.includes('Starter')) {
        qualificationFilter = (op) => { return op.stars === 2};
      }
      else if (combination.includes('Senior Operator')) {
        qualificationFilter = (op) => { return op.stars === 5};
      }
      else if (combination.includes('Top Operator')) {
        qualificationFilter = (op) => { return op.stars === 6};
      }

      let combinationOperators = operators.filter(op => {
        for (let i = 0; i < combination.length; i++) {
          if (!qualificationFilter(op) || !op.tags.includes(combination[i])) {
            return false;
          }
        }

        return true;
      });

      let maxStars = 1;
      let minStars = 6;

      combinationOperators.forEach(op => {
        if (op.stars > maxStars) {
          maxStars = op.stars;
        }
        
        if (op.stars < minStars) {
          minStars = op.stars;
        }
      });

      let combinationResults = {
        name: combination.join(' + '),
        operators: combinationOperators.sort((a, b) => {
          if (a.stars > b.stars) {
            return -1;
          }
          else if (a.stars < b.start) {
            return 1;
          }
          else {
            if (a.name > b.name) {
              return 1;
            }
            else if (a.name < b.name) {
              return -1;
            }
            else {
              return 0;
            }
          }
        }),
        maxStars: maxStars,
        minStars: minStars
      };

      results.push(combinationResults);
    });

    results = results.sort((a, b) => {
      let singleOpA = a.operators.length === 1;
      let singleOpB = b.operators.length === 1
      
      if (singleOpA && !singleOpB) {
        return -1
      }
      else if (!singleOpA && singleOpB) {
        return 1;
      }
      else {
        if (a.maxStars > b.maxStars) {
          return -1;
        }
        else if (a.maxStars < b.maxStars) {
          return 1;
        }
        else {
          if (a.minStars > b.minStars) {
            return -1;
          }
          else if (a.minStars > b.minStars) {
            return 1;
          }
          else {
            if (a.operators.length > b.operators.length) {
              return 1;
            }
            else if (a.operators.length < b.operators.length) {
              return -1;
            }
            else {
              return 0;
            }
          }
        }  
      }
    })

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
                <Table className='tags-table'>
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
            
            <div className='clear-button-container'>
              <Button color='primary' variant='outlined' onClick={this.onClear}>
                Clear tags
              </Button>
            </div>

            <h1>Operators</h1>

            <h3>
              {
                this.state.selectedTags.length > 0 ? null : 'Select at least one tag'
              }
            </h3>
            
            <div className='tags-area'>
              <TableContainer>
                <Table className='tags-table'>
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
                                let gamepressUrl = `https://gamepress.gg/arknights/operator/${op.name.toLowerCase()}`

                                return (
                                  <Button 
                                    key={op.name}
                                    className='tag-button' 
                                    variant={'contained'} 
                                    style={{ backgroundColor: starsToColor(op.stars) }}
                                    href={gamepressUrl}
                                    target='_blank'
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

          <div className='footer'>
            <div>
              <Link className='arknights-link' href='https://www.arknights.global/' target='_blank'>
                Arknights
              </Link>
              <span> by </span>
              <Link className='arknights-link' href='https://www.hypergryph.com/' target='_blank'>
                HyperGryph
              </Link>
              <span> and </span> 
              <Link className='arknights-link' href='https://www.yo-star.com/' target='_blank'>
                Yostar
              </Link>
            </div>
            <div>
              <span>Operators data from  </span>
              <Link className='arknights-link' href='https://github.com/Aceship/AN-EN-Tags' target='_blank'>
                Aceship@GitHub
              </Link>
            </div>
            <div>
              <span>Source and contact at </span>
              <Link className='arknights-link' href='https://github.com/lloyd-san/arknights' target='_blank'>
                Lloyd-san@Github/Arknights
              </Link>
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

function starsToColor(stars) {
  switch (stars) {
    case 1:
      return '#eaeaea';
    case 2:
      return '#dae336';
    case 3: 
      return '#00b7ff';
    case 4:
      return '#cabccd';
    case 5:
      return '#e0cd8d';
    case 6:
      return '#d48e26';
    default: 
      return '#eaeaea';
  }
}

export default App;