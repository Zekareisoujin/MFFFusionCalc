var calculate = function () {
    var type = $('input[name=card-type-radio]:checked').val();
    var targetCard = $('#target-card-select').val();
    var targetRarity = $('#target-rarity-select').val();
    var targetRate = $('#target-fusion-rate').val();
    var fodderCard = $('#fodder-card-select').val();
    var fodderRarity = $('#fodder-rarity-select').val();
    var fodderRate = $('#fodder-fusion-rate').val();
    var md = $('#mobius-day').prop('checked') ? 'mobius' : 'standard';
    var mogAmulet = $('#mog-amulet').prop('checked');
    var bankSave = $('#bank-save').prop('checked');
    var slotCount = 5;
    var mainTable, fodderTable, targetLevel, fodderLevel;

    if (type == 'attack') {
        targetLevel = parseInt(targetRarity) * 2;
        fodderLevel = parseInt(fodderRarity) * 2;
    } else {
        targetLevel = parseInt(targetRarity) + 1;
        fodderLevel = parseInt(fodderRarity) + 1;
    }

    if (targetCard == fodderCard && targetRarity == fodderRarity)
        mainTable = targetCard == 'gacha' ? 'gacha' : 'drop';
    else
        mainTable = 'mix';

    fodderTable = fodderCard == 'gacha' ? 'gacha' : 'drop';

    if (mogAmulet) {
        slotCount = 4;
        targetRate = Math.ceil(targetRate * 2 / 3);
    }

    var targetRateTable = FusionTable[type][mainTable][md];
    var calc = Calc(targetRateTable, FusionTable[type][fodderTable][md]);
    var ret = calc.compute(targetLevel, targetRate, fodderLevel, fodderRate, slotCount, bankSave);
    var cardCost = ret.cardCost;
    var fodderCost = ret.fodderCost;

    var getBasketContent = function (basket) {
        var basketContent = {};
        for (var j = 0; j < basket.length; j++) {
            var item = [j];
            if (basketContent[item] == undefined) {
                var ctn = {};
                ctn.rate = targetRateTable[i][item];
                ctn.count = 1;
                basketContent[item] = ctn;
            } else
                basketContent[item].count++;
        }
        return basketContent;
    }

    // Render table
    var total = 0;
    var bankTotal = 0;
    var tbody = $('#card-fusion-table tbody').empty();
    for (var i = 0; i < cardCost.length; i++) {
        var contentStr = '';
        var costStr = '';
        var cummulativeCostStr = '';
        var cummulativeBankCostStr = '';

        if (cardCost[i].cost > 0) {
            total += cardCost[i].cost;
            bankTotal += cardCost[i].basket.length;

            var basketContent = getBasketContent(cardCost[i].basket)
            for (var key in basketContent) {
                contentStr += basketContent[key].count + 'x AL' + (parseInt(key) + 1) + ' (' + basketContent[key].rate + '% each); ';
            }

            costStr = cardCost[i].cost + 'x AL1 cards';
            cummulativeCostStr = total + 'x AL1 cards';
            cummulativeBankCostStr = bankTotal + ' slots';
            if (fodderCard == 'gacha')
                cummulativeCostStr += ' - ' + CardOption[fodderCard].price[fodderRarity] * total + ' tickets';
        } else {
            costStr = cummulativeCostStr = cummulativeBankCostStr = 'N/A';
            contentStr = 'Not achievable';
        }

        var tr = $('<tr>');
        tr.append($('<td>').html((i + 1) + ' &rarr; ' + (i + 2)));
        tr.append($('<td>').text(contentStr));
        tr.append($('<td>').text(costStr));
        tr.append($('<td>').text(cummulativeCostStr));
        tr.append($('<td>').text(cummulativeBankCostStr));

        tbody.append(tr);
    }

    total = 0;
    tbody = $('#fodder-fusion-table tbody').empty();
    for (var i = 0; i < fodderCost.length; i++) {
        var contentStr = '';
        var costStr = '';
        var cummulativeCostStr = '';

        if (fodderCost[i].cost > 0) {
            total += fodderCost[i].cost;

            var basketContent = getBasketContent(fodderCost[i].basket)
            for (var key in basketContent) {
                contentStr += basketContent[key].count + 'x AL' + (parseInt(key) + 1) + ' (' + basketContent[key].rate + '% each); ';
            }

            costStr = cardCost[i].cost + 'x AL1 cards';
            cummulativeCostStr = total + 'x AL1 cards';
        }else {
            costStr = cummulativeCostStr = 'N/A';
            contentStr = 'Not achievable';
        }

        var tr = $('<tr>');
        tr.append($('<td>').html((i + 1) + ' &rarr; ' + (i + 2)));
        tr.append($('<td>').text(contentStr));
        tr.append($('<td>').text(costStr));
        tr.append($('<td>').text(cummulativeCostStr));

        tbody.append(tr);
    }
}

var filterSelect = function (elem, list) {
    var elemVal = (typeof list[0] == 'number' ? parseInt(elem.val()) : elem.val());
    var isDisabled = list.indexOf(elemVal) < 0;
    elem.prop('disabled', isDisabled);
}

var fodderRarityFilter = function () {
    var card = $('#fodder-card-select').val();
    var rarity = CardOption[card].rarity;
    var actualRarityAllowed = [];

    if (card == $('#target-card-select').val()) {
        var targetRarity = $('#target-rarity-select').val();
        for (var i = 0; i < rarity.length; i++) {
            if (rarity[i] <= targetRarity)
                actualRarityAllowed.push(rarity[i]);
        }
    } else
        actualRarityAllowed = rarity;

    $('#fodder-rarity-select option').each(function () {
        filterSelect($(this), actualRarityAllowed);
    });
    $('#fodder-rarity-select').val(actualRarityAllowed[0]);
    calculate();
}

$('#target-card-select').on('change', function () {
    var card = $(this).val();
    var fodderAllowed = CardOption[card].fodder;
    var rarityAllowed = CardOption[card].rarity;

    $('#target-rarity-select option').each(function () {
        filterSelect($(this), rarityAllowed);
    });
    $('#target-rarity-select').val(rarityAllowed[0]);

    $('#fodder-card-select option').each(function () {
        filterSelect($(this), fodderAllowed);
    });
    $('#fodder-card-select').val(fodderAllowed[0]);

    fodderRarityFilter();
});

$('#target-rarity-select').on('change', fodderRarityFilter);
$('#fodder-card-select').on('change', fodderRarityFilter);
$('#fodder-rarity-select').on('change', calculate);
$('input:radio').on('change', calculate);
$('input:checkbox').on('change', calculate);
$('input[type=number]').on('change', calculate);
$('#target-card-select').trigger('change');
// $('#calculate').on('click', calculate);