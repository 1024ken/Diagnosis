const fs = require('fs')
const xlsx = require('xlsx')
const utils = xlsx.utils

function createBig5(sheet, path) {
  const keys = [
    'type',
    'name',
    'lower',
    'upper',
    'threshold',
    'fiveThreshold',
    'fiveThreshold',
    'fiveThreshold',
    'fiveThreshold',
    'fiveThreshold',
    'fiveThreshold'
  ]
  let big5 = [2, 3, 4, 5, 6].map(row => {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(col => {
      let adr = utils.encode_cell({c:col, r:row})
      let cell = sheet[adr]
      return (cell) ? cell.v : null
    }).reduce((data, value, index) => {
      let key = keys[index]
      if (key == 'fiveThreshold') {
        if (!data[key]) {
          data[key] = []
        }
        data[key].push(value)
      } else {
        data[key] = value
      }
      return data
    }, {})
  })

  let result = JSON.stringify(big5, null, '  ')
  fs.writeFileSync(`${path}/big5.json`, result)

  return big5
}

function createQuestions(sheet, big5, path) {
  const big5NameToType = big5.reduce((data, e) => {
    data[e.name] = e.type
    return data
  }, {})

  const keys = [ "type", "text", "score" ]
  let length = utils.decode_range(sheet['!ref']).e.r
  let questions = Array.apply(null, { length:length }).map((undef, index) => {
    let row = index + 1
    return [0, 1, 5].map(col => {
      let adr = utils.encode_cell({c:col, r:row})
      let cell = sheet[adr]
      return (cell) ? cell.v : null
    }).reduce((data, value, index) => {
      let key = keys[index]
      if (key == 'type') {
        data[key] = big5NameToType[value]
      } else if (key == 'text') {
        data[key] = value
      } else if (key == 'score') {
        if (!value) {
          data.scoreNo = 1;
          data.scoreNeither = 2;
          data.scoreYes = 3;
        } else {
          data.scoreNo = 3;
          data.scoreNeither = 2;
          data.scoreYes = 1;
        }
      }
      return data
    }, {
      number: index
    })
  })

  let result = JSON.stringify(questions, null, '  ')
  fs.writeFileSync(`${path}/questions.json`, result)
}

function createPersonality(sheet, path) {
  const keys = [ "id", "name", "shortDescription", "longDescription" ]
  let personality = Array.apply(null, { length: 32 }).map((undef, index) => {
    let row = index + 1
    return [0, 1, 7, 8].map(col => {
      let adr = utils.encode_cell({c:col, r:row})
      let cell = sheet[adr]
      return (cell) ? cell.v : null
    }).reduce((data, value, index) => {
      let key = keys[index]
      data[key] = value
      return data
    }, {})
  }).reduce((data, value) => {
    let binaryNumber = (value.id - 1).toString(2)
    let key = '#' + ('00000' + binaryNumber).slice(-5)
    data[key] = value
    return data
  }, {})

  let result = JSON.stringify(personality, null, '  ')
  fs.writeFileSync(`${path}/personality.json`,
                   result.replace(/#([0,1]{5})/g, '$1'))

  return personality
}

function createPersonalityCompatibility(sheet, personality, path) {
  let personalityNameToKey = Object.keys(personality).reduce((data, key) => {
    data[personality[key].name] = key
    return data
  }, {})

  let keys = Array.apply(null, { length: 32 }).map((undef, index) => {
    let col = index + 1
    let adr = utils.encode_cell({c:col, r:0})
    let value = sheet[adr].v
    return Object.keys(personality).find(key => personality[key].name == value)
  })

  let personalityCompatibility = Array.apply(null, { length: 32 }).map((undef, index) => {
    let row = index + 1
    return Array.apply(null, { length: 33 }).map((undef, col) => {
      let adr = utils.encode_cell({c:col, r:row})
      let cell = sheet[adr]
      return (cell) ? cell.v : null
    }).reduce((data, value, index) => {
      if (index == 0) {
        data['key'] = personalityNameToKey[value]
      } else {
        data[keys[index-1]] = value
      }
      return data
    }, {})
  }).reduce((data, value) => {
    let key = value.key
    delete value.key
    data[key] = value
    return data
  }, {})

  let result = JSON.stringify(personalityCompatibility, null, '  ')
  fs.writeFileSync(`${path}/personality_compatibility.json`,
                   result.replace(/#([0,1]{5})/g, '$1'))
}

function createBig5Combination(sheet, big5, path) {
  const big5NameToType = big5.reduce((data, e) => {
    data[e.name] = e.type
    return data
  }, {})

  let big5Combination = [1, 3, 5, 7, 9].map(x => {
    return [0, 1].map(y => {
      let row = x + y
      return [2, 3].map(col => {
        let adr = utils.encode_cell({c:col, r:row})
        return sheet[adr].v
      }).reduce((data, value, index) => {
        data[ (index == 0) ? 'high' : 'low'] = value
        return data
      }, {})
    }).reduce((data, value, index) => {
      data[ (index == 0) ? 'high' : 'low'] = value
      return data
    }, {})
  }).reduce((data, value, index) => {
    let adr = utils.encode_cell({c:0, r:(index * 2) + 1})
    let type = big5NameToType[sheet[adr].v]
    data[type] = value
    return data
  }, {})

  let result = JSON.stringify(big5Combination, null, '  ')
  fs.writeFileSync(`${path}/big5_combination.json`, result)
}

console.log('\u001b[32mSTART\u001b[37m : まるさんかくマスターデータ変換')

const book = xlsx.readFile('inputs/まるさんかくマスターデータ.xlsx')

console.log('ビッグファイブ')
let big5 = createBig5(book.Sheets['ビッグファイブ'], 'outputs')

console.log('設問')
createQuestions(book.Sheets['設問'], big5, 'outputs')

console.log('偉人診断結果')
let personality = createPersonality(book.Sheets['偉人診断結果'], 'outputs')

console.log('相性診断結果概要')
createPersonalityCompatibility(book.Sheets['相性診断結果概要'], personality, 'outputs')

console.log('相性診断結果詳細')
createBig5Combination(book.Sheets['相性診断結果詳細'], big5, 'outputs')

console.log('\u001b[32mEND\u001b[37m : まるさんかくマスターデータ変換')
