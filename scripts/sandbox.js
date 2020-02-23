permutations(['Melee', 'Ranged', 'Caster']);

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

  return permutations;
}