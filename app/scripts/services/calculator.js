app.factory('calculator', function () {
    var service = {};
    /*  Räkna ut grundavdraget i kronor givet en förvärvsinkomst (FFI), dvs månadslön, och 
        aktuellt prisbasbelopp (PBB). 
    */

    // Prisbasbelopp
    var PBB = 44500;
    // Kommunal inkomstskatt
    var KI = .3199;

    // Skiktgränser för statlig inkomstskatt
    var SG1 = 421800;
    var SG2 = 616100;

    // Jämstäldhetsbonus per dag
    var JBdag = 50;
    var JBreserveradeManader = 4;

    // Barnbidrag per månad
    var BB = 1050;

    function getGA(FFI, jobbManader, PBB) {
        var GA;
        if (FFI < 0.99 * PBB) {
            GA = 0.423 * PBB;
        }
        else if (FFI < 2.72 * PBB) {
            GA = 0.225 * PBB + 0.2 * FFI;
        }
        else if (FFI < 3.11 * PBB) {
            GA = 0.770 * PBB;
        }
        else if (FFI < 7.88 * PBB) {
            GA = 1.081 * PBB - 0.1 * FFI;
        }
        else {
            GA = 0.293 * PBB;
        }
        /*  Grundavdraget avrundas uppåt till närmaste 100-tal
            http://www.skatteverket.se/download/18.18e1b10334ebe8bc8000115152/kapitel_11.pdf
        */
        return Math.ceil( GA / 100 ) * 100 * jobbManader / 12;
    }
    /*  Räkna ut skatten i kronor givet en viss inkomst
    */
    function getSkatt(TI, jobbManader) {
        // Obs! Lön per månad här
        var GA = getGA( TI, jobbManader, PBB );

        return ( TI - GA ) * KI +
            Math.max(0, ( TI - GA - SG1 ) * 0.2 ) +
            Math.max(0, ( TI - GA - SG2 ) * 0.05 );
    }
    /*  Räkna ut jobbskatteavdraget (JSA) i kronor givet en arbetsinkomst per månad (AI),
        kommunal inkomstskatt (KI) och aktuellt prisbasbelop (PBB).
    */
    function getJSA (AI, jobbManader, KI, PBB) {
        // Räkna ut grundavdraget
        var GA = getGA(AI, jobbManader, PBB);

        if (AI < 0.91 * PBB) {
            return (AI - GA) * KI;
        }
        else if (AI < 2.94 * PBB) {
            return (0.91 * PBB + 0.332 * ( AI - 0.91 * PBB ) - GA ) * KI;
        }
        else if (AI < 8.08 * PBB) {
            return (1.584 * PBB + 0.111 * ( AI - 2.94 * PBB ) - GA ) * KI;
        }
        else if (AI < 13.48 * PBB) {
            return ( 2.155 * PBB - GA ) * KI;
        }
        else {
            return Math.max( 0, 2.155 * PBB - GA ) * KI - 0.03 * ( AI - 13.84 * PBB );
        }
    }
    /*  Räkna ut föräldrapenningen (FP) per månad givet en månadslön och det aktuella prisbasbeloppet (PBB).
    */
    function getFP(lonManad, PBB) {
        var lonAr = lonManad * 12;
        var FPTak = PBB * 10
        // Om lönen är över inkomsttaket:
        if (lonAr > FPTak) {
            return 0.8 * 0.97 * ( 10 * PBB / 365 ) * 30;
        }
        // Om lönen är under inkomsttaket:
        else {
            return (lonAr * 0.8 * 0.97 ) / 365 * 30;
        }
    }

    /*  Räkna ut föräldralönen givet en viss månadslön och det aktuella prisbasbeloppet
    */
    function getFL(lonManad, PBB) {
        var lonAr = lonManad * 12;
        var FPTak = PBB * 10;
        // Om lönen är över inkomsttaket:
        if (lonAr > FPTak) {
            return lonManad - 30 * 0.8 * 10 * PBB / 365 - 30 * 0.1 * lonAr / 365; 
        }
        // Om lönen är under inkomsttaket:
        else {
            return lonManad - 30 * 0.9 * lonAr / 365;
        }
    }

    function getJB(ledigaManader, JBdag, JBreserveradeManader) {
        // Antal månader som berättigar till JB
        var manader = Math.min(ledigaManader, 12 - ledigaManader) - JBreserveradeManader;
        return Math.max(manader, 0) * 30 * JBdag;
    }

    service.inkomstSpec = function(lonManad, ledigaManader, foraldralonManaderMax) {
        var jobbManader = 12 - ledigaManader;
        var foraldralonManader = Math.min(foraldralonManaderMax, ledigaManader);
        
        var lonJobb = lonManad * jobbManader;
        var FP = getFP( lonManad, PBB ) * ledigaManader;
        var FL = getFL( lonManad, PBB ) * foraldralonManader;

        var inkomstskatt = getSkatt( lonJobb, jobbManader );
        var JSA = getJSA( lonJobb, jobbManader, KI, PBB );
        var skatteprocentUtanJSA = inkomstskatt / lonJobb;
        var skatteprocentMedJSA = ( inkomstskatt - JSA ) / lonJobb;

        var JB = getJB(ledigaManader, JBdag, JBreserveradeManader)
        /*  Månadslön
            - GA
            = beskattningsbar inkomrt

        */
        var inkomstSpec = {
            'lonBrutto': {
                label: 'Bruttolön',
                value: lonJobb,
                type: 'brutto',
                order: 1
            },
            'inkomstskatt': {
                label: 'Skatt på arbetsinkomst',
                value: inkomstskatt,
                type: 'skatt',
                order: 1.1
            },
            'GA': {
                label: 'Grundavdrag',
                value: getGA(lonManad, jobbManader, PBB),
                order: 1.15
            },
            'JSA': {
                label: 'Jobbskatteavdrag',
                value: JSA,
                type: 'skatt',
                order: 1.2
            },
            'lonNetto': {
                label: 'Nettolön',
                value: ( lonJobb - inkomstskatt - JSA ),
                type: 'netto',
                order: 2
            },
            'FPbrutto': {
                label: 'Föräldrapenning före skatt',
                value: FP,
                type: 'brutto',
                order: 3
            },
            'FPnetto': {
                label: 'Föräldrapenning efter skatt',
                value: ( FP - FP * skatteprocentUtanJSA ),
                type: 'netto',
                order: 4
            },
            'skatteprocentUtanJSA': {
                label: 'Skatteprocent utan JSA',
                value: skatteprocentUtanJSA * 100,
                order: 2.5
            },
            'FLbrutto': {
                label: 'Föräldralön före skatt',
                value: FL,
                type: 'brutto',
                order: 5
            },
            'FLnetto': {
                label: 'Föräldralön efter skatt',
                value: ( FL - FL * skatteprocentMedJSA ),   
                type: 'netto',
                order: 6
            },
            'skatteprocentMedJSA': {
                label: 'Skatteprocent med JSA',
                value: skatteprocentMedJSA * 100,
                order: 2.5
            },
            'JB': {
                label: 'Jämställdhetsbonus',
                value: JB,
                type: 'skattefri',
                order: 7
            },
            'BB': {
                label: 'Barnbidrag',
                value: BB / 2 * 12,
                type: 'skattefri',
                order: 8            
            },
            'totalBrutto': {
                label: 'Total bruttoinkomst',
                type: 'total',
                value: 0,
                order: 9
            },
            'totalNetto': {
                label: 'Total nettoinkomst',
                type: 'total',
                value: 0,
                order: 10
            }
        }
        angular.forEach(inkomstSpec, function(d, key) {
            if (d.type == 'netto') {
                inkomstSpec.totalNetto.value += d.value;
            }
            if (d.type == 'brutto') {
                inkomstSpec.totalBrutto.value += d.value;
            }
            if (d.type == 'skattefri') {
                inkomstSpec.totalNetto.value += d.value;
                inkomstSpec.totalBrutto.value += d.value;               
            }
        });
        return inkomstSpec;
            
    }

    return service;

});