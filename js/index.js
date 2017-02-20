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
    var slotCount = 5;
    var mainTable, fodderTable, targetLevel, fodderLevel;

    if (type == 'attack') {
        targetLevel = targetRarity*2;
        fodderLevel = fodderRarity*2;
    }else {
        targetLevel = targetRarity + 1;
        fodderLevel = fodderRarity + 1;
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

    crossRateTable = FusionTable[type][mainTable][md];
    fodderRateTable = FusionTable[type][fodderTable][md];

    prepFodder(fodderLevel, fodderRate);
    var ret = cardCost(targetLevel, 5, targetRate);
    
    // Render table
    var total = 0;
    var tbody = $('tbody').empty();
    for (var i=0; i<ret.length; i++) {
        total += ret[i].cost;

        var basketContent = {};
        for (var j=0; j<ret[i].basket.length; j++) {
            var item = ret[i].basket[j];
            if (basketContent[item] == undefined) {
                var ctn = {};
                ctn.rate = crossRateTable[i][item];
                ctn.count = 1;
                basketContent[item] = ctn;
            }else
                basketContent[item].count++;
        }

        var contentStr = '';
        for (var key in basketContent) {
            contentStr += basketContent[key].count + 'x AL' + key + ' card(s) (' + basketContent[key].rate + '% each); ';
        }

        var tr = $('<tr>');
        tr.append($('<td>').html((i+1) +  ' &rarr; ' + (i+2)));
        tr.append($('<td>').text(contentStr));
        tr.append($('<td>').text(ret[i].cost + 'x AL1 cards'));
        tr.append($('<td>').text(total + 'x AL1 cards'));
        
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
$('#mobius-day').on('change', calculate);
$('#mog-amulet').on('change', calculate);
$('#target-card-select').trigger('change');
// $('#calculate').on('click', calculate);