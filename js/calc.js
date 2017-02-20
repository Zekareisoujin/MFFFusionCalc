const max_slot = 5;

CardOption = {
    'attack': {
        'gacha': {
            'rarity': [3, 4, 5],
            'fodderRarity': [3, 4, 5],
            'fodder': ['gacha', 'drop'],
            'price': { 3: 3, 4: 5, 5: 8 },
        },

        'sicarius': {
            'rarity': [3, 4, 5],
            'fodderRarity': [3],
            'fodder': ['sicarius'],
        },

        'drop': {
            'rarity': [1, 2, 3],
            'fodderRarity': [1, 2, 3],
            'fodder': ['drop'],
        }
    },

    'support' : {
        'gacha': {
            'rarity': [3, 4, 5],
            'fodderRarity': [3, 4, 5],
            'fodder': ['gacha', 'drop'],
            'price': { 3: 3, 4: 5, 5: 8 },
        },

        'drop': {
            'rarity': [1, 2, 3, 4],
            'fodderRarity': [1, 2, 3, 4],
            'fodder': ['drop'],
        }
    }
}

FusionTable = {
    'attack': {

        'gacha': {
            'standard': [
                [100],
                [50, 70, 100],
                [50, 70, 100],
                [30, 40, 60, 90, 100],
                [25, 35, 55, 85, 100],
                [20, 25, 35, 50, 70, 95, 100],
                [15, 20, 30, 45, 65, 90, 100],
                [10, 13, 19, 28, 40, 55, 73, 94, 100],
                [10, 13, 19, 28, 40, 55, 73, 94, 100]
            ],

            'mobius': [
                [100],
                [60, 84, 100],
                [60, 84, 100],
                [36, 48, 72, 100],
                [30, 42, 66, 100],
                [24, 30, 42, 60, 84, 100],
                [18, 24, 36, 54, 78, 100],
                [12, 15, 22, 33, 48, 66, 87, 100],
                [12, 15, 22, 33, 48, 66, 87, 100],
            ]
        },

        'mix': {
            'standard': [
                [40, 80, 100],
                [20, 40, 80, 100],
                [20, 40, 80, 100],
                [10, 20, 40, 70, 100],
                [10, 20, 40, 70, 100],
                [5, 10, 20, 35, 55, 80, 100],
                [5, 10, 20, 35, 55, 80, 100],
                [3, 6, 12, 20, 33, 48, 66, 87, 100],
                [3, 6, 12, 20, 33, 48, 66, 87, 100]
            ],

            'mobius': [
                [48, 96, 100],
                [24, 48, 96, 100],
                [24, 48, 96, 100],
                [12, 24, 48, 84, 100],
                [12, 24, 48, 84, 100],
                [6, 12, 24, 42, 66, 96],
                [6, 12, 24, 42, 66, 96],
                [4, 7, 14, 25, 39, 57, 79, 100],
                [4, 7, 14, 25, 39, 57, 79, 100],
            ]
        },

        'drop': {
            'standard': [
                [50, 100],
                [30, 50, 100],
                [30, 50, 100],
                [20, 30, 50, 80, 100],
                [20, 30, 50, 80, 100]
            ],

            'mobius': [
                [60, 100],
                [36, 60, 100],
                [36, 60, 100],
                [24, 36, 60, 96, 100],
                [24, 36, 60, 96, 100],
            ]
        }
    },

    'support': {

        'gacha': {
            'standard': [
                [100],
                [50, 70, 100],
                [25, 35, 85, 100],
                [15, 20, 45, 90, 100],
                [10, 13, 28, 55, 94]
            ],

            'mobius': [
                [100],
                [60, 84, 100],
                [30, 42, 100],
                [18, 24, 54, 100],
                [12, 16, 34, 66, 100]
            ]

        },

        'mix': {
            'standard': [
                [40, 80, 100],
                [20, 40, 100],
                [10, 20, 70, 100],
                [5, 10, 35, 80, 100],
                [3, 6, 21, 48, 87],
            ],

            'mobius': [
                [48, 96, 100],
                [24, 48, 100],
                [12, 24, 84, 100],
                [6, 12, 42, 96, 100],
                [4, 7, 25, 57, 100],
            ]

        },

        'drop': {
            'standard': [
                [50, 100],
                [30, 50, 100],
                [20, 33, 80, 100],
                [5, 10, 35, 80, 100]
            ],

            'mobius': [
                [60, 100],
                [36, 60, 100],
                [24, 40, 96, 100],
                [6, 12, 42, 96, 100]
            ]
        },

    },
}

var Calc = function (crossRateTable, fodderRateTable) {

    var fodderCost, fodderFusionTable, cardFusionTable;

    // cbf with knapsack, gonna just go with greedy approach
    var fillSlot = function (targetLevel, slot, rate, rateTable, notGreedy) {
        var idx = targetLevel - 1;
        // console.log(idx);
        var cap = Math.min(rateTable[idx].length, fodderCost.length);
        var minBasket = { 'cost': -1, 'basket': [] };

        var start = (notGreedy ? cap - 1 : 0);

        for (var i = start; i < cap; i++) {
            var rateLeft = rate - rateTable[idx][i];
            if (rateLeft <= 0) {
                if (minBasket.cost < 0 || minBasket.cost > fodderCost[i] || (minBasket.cost == fodderCost[i] && minBasket.basket.length > 1))
                    return { 'cost': fodderCost[i], 'basket': [i] };
                else
                    return minBasket;
            } else if (slot - 1 > 0) {
                var more = fillSlot(targetLevel, slot - 1, rateLeft, rateTable, notGreedy);
                if ((more.cost > 0) && (minBasket.cost < 0 || minBasket.cost > more.cost + fodderCost[i] || (minBasket.cost == more.cost + fodderCost[i] && minBasket.basket.length > more.basket.length + 1))) {
                    more.cost += fodderCost[i];
                    more.basket.push(i);
                    minBasket = more;
                }
            }
        }

        return minBasket;
    }

    var prepFodder = function (maxLvl, minimumRate) {
        fodderCost = [1];
        fodderFusionTable = [];
        for (var i = 1; i < maxLvl; i++) {
            var set = fillSlot(i, 5, minimumRate, fodderRateTable);
            fodderFusionTable.push(set);
            fodderCost[i] = fodderCost[i - 1];
            for (var j = 0; j < set.basket.length; j++) {
                fodderCost[i] += fodderCost[set.basket[j]];
            }
        }
    }

    var calculateCardCost = function (maxLvl, minimumRate, slotCount, notGreedy) {
        cardFusionTable = [];
        for (var i = 1; i < maxLvl; i++) {
            var data = fillSlot(i, slotCount, minimumRate, crossRateTable, notGreedy);
            cardFusionTable.push(data);
        }
    }

    return {
        compute: function (cardLevel, cardRate, fodderLevel, fodderRate, slotCount, notGreedy) {
            prepFodder(fodderLevel, fodderRate);
            calculateCardCost(cardLevel, cardRate, slotCount, notGreedy);
            return { 'cardCost': cardFusionTable, 'fodderCost': fodderFusionTable };
        }
    }
}
