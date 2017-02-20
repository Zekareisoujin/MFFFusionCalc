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

    // Render table
    var total = 0;
    var bankTotal = 0;
    var tbody = $('tbody').empty();
    for (var i = 0; i < ret.length; i++) {
        var contentStr = '';
        var costStr = '';
        var cummulativeCostStr = '';
        var cummulativeBankCostStr = '';

        if (ret[i].cost > 0) {
            total += ret[i].cost;
            bankTotal += ret[i].basket.length;
            var basketContent = {};
            for (var j = 0; j < ret[i].basket.length; j++) {
                var item = ret[i].basket[j];
                if (basketContent[item] == undefined) {
                    var ctn = {};
                    ctn.rate = targetRateTable[i][item];
                    ctn.count = 1;
                    basketContent[item] = ctn;
                } else
                    basketContent[item].count++;
            }

            for (var key in basketContent) {
                contentStr += basketContent[key].count + 'x AL' + (parseInt(key) + 1) + ' card(s) (' + basketContent[key].rate + '% each); ';
            }

            costStr = ret[i].cost + 'x AL1 cards';
            cummulativeCostStr = total + 'x AL1 cards';
            cummulativeBankCostStr = bankTotal + ' slots';
        }else {
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