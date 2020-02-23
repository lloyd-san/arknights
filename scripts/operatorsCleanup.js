const fs = require('fs');

const TAG_TRANSLATIONS = [
  {
    chinese: '治疗',
    english: 'Healing'
  },
  {
    chinese: '远程位',
    english: 'Ranged'
  },
  {
    chinese: '近战位',
    english: 'Melee'
  },
  {
    chinese: '支援',
    english: 'Support'
  },
  {
    chinese: '新手',
    english: 'Starter'
  },
  {
    chinese: '费用回复',
    english: 'DP-Revoery'
  },
  {
    chinese: '输出',
    english: 'DPS'
  },
  {
    chinese: '群攻',
    english: 'AoE'
  },
  {
    chinese: '减速',
    english: 'Slow'
  },
  {
    chinese: '生存',
    english: 'Survival'
  },
  {
    chinese: '防护',
    english: 'Defense'
  },
  {
    chinese: '削弱',
    english: 'Debuff'
  },
  {
    chinese: '快速复活',
    english: 'Fast-Redeploy'
  },
  {
    chinese: '位移',
    english: 'Shift'
  },
  {
    chinese: '高级资深干员',
    english: 'Top Operator'
  },
  {
    chinese: '资深干员',
    english: 'Senior Operator'
  },
  {
    chinese: '控场',
    english: 'Crowdcontrol'
  },
  {
    chinese: '召唤',
    english: 'Summon'
  },
  {
    chinese: '爆发',
    english: 'Nuker',
  },
  {
    chinese: '重装',
    english: 'Defender'
  },
  {
    chinese: '先锋',
    english: 'Vanguard'
  },
  {
    chinese: '医疗',
    english: 'Medic'
  },
  {
    chinese: '术师',
    english: 'Caster',
  },
  {
    chinese: '特种',
    english: 'Specialist'
  },
  {
    chinese: '狙击',
    english: 'Sniper'
  },
  {
    chinese: '辅助',
    english: 'Supporter'
  },
  {
    chinese: '近卫',
    english: 'Guard'
  },
  {
    chinese: '支援机械',
    english: 'Robot'
  }
];

cleanUp();

function cleanUp() {
  let operators = loadRawFile();

  console.log('Filtering out unrecruitable operators.');
  
  operators = operators.filter(x => !x.hidden && x.tags && x.tags.length > 0);

  console.log('Cleaning and translating operator info.');

  operators.forEach(operator => {
    delete operator.camp;
    delete operator.sex;
    delete operator.characteristic;
    delete operator.hidden;

    operator.stars = operator.level;

    delete operator.level;

    operator.tags.push(operator.type);

    delete operator.type;

    operator.tags = translateTags(operator.tags);
  });

  console.log(`Adding 'Robot' tag for Lancet-2 and Castle-3.`);

  let lancet2 = operators.find(x => x.name === 'Lancet-2');
  let castle3 = operators.find(x => x.name === 'Castle-3');

  lancet2.tags.push('Robot');
  castle3.tags.push('Robot');

  saveOperatorsJson(operators);
}

function loadRawFile() {
  console.log('Reading file');

  let buffer = fs.readFileSync('./public/data/operators_raw.json');
  let json = buffer.toString();

  let operatorsRaw = JSON.parse(json);

  return operatorsRaw;
}

function saveOperatorsJson(operators) {
  console.log(`Saving ${operators.length} operators' info to file.`);

  fs.writeFileSync('./public/data/operators.json', JSON.stringify(operators, null, 2));
  fs.writeFileSync('./public/data/operators-min.json', JSON.stringify(operators));  
}

function translateTags(tags) {
  let translatedTags = [];

  tags.forEach(chineseTag => {
    let tagTranslation = TAG_TRANSLATIONS.find(x => x.chinese === chineseTag);

    if (!tagTranslation) {
      console.warn(`Unknown tag: ${chineseTag}`);
      return;
    }

    translatedTags.push(tagTranslation.english);
  });

  return translatedTags;
}