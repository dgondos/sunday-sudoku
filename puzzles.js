/* Generated internally. Rebuild with node scripts/generate-puzzles.js. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.SudokuPuzzles = factory(); }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  return {
  "version": 1,
  "attribution": "Generated internally by Sunday Sudoku randomized backtracking and unique-solution clue removal; no online puzzle bank used.",
  "generationSeed": 1398096975,
  "generationTrials": 25,
  "classifier": {
    "easy": "Unique; naked-single closure completes.",
    "medium": "Unique; naked singles stall, naked + hidden-single closure completes.",
    "hard": "Unique; singles stall, singles + locked candidates (pointing/claiming) + naked pairs complete.",
    "expert": "Unique within 100000 search nodes; implemented logical closure stalls. Search or techniques beyond this engine are required."
  },
  "levels": {
    "easy": [
      {
        "id": "easy-01",
        "givens": "803010004600008130140003000008070950704025060000680027001209040056040010007000598",
        "solution": "893512674672498135145763289268374951714925863539681427381259746956847312427136598",
        "rating": {
          "difficulty": "easy",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": true,
          "requiresSearch": false,
          "hardestTechnique": "naked-single",
          "clues": 36,
          "techniques": {
            "nakedSingles": 45,
            "hiddenSingles": 0,
            "lockedCandidates": 0,
            "nakedPairs": 0
          },
          "remaining": 0,
          "searchNodes": 46,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 2
      },
      {
        "id": "easy-02",
        "givens": "005108000010062947700034180601007002030025010080000450800741020000090001092800004",
        "solution": "945178263318562947726934185651487392439625718287319456863741529574296831192853674",
        "rating": {
          "difficulty": "easy",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": true,
          "requiresSearch": false,
          "hardestTechnique": "naked-single",
          "clues": 36,
          "techniques": {
            "nakedSingles": 45,
            "hiddenSingles": 0,
            "lockedCandidates": 0,
            "nakedPairs": 0
          },
          "remaining": 0,
          "searchNodes": 46,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 3
      },
      {
        "id": "easy-03",
        "givens": "000050800064208001510009300426915080000800600091600425180007000047020900200300100",
        "solution": "932154867764238591518769342426915783375842619891673425183497256647521938259386174",
        "rating": {
          "difficulty": "easy",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": true,
          "requiresSearch": false,
          "hardestTechnique": "naked-single",
          "clues": 36,
          "techniques": {
            "nakedSingles": 45,
            "hiddenSingles": 0,
            "lockedCandidates": 0,
            "nakedPairs": 0
          },
          "remaining": 0,
          "searchNodes": 46,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 4
      },
      {
        "id": "easy-04",
        "givens": "100000008864500093000063051600008004002301060490006010000100900740039080050284107",
        "solution": "135492678864517293279863451617958324582341769493726815328175946741639582956284137",
        "rating": {
          "difficulty": "easy",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": true,
          "requiresSearch": false,
          "hardestTechnique": "naked-single",
          "clues": 36,
          "techniques": {
            "nakedSingles": 45,
            "hiddenSingles": 0,
            "lockedCandidates": 0,
            "nakedPairs": 0
          },
          "remaining": 0,
          "searchNodes": 46,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 6
      },
      {
        "id": "easy-05",
        "givens": "000041700274060301130002008080100200012053000300204009801009002690000000720608930",
        "solution": "958341726274865391136792458589176243412953867367284519841539672693427185725618934",
        "rating": {
          "difficulty": "easy",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": true,
          "requiresSearch": false,
          "hardestTechnique": "naked-single",
          "clues": 36,
          "techniques": {
            "nakedSingles": 45,
            "hiddenSingles": 0,
            "lockedCandidates": 0,
            "nakedPairs": 0
          },
          "remaining": 0,
          "searchNodes": 46,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 7
      },
      {
        "id": "easy-06",
        "givens": "000080300920010080060500420009830270230060100600109040450970030800040001300208904",
        "solution": "745682319923417685168593427519834276234765198687129543456971832892346751371258964",
        "rating": {
          "difficulty": "easy",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": true,
          "requiresSearch": false,
          "hardestTechnique": "naked-single",
          "clues": 36,
          "techniques": {
            "nakedSingles": 45,
            "hiddenSingles": 0,
            "lockedCandidates": 0,
            "nakedPairs": 0
          },
          "remaining": 0,
          "searchNodes": 46,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 8
      },
      {
        "id": "easy-07",
        "givens": "100080793783600000209430080035000870800000006004050002300004218000070365001020907",
        "solution": "146285793783619524259437681635142879812793456974856132397564218428971365561328947",
        "rating": {
          "difficulty": "easy",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": true,
          "requiresSearch": false,
          "hardestTechnique": "naked-single",
          "clues": 36,
          "techniques": {
            "nakedSingles": 45,
            "hiddenSingles": 0,
            "lockedCandidates": 0,
            "nakedPairs": 0
          },
          "remaining": 0,
          "searchNodes": 46,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 9
      },
      {
        "id": "easy-08",
        "givens": "009003080006020000208910050090041027000030400574000301007102900100304005030876140",
        "solution": "719563284356428719248917653893641527621735498574289361487152936162394875935876142",
        "rating": {
          "difficulty": "easy",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": true,
          "requiresSearch": false,
          "hardestTechnique": "naked-single",
          "clues": 36,
          "techniques": {
            "nakedSingles": 45,
            "hiddenSingles": 0,
            "lockedCandidates": 0,
            "nakedPairs": 0
          },
          "remaining": 0,
          "searchNodes": 46,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 10
      }
    ],
    "medium": [
      {
        "id": "medium-01",
        "givens": "003010004600008130140003000008070950704025060000680027001209040056040000007000598",
        "solution": "893512674672498135145763289268374951714925863539681427381259746956847312427136598",
        "rating": {
          "difficulty": "medium",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": true,
          "requiresSearch": false,
          "hardestTechnique": "hidden-single",
          "clues": 34,
          "techniques": {
            "nakedSingles": 35,
            "hiddenSingles": 12,
            "lockedCandidates": 0,
            "nakedPairs": 0
          },
          "remaining": 0,
          "searchNodes": 114,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 2
      },
      {
        "id": "medium-02",
        "givens": "005100000010062947700004180601007002030025010080000400800741000000090001002800004",
        "solution": "945178263318562947726934185651487392439625718287319456863741529574296831192853674",
        "rating": {
          "difficulty": "medium",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": true,
          "requiresSearch": false,
          "hardestTechnique": "hidden-single",
          "clues": 31,
          "techniques": {
            "nakedSingles": 38,
            "hiddenSingles": 12,
            "lockedCandidates": 0,
            "nakedPairs": 0
          },
          "remaining": 0,
          "searchNodes": 77,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 3
      },
      {
        "id": "medium-03",
        "givens": "000000800064208001510009300426905080000000600091600425180007000047020900200300000",
        "solution": "932154867764238591518769342426915783375842619891673425183497256647521938259386174",
        "rating": {
          "difficulty": "medium",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": true,
          "requiresSearch": false,
          "hardestTechnique": "hidden-single",
          "clues": 32,
          "techniques": {
            "nakedSingles": 44,
            "hiddenSingles": 5,
            "lockedCandidates": 0,
            "nakedPairs": 0
          },
          "remaining": 0,
          "searchNodes": 185,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 4
      },
      {
        "id": "medium-04",
        "givens": "140700005900010600000902003006290051891506000000800369200049530400000010050080492",
        "solution": "142763985935418627768952143376294851891536274524871369217649538489325716653187492",
        "rating": {
          "difficulty": "medium",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": true,
          "requiresSearch": false,
          "hardestTechnique": "hidden-single",
          "clues": 36,
          "techniques": {
            "nakedSingles": 35,
            "hiddenSingles": 10,
            "lockedCandidates": 0,
            "nakedPairs": 0
          },
          "remaining": 0,
          "searchNodes": 56,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 5
      },
      {
        "id": "medium-05",
        "givens": "000000008864500093000063050600008004002301060490006000000100900740039080000284107",
        "solution": "135492678864517293279863451617958324582341769493726815328175946741639582956284137",
        "rating": {
          "difficulty": "medium",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": true,
          "requiresSearch": false,
          "hardestTechnique": "hidden-single",
          "clues": 32,
          "techniques": {
            "nakedSingles": 37,
            "hiddenSingles": 12,
            "lockedCandidates": 0,
            "nakedPairs": 0
          },
          "remaining": 0,
          "searchNodes": 65,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 6
      },
      {
        "id": "medium-06",
        "givens": "000041700274060301130002008080100000012053000300204009801009002600000000700000930",
        "solution": "958341726274865391136792458589176243412953867367284519841539672693427185725618934",
        "rating": {
          "difficulty": "medium",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": true,
          "requiresSearch": false,
          "hardestTechnique": "hidden-single",
          "clues": 31,
          "techniques": {
            "nakedSingles": 40,
            "hiddenSingles": 10,
            "lockedCandidates": 0,
            "nakedPairs": 0
          },
          "remaining": 0,
          "searchNodes": 53,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 7
      },
      {
        "id": "medium-07",
        "givens": "000080300920010000000500420009830270030060100600000040450970000800000001300208904",
        "solution": "745682319923417685168593427519834276234765198687129543456971832892346751371258964",
        "rating": {
          "difficulty": "medium",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": true,
          "requiresSearch": false,
          "hardestTechnique": "hidden-single",
          "clues": 29,
          "techniques": {
            "nakedSingles": 44,
            "hiddenSingles": 8,
            "lockedCandidates": 0,
            "nakedPairs": 0
          },
          "remaining": 0,
          "searchNodes": 62,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 8
      },
      {
        "id": "medium-08",
        "givens": "100080793783600000009430000035000870800000006004050002300004218000070365001020907",
        "solution": "146285793783619524259437681635142879812793456974856132397564218428971365561328947",
        "rating": {
          "difficulty": "medium",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": true,
          "requiresSearch": false,
          "hardestTechnique": "hidden-single",
          "clues": 34,
          "techniques": {
            "nakedSingles": 41,
            "hiddenSingles": 6,
            "lockedCandidates": 0,
            "nakedPairs": 0
          },
          "remaining": 0,
          "searchNodes": 50,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 9
      }
    ],
    "hard": [
      {
        "id": "hard-01",
        "givens": "003010004600008030040003000000070950000020060000600027000009000056040000007000098",
        "solution": "893512674672498135145763289268374951714925863539681427381259746956847312427136598",
        "rating": {
          "difficulty": "hard",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": true,
          "requiresSearch": false,
          "hardestTechnique": "locked-candidate",
          "clues": 23,
          "techniques": {
            "nakedSingles": 40,
            "hiddenSingles": 18,
            "lockedCandidates": 6,
            "nakedPairs": 0
          },
          "remaining": 0,
          "searchNodes": 3910,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 2
      },
      {
        "id": "hard-02",
        "givens": "000041700274060301130002008080100000012053000300004009801009002600000000000000930",
        "solution": "958341726274865391136792458589176243412953867367284519841539672693427185725618934",
        "rating": {
          "difficulty": "hard",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": true,
          "requiresSearch": false,
          "hardestTechnique": "locked-candidate",
          "clues": 29,
          "techniques": {
            "nakedSingles": 32,
            "hiddenSingles": 20,
            "lockedCandidates": 16,
            "nakedPairs": 0
          },
          "remaining": 0,
          "searchNodes": 569,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 7
      },
      {
        "id": "hard-03",
        "givens": "000080793780600000009430000005000870800000006004000002300004018000070365001000900",
        "solution": "146285793783619524259437681635142879812793456974856132397564218428971365561328947",
        "rating": {
          "difficulty": "hard",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": true,
          "requiresSearch": false,
          "hardestTechnique": "naked-pair",
          "clues": 27,
          "techniques": {
            "nakedSingles": 50,
            "hiddenSingles": 4,
            "lockedCandidates": 7,
            "nakedPairs": 13
          },
          "remaining": 0,
          "searchNodes": 185,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 9
      },
      {
        "id": "hard-04",
        "givens": "009003080000020000208000050090040027000000400570000300000002900100304005030070100",
        "solution": "719563284356428719248917653893641527621735498574289361487152936162394875935876142",
        "rating": {
          "difficulty": "hard",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": true,
          "requiresSearch": false,
          "hardestTechnique": "locked-candidate",
          "clues": 24,
          "techniques": {
            "nakedSingles": 39,
            "hiddenSingles": 18,
            "lockedCandidates": 15,
            "nakedPairs": 0
          },
          "remaining": 0,
          "searchNodes": 1077,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 10
      },
      {
        "id": "hard-05",
        "givens": "365008700040000901109600000000104820900380006006020010600800000070000000098000007",
        "solution": "365918742847532961129647358753164829912385476486729513634871295571293684298456137",
        "rating": {
          "difficulty": "hard",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": true,
          "requiresSearch": false,
          "hardestTechnique": "locked-candidate",
          "clues": 28,
          "techniques": {
            "nakedSingles": 41,
            "hiddenSingles": 12,
            "lockedCandidates": 5,
            "nakedPairs": 0
          },
          "remaining": 0,
          "searchNodes": 83,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 16
      },
      {
        "id": "hard-06",
        "givens": "607920000003040000005000600000090130000300009400000080210000300008002005500803040",
        "solution": "687925413923146857145738692852697134761384529439251786214569378378412965596873241",
        "rating": {
          "difficulty": "hard",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": true,
          "requiresSearch": false,
          "hardestTechnique": "locked-candidate",
          "clues": 25,
          "techniques": {
            "nakedSingles": 40,
            "hiddenSingles": 16,
            "lockedCandidates": 7,
            "nakedPairs": 0
          },
          "remaining": 0,
          "searchNodes": 1711,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 17
      },
      {
        "id": "hard-07",
        "givens": "309000002701200009040006000006425030080000000400839015000500000000012300010000420",
        "solution": "359784162761253849248196573196425738583671294427839615632547981874912356915368427",
        "rating": {
          "difficulty": "hard",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": true,
          "requiresSearch": false,
          "hardestTechnique": "locked-candidate",
          "clues": 28,
          "techniques": {
            "nakedSingles": 35,
            "hiddenSingles": 18,
            "lockedCandidates": 4,
            "nakedPairs": 0
          },
          "remaining": 0,
          "searchNodes": 953,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 20
      },
      {
        "id": "hard-08",
        "givens": "000800003003002000090010280074030060030287540200050001000600090020000000608093004",
        "solution": "462875913813962457795314286574139862136287549289456371341628795927541638658793124",
        "rating": {
          "difficulty": "hard",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": true,
          "requiresSearch": false,
          "hardestTechnique": "locked-candidate",
          "clues": 29,
          "techniques": {
            "nakedSingles": 40,
            "hiddenSingles": 12,
            "lockedCandidates": 6,
            "nakedPairs": 0
          },
          "remaining": 0,
          "searchNodes": 81,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 25
      }
    ],
    "expert": [
      {
        "id": "expert-01",
        "givens": "587634201300900800002081300000020450940015720070400618000259000000340900020000000",
        "solution": "587634291361972845492581376813726459946815723275493618634259187158347962729168534",
        "rating": {
          "difficulty": "expert",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": false,
          "requiresSearch": true,
          "hardestTechnique": "search",
          "clues": 36,
          "techniques": {
            "nakedSingles": 18,
            "hiddenSingles": 6,
            "lockedCandidates": 0,
            "nakedPairs": 0
          },
          "remaining": 21,
          "searchNodes": 69,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 1
      },
      {
        "id": "expert-02",
        "givens": "000000800064208001010009300400005080000000600091600425180007000047020900200300000",
        "solution": "932154867764238591518769342426915783375842619891673425183497256647521938259386174",
        "rating": {
          "difficulty": "expert",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": false,
          "requiresSearch": true,
          "hardestTechnique": "search",
          "clues": 28,
          "techniques": {
            "nakedSingles": 17,
            "hiddenSingles": 13,
            "lockedCandidates": 0,
            "nakedPairs": 0
          },
          "remaining": 23,
          "searchNodes": 722,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 4
      },
      {
        "id": "expert-03",
        "givens": "140000005900000600000002003006200001891006000000000069200049530000000010050080492",
        "solution": "142763985935418627768952143376294851891536274524871369217649538489325716653187492",
        "rating": {
          "difficulty": "expert",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": false,
          "requiresSearch": true,
          "hardestTechnique": "search",
          "clues": 27,
          "techniques": {
            "nakedSingles": 0,
            "hiddenSingles": 16,
            "lockedCandidates": 12,
            "nakedPairs": 3
          },
          "remaining": 38,
          "searchNodes": 1176,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 5
      },
      {
        "id": "expert-04",
        "givens": "000000008860500093000063050600008004002301060090006000000100000740039080000284107",
        "solution": "135492678864517293279863451617958324582341769493726815328175946741639582956284137",
        "rating": {
          "difficulty": "expert",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": false,
          "requiresSearch": true,
          "hardestTechnique": "search",
          "clues": 29,
          "techniques": {
            "nakedSingles": 7,
            "hiddenSingles": 9,
            "lockedCandidates": 4,
            "nakedPairs": 1
          },
          "remaining": 36,
          "searchNodes": 208,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 6
      },
      {
        "id": "expert-05",
        "givens": "000000700274060300030002008080100000012053000000004009801009002600000000000000930",
        "solution": "958341726274865391136792458589176243412953867367284519841539672693427185725618934",
        "rating": {
          "difficulty": "expert",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": false,
          "requiresSearch": true,
          "hardestTechnique": "search",
          "clues": 24,
          "techniques": {
            "nakedSingles": 0,
            "hiddenSingles": 8,
            "lockedCandidates": 10,
            "nakedPairs": 0
          },
          "remaining": 49,
          "searchNodes": 2373,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 7
      },
      {
        "id": "expert-06",
        "givens": "100002900070009035050000270680000090009006000500010008008700000000080403300000000",
        "solution": "143572986872469135956138274681345792739826541524917368418753629297681453365294817",
        "rating": {
          "difficulty": "expert",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": false,
          "requiresSearch": true,
          "hardestTechnique": "search",
          "clues": 24,
          "techniques": {
            "nakedSingles": 1,
            "hiddenSingles": 19,
            "lockedCandidates": 12,
            "nakedPairs": 0
          },
          "remaining": 37,
          "searchNodes": 979,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 11
      },
      {
        "id": "expert-07",
        "givens": "407050910008000706050090200006701000270380000040905007702000504090000070000500691",
        "solution": "427658913918243756653197248536721489279384165841965327762819534195436872384572691",
        "rating": {
          "difficulty": "expert",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": false,
          "requiresSearch": true,
          "hardestTechnique": "search",
          "clues": 32,
          "techniques": {
            "nakedSingles": 7,
            "hiddenSingles": 17,
            "lockedCandidates": 4,
            "nakedPairs": 1
          },
          "remaining": 25,
          "searchNodes": 192,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 14
      },
      {
        "id": "expert-08",
        "givens": "607920000003040000005000600000090130000300009400000080210000000008002005500803040",
        "solution": "687925413923146857145738692852697134761384529439251786214569378378412965596873241",
        "rating": {
          "difficulty": "expert",
          "valid": true,
          "solvable": true,
          "unique": true,
          "solvedLogically": false,
          "requiresSearch": true,
          "hardestTechnique": "search",
          "clues": 24,
          "techniques": {
            "nakedSingles": 5,
            "hiddenSingles": 10,
            "lockedCandidates": 11,
            "nakedPairs": 3
          },
          "remaining": 42,
          "searchNodes": 4320,
          "searchLimit": 100000,
          "exhausted": false
        },
        "generationTrial": 17
      }
    ]
  }
};
}));
